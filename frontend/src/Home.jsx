
import { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { getRecommendations, getSchemeDetails } from "./services/api";

const MOCK_RECOMMENDATIONS = [
  {
    scheme_id: "SCH-EDU-001",
    scheme_name: "Education Support Scholarship",
    reason:
      "A strong potential match based on age, education status, location and income profile.",
  },
  {
    scheme_id: "SCH-EDU-014",
    scheme_name: "Student Financial Assistance",
    reason:
      "May help eligible students with education-related financial support.",
  },
  {
    scheme_id: "SCH-SKILL-008",
    scheme_name: "Skill Development Support",
    reason:
      "Could be relevant for building skills and improving future employment opportunities.",
  },
];

const DEFAULT_PROFILE = {
  age: "",
  gender: "Prefer not to say",
  state: "",
  district: "",
  area: "Urban",
  category: "General",
  occupation: "Student",
  employmentStatus: "Student",
  annualIncome: "",
  bpl: "No",
  minority: "No",
  disability: "No",
};

function App() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationData, setRecommendationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const updateProfile = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleViewScheme = async (scheme) => {
    // Open immediately so the UI never feels stuck.
    setSelectedScheme(scheme);

    // Fetch richer details when the API supports them.
    try {
      const schemeId = scheme?.scheme_id || scheme?.slug;

      if (!schemeId) return;

      const response = await getSchemeDetails(schemeId);

      if (response?.data) {
        setSelectedScheme((current) => ({
          ...current,
          ...response.data,
        }));
      }
    } catch (error) {
      // Details are optional for now. The card data remains visible.
      console.warn("Scheme details unavailable:", error);
    }
  };

  const generateMockResults = () => {
    setRecommendations(MOCK_RECOMMENDATIONS);
    setRecommendationData({
      final_verdict: "Potential matches found",
      planner_result: {
        goal: "Explore the best-fit schemes and verify eligibility",
        plan_steps: [
          "Review the recommended schemes",
          "Check official eligibility requirements",
          "Prepare the required documents",
        ],
      },
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setApiError("");

    // Keep the UI demonstrable even when the backend is offline.
    try {
      const payload = {
        age: Number(profile.age || 0),
        gender: profile.gender,
        state: profile.state,
        district: profile.district || null,
        area: profile.area,
        category: profile.category,
        minority: profile.minority === "Yes",
        disability: profile.disability === "Yes",
        disability_percentage: 0,
        employment_status: profile.employmentStatus,
        occupation: profile.occupation,
        bpl: profile.bpl === "Yes",
        annual_income: Number(profile.annualIncome || 0),
      };

      const response = await getRecommendations(payload);
      const data = response?.data || {};

      if (Array.isArray(data.recommendations) && data.recommendations.length) {
        setRecommendations(data.recommendations);
        setRecommendationData(data);
      } else {
        generateMockResults();
      }
    } catch (error) {
      console.warn("Backend unavailable, showing demo recommendations:", error);
      generateMockResults();
      setApiError(
        "Demo mode: backend is currently unavailable, so sample matches are being shown."
      );
    } finally {
      setLoading(false);

      setTimeout(() => {
        document
          .getElementById("recommendations")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 250);
    }
  };

  const handleCategorySearch = (category) => {
    const categorySchemes = {
      Education: [
        {
          scheme_id: "EDU-001",
          scheme_name: "Education Support Scholarship",
          reason: "Financial support for eligible students pursuing education.",
        },
        {
          scheme_id: "EDU-002",
          scheme_name: "Central Sector Scholarship",
          reason:
            "Scholarship support for eligible students in higher education.",
        },
        {
          scheme_id: "EDU-003",
          scheme_name: "Post Matric Scholarship",
          reason:
            "Education assistance for eligible students after matriculation.",
        },
      ],
      Employment: [
        {
          scheme_id: "EMP-001",
          scheme_name: "Employment Support Scheme",
          reason:
            "Support for eligible individuals seeking employment opportunities.",
        },
        {
          scheme_id: "EMP-002",
          scheme_name: "Skill Development Support",
          reason:
            "Training and skill development opportunities for eligible applicants.",
        },
        {
          scheme_id: "EMP-003",
          scheme_name: "Youth Employment Initiative",
          reason: "Opportunities aimed at improving youth employment.",
        },
      ],
      Healthcare: [
        {
          scheme_id: "HEALTH-001",
          scheme_name: "Health Support Scheme",
          reason:
            "Healthcare assistance for eligible individuals and families.",
        },
        {
          scheme_id: "HEALTH-002",
          scheme_name: "Public Health Assistance",
          reason:
            "Support for eligible healthcare-related needs.",
        },
      ],
      Housing: [
        {
          scheme_id: "HOUSE-001",
          scheme_name: "Housing Assistance Scheme",
          reason: "Housing support for eligible households.",
        },
        {
          scheme_id: "HOUSE-002",
          scheme_name: "Affordable Housing Support",
          reason:
            "Support for eligible citizens seeking affordable housing.",
        },
      ],
      Agriculture: [
        {
          scheme_id: "AGRI-001",
          scheme_name: "Farmer Assistance Scheme",
          reason:
            "Financial and agricultural support for eligible farmers.",
        },
        {
          scheme_id: "AGRI-002",
          scheme_name: "Agriculture Development Support",
          reason:
            "Support for agricultural activities and development.",
        },
      ],
      Entrepreneurship: [
        {
          scheme_id: "BUS-001",
          scheme_name: "Entrepreneurship Support Scheme",
          reason:
            "Support for eligible individuals starting or developing a business.",
        },
        {
          scheme_id: "BUS-002",
          scheme_name: "Small Business Assistance",
          reason:
            "Financial and development support for eligible small businesses.",
        },
      ],
    };

    setSearch(category);
    setSearchResults(categorySchemes[category] || []);

    setTimeout(() => {
      document.getElementById("schemes")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  };

  const handleManualSearch = (e) => {
  e?.preventDefault();

  setSearchLoading(true);

  const query = search.trim().toLowerCase();

  if (!query) {
    setSearchResults([]);

    setTimeout(() => {
      setSearchLoading(false);
    }, 900);

    return;
  }

  const allSchemes = [
    ...MOCK_RECOMMENDATIONS,

    {
      scheme_id: "EDU-002",
      scheme_name: "Central Sector Scholarship",
      reason: "Scholarship support for eligible students in higher education.",
    },
    {
      scheme_id: "EDU-003",
      scheme_name: "Post Matric Scholarship",
      reason: "Education assistance for eligible students after matriculation.",
    },
    {
      scheme_id: "EMP-001",
      scheme_name: "Employment Support Scheme",
      reason: "Support for eligible individuals seeking employment opportunities.",
    },
    {
      scheme_id: "HEALTH-001",
      scheme_name: "Health Support Scheme",
      reason: "Healthcare assistance for eligible individuals and families.",
    },
    {
      scheme_id: "HOUSE-001",
      scheme_name: "Housing Assistance Scheme",
      reason: "Housing support for eligible households.",
    },
    {
      scheme_id: "AGRI-001",
      scheme_name: "Farmer Assistance Scheme",
      reason: "Financial and agricultural support for eligible farmers.",
    },
    {
      scheme_id: "BUS-001",
      scheme_name: "Entrepreneurship Support Scheme",
      reason: "Support for eligible individuals starting or developing a business.",
    },
  ];

  const filtered = allSchemes.filter((scheme) =>
    `${scheme.scheme_name} ${scheme.reason}`
      .toLowerCase()
      .includes(query)
  );

  setSearchResults(
    filtered.length
      ? filtered
      : [
          {
            scheme_id: "SEARCH-001",
            scheme_name: `${search} schemes`,
            reason: `Explore government schemes related to "${search}".`,
          },
        ]
  );

  setTimeout(() => {
    setSearchLoading(false);

    document.getElementById("schemes")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 900);
};

  return (
    <div className="app">
       {searchLoading && (
      <div className="scheme-loading-overlay">
        <div className="scheme-loading-card">

          <div className="scheme-loader"></div>

          <span>SEARCHING</span>

          <h2>
            Finding relevant
            <br />
            schemes.
          </h2>

          <p>
            Searching the scheme repository for
            <br />
            the support you need.
          </p>

          <div className="loading-status">
            <div>✓ Search received</div>
            <div>◌ Searching repository</div>
            <div>◌ Finding relevant schemes</div>
          </div>

        </div>
      </div>
    )}
      <nav className="navbar">
        <a className="brand" href="/">
          Scheme<span>Navigator</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#discover">Discover</a>
          <a href="#about">About</a>
          <a href="#team">Team</a>
        </div>

        <Link className="nav-cta" to="/profile">
          Get started <span>↗</span>
        </Link>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="glow-one hero-glow" />
          <div className="glow-two hero-glow" />

          <div className="hero-left">
            <div className="eyebrow">
              <i className="live-dot" />
              PUBLIC BENEFIT DISCOVERY
            </div>

            <h1>
              Find what
              <br />
              <span>you qualify for.</span>
            </h1>

            <p className="hero-description">
              SchemeNavigator turns your basic information into a clear,
              personalized starting point for discovering government schemes
              and benefits.
            </p>

            <div className="hero-actions">
              <Link className="primary-btn" to="/profile">
              Tell us about you <span>→</span>
            </Link>
              <a className="secondary-btn" href="#discover">
                Explore schemes
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>01</strong>
                <span>Profile</span>
              </div>
              <div className="stat-line" />
              <div>
                <strong>02</strong>
                <span>Match</span>
              </div>
              <div className="stat-line" />
              <div>
                <strong>03</strong>
                <span>Plan</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-card top-card">
              <span>✓</span>
              <div>
                <small>Personalized</small>
                <strong>Profile matching</strong>
              </div>
            </div>

            <div className="main-card">
              <div className="card-top">
                <span className="mini-label">001</span>
                <span className="verified">● READY</span>
              </div>

              <div className="profile-icon">SN</div>

              <h3>Your profile.</h3>
              <p>
                A simple profile helps us organize the search around what
                matters to you.
              </p>

              <div className="match-preview">
                <div className="match-icon">✦</div>
                <div>
                  <span>Potential match</span>
                  <strong>Education Support</strong>
                </div>
                <b>94%</b>
              </div>
            </div>

            <div className="floating-card bottom-card">
              <span>→</span>
              <div>
                <small>Next</small>
                <strong>Application roadmap</strong>
              </div>
            </div>
          </div>
        </section>

        

        <section className="discover-section" id="discover">
          <div className="discover-top">
            <div>
              <span className="section-number">DISCOVER</span>
              <h2>Explore by<br />what you need.</h2>
            </div>
            <p>
              Browse broad areas of public support or search for a specific
              need. These cards are ready for your live scheme repository.
            </p>
          </div>

          <div className="search-panel">
            <span>SEARCH THE REPOSITORY</span>
            <form className="search-row" onSubmit={handleManualSearch}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Try education, jobs, housing..."
              />
              <button type="submit" disabled={searchLoading}>
                {searchLoading ? "Searching..." : "Search →"}
              </button>
            </form>
          </div>

          <div className="category-grid">
            {[
              ["01", "Education", "Scholarships & support"],
              ["02", "Employment", "Jobs & opportunities"],
              ["03", "Healthcare", "Health & welfare"],
              ["04", "Housing", "Housing support"],
              ["05", "Agriculture", "Farmer assistance"],
              ["06", "Entrepreneurship", "Business support"],
            ].map(([number, title, subtitle]) => (
              <button
                type="button"
                className="category-card"
                key={title}
                onClick={() => handleCategorySearch(title)}
              >
                <span>{number}</span>
                <div>{title}</div>
                <small>{subtitle} →</small>
              </button>
            ))}
          </div>

          {searchResults.length > 0 && (
            <div className="results" id="schemes">
              <div className="results-heading">
                <span>SEARCH RESULTS</span>
                <h3>Explore matches</h3>
              </div>

              <div className="scheme-grid">
                {searchResults.map((scheme, index) => (
                  <article className="scheme-card" key={scheme.scheme_id || index}>
                    <span>{scheme.scheme_id}</span>
                    <h3>{scheme.scheme_name}</h3>
                    <p>{scheme.reason}</p>
                    <button
                      type="button"
                      className="view-scheme-btn"
                      onClick={() => handleViewScheme(scheme)}
                    >
                      View details →
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        {selectedScheme && (
          <div
            className="scheme-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Scheme details"
            onClick={() => setSelectedScheme(null)}
          >
            <div
              className="scheme-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="scheme-modal-close"
                aria-label="Close scheme details"
                onClick={() => setSelectedScheme(null)}
              >
                ×
              </button>

              <div className="scheme-modal-topline">
                <span className="section-number">
                  {selectedScheme.scheme_category || "GOVERNMENT SCHEME"}
                </span>
                <span className="scheme-modal-status">POTENTIAL MATCH</span>
              </div>

              <h2>{selectedScheme.scheme_name}</h2>

              <p className="scheme-modal-description">
                {selectedScheme.details ||
                  selectedScheme.reason ||
                  "This scheme may be relevant to your needs. Check the current official eligibility criteria before applying."}
              </p>

              <div className="scheme-info-grid">
                <div>
                  <span>SCHEME ID</span>
                  <strong>
                    {selectedScheme.scheme_id || selectedScheme.slug || "N/A"}
                  </strong>
                </div>

                <div>
                  <span>CATEGORY</span>
                  <strong>
                    {selectedScheme.scheme_category || "General"}
                  </strong>
                </div>

                <div>
                  <span>MATCH</span>
                  <strong>
                    {selectedScheme.overall_score != null
                      ? `${selectedScheme.overall_score}%`
                      : "Potential"}
                  </strong>
                </div>
              </div>

              {selectedScheme.confidence != null && (
                <div className="scheme-modal-section">
                  <span>MATCH CONFIDENCE</span>
                  <p>
                    {Math.round(selectedScheme.confidence * 100)}% confidence
                    based on the information currently provided.
                  </p>
                </div>
              )}

              <div className="scheme-modal-section">
                <span>WHY THIS MAY MATCH</span>
                <p>
                  {selectedScheme.reason ||
                    selectedScheme.eligibility_analysis ||
                    "This scheme may be relevant to your profile. Verify current official eligibility requirements."}
                </p>
              </div>

              {selectedScheme.benefits?.length > 0 && (
                <div className="scheme-modal-section">
                  <span>KEY BENEFITS</span>
                  <div className="scheme-modal-checklist">
                    {selectedScheme.benefits.map((benefit, index) => (
                      <p key={index}>
                        <b>0{index + 1}</b> {benefit}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {selectedScheme.eligibility?.length > 0 && (
                <div className="scheme-modal-section">
                  <span>ELIGIBILITY</span>
                  <div className="scheme-modal-checklist">
                    {selectedScheme.eligibility.map((item, index) => (
                      <p key={index}>
                        <b>0{index + 1}</b> {item}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {selectedScheme.documents?.length > 0 && (
                <div className="scheme-modal-section">
                  <span>REQUIRED DOCUMENTS</span>
                  <div className="scheme-modal-checklist">
                    {selectedScheme.documents.map((document, index) => (
                      <p key={index}>
                        <b>0{index + 1}</b> {document}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {selectedScheme.application_steps?.length > 0 && (
                <div className="scheme-modal-section">
                  <span>APPLICATION ROADMAP</span>
                  <div className="scheme-modal-checklist">
                    {selectedScheme.application_steps.map((step, index) => (
                      <p key={index}>
                        <b>0{index + 1}</b> {step}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {selectedScheme.pros?.length > 0 && (
                <div className="scheme-modal-section">
                  <span>WHY CONSIDER IT</span>
                  <div className="scheme-modal-checklist">
                    {selectedScheme.pros.map((item, index) => (
                      <p key={index}>
                        <b>+</b> {item}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {selectedScheme.cons?.length > 0 && (
                <div className="scheme-modal-section">
                  <span>KEEP IN MIND</span>
                  <div className="scheme-modal-checklist">
                    {selectedScheme.cons.map((item, index) => (
                      <p key={index}>
                        <b>!</b> {item}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="scheme-modal-section">
                <span>BEFORE YOU APPLY</span>
                <p>
                  Always verify the latest eligibility, documents and application
                  process through the official scheme source before taking action.
                </p>
              </div>

              <div className="scheme-modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setSelectedScheme(null)}
                >
                  Close
                </button>

                {selectedScheme?.official_url ? (
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => {
                      window.open(
                        selectedScheme.official_url,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  >
                    Explore official source →
                  </button>
                ) : (
                  <button
                    type="button"
                    className="primary-btn"
                    disabled
                  >
                    Official source unavailable
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <section className="how-section">
          <div className="section-heading centered">
            <span className="section-number">HOW IT WORKS</span>
            <h2>Simple in.<br />Clear out.</h2>
          </div>

          <div className="process-grid">
            <Process number="01" icon="◎" title="Build your profile">
              Share the information needed to understand your situation.
            </Process>

            <Process number="02" icon="✦" title="Discover matches" featured>
              Potentially relevant schemes are organized around your profile.
            </Process>

            <Process number="03" icon="→" title="Plan your next step">
              Turn discovery into a practical checklist for verification and
              application.
            </Process>
          </div>
        </section>

        <section className="why-section">
          <div className="why-visual">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit-center">SN</div>
          </div>

          <div className="why-content">
            <span className="section-number">WHY US</span>
            <h2>Less searching.<br /><span>More direction.</span></h2>
            <p>
              Government benefits can be difficult to navigate when information
              is spread across different schemes and requirements.
              SchemeNavigator is designed to make the first step clearer.
            </p>

            <div className="why-points">
              <div>
                <strong>01</strong>
                <p>
                  <b>Profile-first discovery</b>
                  <span>Start with your situation instead of a long list of schemes.</span>
                </p>
              </div>

              <div>
                <strong>02</strong>
                <p>
                  <b>Explainable matches</b>
                  <span>See why a potential recommendation may be relevant.</span>
                </p>
              </div>

              <div>
                <strong>03</strong>
                <p>
                  <b>Action-oriented planning</b>
                  <span>Move from discovery toward clear next steps.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="team-section" id="team">
          <div className="section-heading">
            <span className="section-number">THE TEAM</span>
            <h2>Five people.<br />One direction.</h2>
            <p>
              SchemeNavigator is built by a team working together on a simpler
              way to discover public benefits.
            </p>
          </div>

          <div className="team-grid">
            {["Member 01", "Member 02", "Member 03", "Member 04", "Member 05"].map(
              (member, index) => (
                <div className="team-card" key={member}>
                  <div className="avatar">0{index + 1}</div>
                  <h3>{member}</h3>
                  <p>SchemeNavigator team member</p>
                </div>
              )
            )}
          </div>
        </section>

        <section className="about-section-custom" id="about">
          <div className="about-label">
            <span>ABOUT</span>
             
          </div>

          <div className="about-content">
            <h2>
              Public support should feel
              <span> easier to find.</span>
            </h2>

            <p>
              SchemeNavigator is a discovery and planning interface designed
              around one simple idea: people should be able to start with
              themselves, not with complicated scheme lists.
            </p>

            <div className="mission-box">
              <span>OUR MISSION</span>
              <strong>
                Make the first step toward the right public benefit simpler,
                clearer and more human.
              </strong>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="section-heading centered">
            <span className="section-number">FAQ</span>
            <h2>Questions,<br />answered.</h2>
          </div>

          <div className="faq-list">
            <details>
              <summary>
                Are the recommendations guaranteed? <span>+</span>
              </summary>
              <p>
                No. Recommendations are potential matches. Always verify the
                current eligibility criteria and application process through
                official scheme information.
              </p>
            </details>

            <details>
              <summary>
                What information do I need? <span>+</span>
              </summary>
              <p>
                The profile asks for basic details such as age, location,
                category, occupation and income-related information.
              </p>
            </details>

            <details>
              <summary>
                Can I browse schemes without a profile? <span>+</span>
              </summary>
              <p>
                Yes. Use the Discover section to browse broad categories and
                search terms.
              </p>
            </details>

            <details>
              <summary>
                Will this submit an application for me? <span>+</span>
              </summary>
              <p>
                No. SchemeNavigator is focused on discovery and planning. The
                actual application should be completed through the appropriate
                official channel.
              </p>
            </details>
          </div>
        </section>

        <section className="final-cta">
          <span className="section-number">START HERE</span>
          <h2>
            Your next opportunity
            <br />
            could be <span>closer than you think.</span>
          </h2>

          <Link className="primary-btn large-btn" to="/profile">
            Build my profile <span>→</span>
          </Link>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <a className="brand" href="#home">
            Scheme<span>Navigator</span>
          </a>
          <p>Discover. Understand. Move forward.</p>
        </div>

        <div className="footer-links">
          <a href="#discover">Discover</a>
          <a href="#about">About</a>
          <a href="#team">Team</a>
          <Link to="/profile">Get started</Link>
        </div>

        <div className="footer-bottom">
          <span>© 2026 SchemeNavigator</span>
          <span>BUILT FOR BETTER DISCOVERY</span>
        </div>
      </footer>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function Process({ number, icon, title, children, featured }) {
  return (
    <article className={`process-card ${featured ? "featured-process" : ""}`}>
      <span>{number}</span>
      <div className="process-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

export default App;