import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { getRecommendations } from "../services/api";
import { Link } from "react-router-dom";

const DEFAULT_PROFILE = {
  age: "",
  gender: "",
  state: "",
  zone: "",
  category: "",
  occupation: "",
  employmentStatus: "",
  annualIncome: "",
  bpl: "",
  minority: "",
  disability: "",
};

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const updateProfile = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setApiError("");

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

navigate("/recommendations", {
  state: {
    profile,
    recommendations: data.recommendations || [],
    readinessScore: data.readiness_score ?? null,
    finalVerdict: data.final_verdict || "",
  },
});

    } catch (error) {
      console.error(error);
      setApiError("Unable to connect to the recommendation service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {loading && (
  <div className="scheme-loading-overlay">
    <div className="scheme-loading-card">

      <div className="scheme-loader"></div>

      <span>ANALYSING</span>

      <h2>
        Finding schemes
        <br />
        that fit you.
      </h2>

      <p>
        We're analysing your profile and matching
        it with potentially relevant schemes.
      </p>

      <div className="loading-status">
        <div>✓ Profile received</div>
        <div>◌ Matching eligibility</div>
        <div>◌ Finding relevant schemes</div>
      </div>

    </div>
  </div>
)}
  <main className="profile-page">

    {/* TOP INTRO */}
    <div className="profile-page-top">
  <div>
    <span>
        <Link to="/" className="brand">
  Scheme<span>Navigator</span>
</Link> <br></br>
      </span>
    <span className="section-number">YOUR PROFILE</span>
    <br></br>
    <h1>
      Tell us
      <br />
      <span>about yourself.</span>
    </h1>
  </div>
</div>

    {/* MAIN ONBOARDING */}
    <div className="profile-layout">

      {/* LEFT SIDE */}
      <aside className="profile-intro">

        <div className="profile-intro-top">
          <span className="section-number"></span>
          <span className="profile-ready">● READY</span>
        </div>

        

        <h2>
          Find support
          <br />
          that fits <span>you.</span>
        </h2>

        <p>
          A few details help SchemeNavigator organize potentially
          relevant government schemes and benefits for you.
        </p>

        <div className="profile-steps">

          <div className="profile-step active">
            <span>01</span>
            <div>
              <strong>Personal details</strong>
              <small>Basic information about you</small>
            </div>
          </div>

          <div className="profile-step active">
            <span>02</span>
            <div>
              <strong>Location</strong>
              <small>Where you live and your area</small>
            </div>
          </div>

          <div className="profile-step active">
            <span>03</span>
            <div>
              <strong>Eligibility</strong>
              <small>Details that improve matching</small>
            </div>
          </div>

        </div>

        <div className="profile-note">
          <span>✦</span>
          <p>
            Your information is used only to personalize
            scheme discovery.
          </p>
        </div>

      </aside>

      {/* RIGHT FORM */}
      <section className="profile-form-panel">

        <div className="form-header">
          <div>
            <span>ABOUT YOU</span>
            <h3>Tell us a little about yourself</h3>
          </div>

        </div>

        <form
          className="profile-form-new"
          onSubmit={handleSubmit}
        >

          {/* PERSONAL */}
          <div className="form-group-title">
            
            <div>
              <strong>Personal information</strong>
              <small>Start with the basics</small>
            </div>
          </div>

          <div className="form-grid">

            <Field label="AGE">
              <input
                type="number"
                min="0"
                max="120"
                placeholder="e.g. 18"
                value={profile.age}
                onChange={(e) =>
                  updateProfile("age", e.target.value)}
                
                  onWheel={(e) => e.currentTarget.blur()}
                  required
                
              />
            </Field>

            <Field label="GENDER">
              <select
                className="profile-select"
                value={profile.gender}
                onChange={(e) =>
                  updateProfile("gender", e.target.value)
                }
                required
              >
                <option value="">Prefer not to say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>

            <Field label="OCCUPATION">
              <input
                placeholder="e.g. Student"
                value={profile.occupation}
                onChange={(e) =>
                  updateProfile("occupation", e.target.value)
                }
                required
              />
            </Field>

            <Field label="EMPLOYMENT STATUS">
              <select
                className="profile-select"
                value={profile.employmentStatus}
                onChange={(e) =>
                  updateProfile(
                    "employmentStatus",
                    e.target.value
                  )
                }
                required
              >
                <option value="">Select employment status</option>
                <option value="Employed">Employed</option>
                <option value="Student">Student</option>
                <option value="Self-employed">Self-employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Other">Other</option>
              </select>
            </Field>

          </div>

          {/* LOCATION */}
          <div className="form-group-title">
            
            <div>
              <strong>Where do you live?</strong>
              <small>Location helps improve relevance</small>
              
            </div>
            
          </div>
          

          <div className="form-grid">

            <Field label="STATE">
              <input
                placeholder="e.g. Delhi"
                value={profile.state}
                onChange={(e) =>
                  updateProfile("state", e.target.value)
                }
                required
              />
            </Field>


            <Field label="ZONE">
                <select className="profile-select"
                    value={profile.zone}
                    onChange={(e) =>
                    updateProfile("zone", e.target.value)
                    }
                    required
                    >
                    <option value="">Select zone</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                </select>
            </Field>

          </div>

          {/* ELIGIBILITY */}
          <div className="form-group-title">
            
            <div>
              <strong>Eligibility details</strong>
              <small>These help us find better matches</small>
            </div>
          </div>

          <div className="form-grid">

            <Field label="CATEGORY">
              <select
                className="profile-select"
                value={profile.category}
                onChange={(e) =>
                  updateProfile("category", e.target.value)
                }
                required
              >
                <option value="">Select category</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </Field>

            <Field label="ANNUAL INCOME">
              <input
                type="number"
                min="0"
                placeholder="₹ Annual income"
                value={profile.annualIncome}
                onChange={(e) =>
                  updateProfile(
                    "annualIncome",
                    e.target.value
                  )
                }
                onWheel={(e) => e.currentTarget.blur()}
                required
              />
            </Field>

            <Field label="BPL">
              <select
                className="profile-select"
                value={profile.bpl}
                onChange={(e) =>
                  updateProfile("bpl", e.target.value)
                }
                required
              >
                <option value="">Select BPL status</option>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </Field>

            <Field label="MINORITY">
              <select
                className="profile-select"
                value={profile.minority}
                onChange={(e) =>
                  updateProfile("minority", e.target.value)
                }
                required
              >
                <option value="">Select minority status</option>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </Field>

            <Field label="DISABILITY">
              <select
                className="profile-select"
                value={profile.disability}
                onChange={(e) =>
                  updateProfile("disability", e.target.value)
                }
                required
              >
                <option value="">Select disability status</option>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </Field>

          </div>

          {/* FOOTER */}
          <div className="profile-submit-area">

            <p>
              Final eligibility should always be checked
              against the official scheme requirements.
            </p>

            <button
              className="form-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Analysing..."
                : "Find my schemes"}

              {!loading && <span>→</span>}
            </button>

          </div>

          {apiError && (
            <div className="success-message">
              {apiError}
            </div>
          )}

        </form>

      </section>
    </div>

  </main>
</>);
}

function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

export default Profile;