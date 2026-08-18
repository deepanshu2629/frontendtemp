const API_BASE_URL = "http://127.0.0.1:8000";

/*
  FRONTEND MODE
  true  = use mock data
  false = use real backend

  Backend ready hone ke baad sirf:
      USE_MOCK_API = false
  karna hai.
*/
const USE_MOCK_API = true;


/* =========================================================
   MOCK DATA
   ========================================================= */

const MOCK_SCHEMES = [
  {
    slug: "central-sector-scholarship",
    scheme_id: "EDU-001",
    scheme_category: "Education",
    scheme_name: "Central Sector Scholarship",
    details:
      "Financial support for eligible students pursuing higher education.",
    benefits: [
      "Financial assistance for eligible students",
      "Support for higher education expenses",
    ],
    eligibility: [
      "Must satisfy the current eligibility criteria",
      "Must provide the required educational documents",
    ],
    documents: [
      "Identity proof",
      "Educational certificate",
      "Income certificate where applicable",
    ],
    application_steps: [
      "Review eligibility",
      "Prepare required documents",
      "Verify the official application process",
      "Submit through the official channel",
    ],
  },

  {
    slug: "post-matric-scholarship",
    scheme_id: "EDU-002",
    scheme_category: "Education",
    scheme_name: "Post Matric Scholarship",
    details:
      "Educational assistance for eligible students after matriculation.",
    benefits: [
      "Education-related financial assistance",
      "Support for eligible post-matric students",
    ],
    eligibility: [
      "Eligibility depends on current scheme rules",
      "Educational and income criteria may apply",
    ],
    documents: [
      "Identity proof",
      "Educational documents",
      "Income/category documents where applicable",
    ],
    application_steps: [
      "Check current eligibility",
      "Collect documents",
      "Verify the official portal",
      "Submit the application",
    ],
  },

  {
    slug: "skill-development-support",
    scheme_id: "EMP-001",
    scheme_category: "Employment",
    scheme_name: "Skill Development Support",
    details:
      "Training and skill-development opportunities for eligible applicants.",
    benefits: [
      "Skill development opportunities",
      "Training support",
    ],
    eligibility: [
      "Eligibility depends on current programme rules",
    ],
    documents: [
      "Identity proof",
      "Address proof",
      "Educational documents where required",
    ],
    application_steps: [
      "Check available training",
      "Verify eligibility",
      "Register through the official channel",
    ],
  },

  {
    slug: "employment-support",
    scheme_id: "EMP-002",
    scheme_category: "Employment",
    scheme_name: "Employment Support Scheme",
    details:
      "Support and opportunities for eligible individuals seeking employment.",
    benefits: [
      "Employment-related support",
      "Access to relevant opportunities",
    ],
    eligibility: [
      "Eligibility depends on current programme rules",
    ],
    documents: [
      "Identity proof",
      "Address proof",
      "Employment-related documents where required",
    ],
    application_steps: [
      "Review the opportunity",
      "Check eligibility",
      "Complete the official registration process",
    ],
  },

  {
    slug: "health-support",
    scheme_id: "HEALTH-001",
    scheme_category: "Healthcare",
    scheme_name: "Health Support Scheme",
    details:
      "Healthcare assistance and support for eligible individuals and families.",
    benefits: [
      "Healthcare-related assistance",
      "Support for eligible beneficiaries",
    ],
    eligibility: [
      "Eligibility depends on current healthcare scheme rules",
    ],
    documents: [
      "Identity proof",
      "Relevant medical or beneficiary documents where required",
    ],
    application_steps: [
      "Check eligibility",
      "Prepare documents",
      "Verify the official application route",
    ],
  },

  {
    slug: "housing-assistance",
    scheme_id: "HOUSE-001",
    scheme_category: "Housing",
    scheme_name: "Housing Assistance Scheme",
    details:
      "Housing-related assistance for eligible households.",
    benefits: [
      "Potential housing assistance",
      "Support for eligible households",
    ],
    eligibility: [
      "Household and income criteria may apply",
      "Verify current scheme requirements",
    ],
    documents: [
      "Identity proof",
      "Address proof",
      "Income/property documents where applicable",
    ],
    application_steps: [
      "Check eligibility",
      "Prepare documents",
      "Verify the official application channel",
    ],
  },

  {
    slug: "farmer-assistance",
    scheme_id: "AGRI-001",
    scheme_category: "Agriculture",
    scheme_name: "Farmer Assistance Scheme",
    details:
      "Agricultural and financial support for eligible farmers.",
    benefits: [
      "Agriculture-related support",
      "Potential financial assistance",
    ],
    eligibility: [
      "Eligibility depends on current agriculture scheme rules",
    ],
    documents: [
      "Identity proof",
      "Land/farmer documents where applicable",
      "Bank details where required",
    ],
    application_steps: [
      "Check farmer eligibility",
      "Prepare documents",
      "Verify the official application process",
    ],
  },

  {
    slug: "entrepreneurship-support",
    scheme_id: "BUS-001",
    scheme_category: "Entrepreneurship",
    scheme_name: "Entrepreneurship Support Scheme",
    details:
      "Support for eligible individuals starting or developing a business.",
    benefits: [
      "Entrepreneurship support",
      "Potential business development assistance",
    ],
    eligibility: [
      "Business and applicant criteria may apply",
      "Verify current scheme rules",
    ],
    documents: [
      "Identity proof",
      "Business-related documents where applicable",
      "Financial documents where required",
    ],
    application_steps: [
      "Review the scheme",
      "Check eligibility",
      "Prepare business documents",
      "Verify the official application route",
    ],
  },

  {
    slug: "social-security-support",
    scheme_id: "SOC-001",
    scheme_category: "Social Security",
    scheme_name: "Social Security Support Scheme",
    details:
      "Potential welfare and financial support for eligible citizens.",
    benefits: [
      "Potential welfare assistance",
      "Support for eligible beneficiaries",
    ],
    eligibility: [
      "Eligibility depends on current scheme rules",
    ],
    documents: [
      "Identity proof",
      "Address proof",
      "Income/category documents where applicable",
    ],
    application_steps: [
      "Check eligibility",
      "Prepare documents",
      "Verify the official application channel",
    ],
  },
];


/* =========================================================
   HELPERS
   ========================================================= */

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase();
}

function findScheme(schemeId) {
  return MOCK_SCHEMES.find(
    (scheme) =>
      scheme.scheme_id === schemeId ||
      scheme.slug === schemeId ||
      normalizeText(scheme.scheme_name) === normalizeText(schemeId)
  );
}


/* =========================================================
   MOCK SEARCH
   ========================================================= */

async function mockSearchSchemes(payload = {}) {
  const keyword = normalizeText(payload.keyword);

  await wait(500);

  if (!keyword) {
    return {
      success: true,
      data: MOCK_SCHEMES,
    };
  }

  const results = MOCK_SCHEMES.filter((scheme) => {
    const searchableText = [
      scheme.scheme_name,
      scheme.scheme_category,
      scheme.details,
      ...(scheme.benefits || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(keyword);
  });

  return {
    success: true,
    data: results,
  };
}


/* =========================================================
   REAL BACKEND SEARCH
   ========================================================= */

async function backendSearchSchemes(payload) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/schemes/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  return response.json();
}


/* =========================================================
   PUBLIC SEARCH FUNCTION
   ========================================================= */

export async function searchSchemes(payload) {
  if (USE_MOCK_API) {
    return mockSearchSchemes(payload);
  }

  return backendSearchSchemes(payload);
}


/* =========================================================
   MOCK RECOMMENDATIONS
   ========================================================= */

async function mockRecommendations(payload = {}) {
  await wait(1200);

  const occupation = normalizeText(payload.occupation);
  const age = Number(payload.age || 0);
  const category = normalizeText(payload.category);
  const income = Number(payload.annual_income || 0);

  let recommendations = [];

  if (
    occupation.includes("student") ||
    occupation === "student"
  ) {
    const education1 = findScheme("EDU-001");
    const education2 = findScheme("EDU-002");

    if (education1) {
      recommendations.push({
        ...education1,

        overall_score: 92,
        confidence: 0.91,

        reason:
          "This appears to be one of the strongest potential matches because your profile indicates that you are a student.",

        pros: [
          "Education-related financial support",
          "Relevant for eligible students",
        ],

        cons: [
          "Current eligibility must be verified",
        ],

        eligibility_analysis:
          "Potential match based on the profile information provided. Final eligibility depends on the current official criteria.",

        benefit_analysis:
          "May provide financial support for eligible higher-education expenses.",

        risk_analysis:
          "Scheme rules and eligibility can change. Verify the latest official information.",

        required_documents_summary:
          "Identity proof, educational certificate and applicable income documents.",

        recommended_priority: "High",
      });
    }

    if (education2) {
      recommendations.push({
        ...education2,

        overall_score: 84,
        confidence: 0.84,

        reason:
          "This may also be relevant for students pursuing education.",

        pros: [
          "Education assistance",
          "Post-matric support",
        ],

        cons: [
          "Eligibility criteria apply",
        ],

        eligibility_analysis:
          "Potential match; verify the current official eligibility rules.",

        benefit_analysis:
          "May provide education-related assistance for eligible students.",

        risk_analysis:
          "Current requirements should be verified before applying.",

        required_documents_summary:
          "Identity proof, educational documents and applicable category/income documents.",

        recommended_priority: "Medium",
      });
    }
  } else {
    const employment1 = findScheme("EMP-001");
    const employment2 = findScheme("EMP-002");

    if (employment1) {
      recommendations.push({
        ...employment1,

        overall_score: 87,
        confidence: 0.86,

        reason:
          "This may be relevant based on the employment information provided.",

        pros: [
          "Skill development opportunities",
          "Training support",
        ],

        cons: [
          "Programme-specific eligibility applies",
        ],

        eligibility_analysis:
          "Potential employment-related match. Verify current eligibility.",

        benefit_analysis:
          "May provide access to relevant skill-development opportunities.",

        risk_analysis:
          "Availability and eligibility can change.",

        required_documents_summary:
          "Identity proof, address proof and educational documents where required.",

        recommended_priority: "High",
      });
    }

    if (employment2) {
      recommendations.push({
        ...employment2,

        overall_score: 79,
        confidence: 0.78,

        reason:
          "This may provide potentially relevant employment-related support.",

        pros: [
          "Employment-related support",
        ],

        cons: [
          "Current programme rules apply",
        ],

        eligibility_analysis:
          "Potential match based on the available profile information.",

        benefit_analysis:
          "May provide access to employment-related opportunities.",

        risk_analysis:
          "Verify current programme availability.",

        required_documents_summary:
          "Identity proof, address proof and employment-related documents where required.",

        recommended_priority: "Medium",
      });
    }
  }

  /*
    Profile-aware demo behaviour.
  */
  if (age > 0 && age < 25) {
    const youthScheme = findScheme("EDU-002");

    if (
      youthScheme &&
      !recommendations.some(
        (item) => item.scheme_id === youthScheme.scheme_id
      )
    ) {
      recommendations.unshift({
        ...youthScheme,

        overall_score: 85,
        confidence: 0.84,

        reason:
          "This may be relevant based on the age information provided.",

        pros: [
          "Education assistance",
        ],

        cons: [
          "Eligibility must be verified",
        ],

        eligibility_analysis:
          "Potential match based on the available profile information.",

        benefit_analysis:
          "May provide educational assistance for eligible applicants.",

        risk_analysis:
          "Verify the latest official requirements.",

        required_documents_summary:
          "Identity proof and relevant educational/income documents.",

        recommended_priority: "High",
      });
    }
  }

  /*
    Small demo adjustment based on category/income.
  */
  if (
    category &&
    recommendations.length > 0 &&
    recommendations[0].scheme_category
      .toLowerCase()
      .includes(category)
  ) {
    recommendations[0].overall_score = Math.min(
      98,
      recommendations[0].overall_score + 4
    );
  }

  if (income > 0 && income < 300000 && recommendations.length > 0) {
    recommendations[0].overall_score = Math.min(
      98,
      recommendations[0].overall_score + 3
    );
  }

  const selectedSchemeIds = recommendations
    .map((item) => item.scheme_id)
    .filter(Boolean);

  return {
    success: true,

    message:
      "Mock recommendations generated successfully",

    version: "v1",

    data: {
      recommendations,

      research_result: {
        query: payload?.occupation || "General",

        summary:
          "Potential schemes based on your profile.",

        recommendations: recommendations.map((item) => ({
          scheme_id: item.scheme_id,
          scheme_name: item.scheme_name,
          reason: item.reason,
        })),
      },

      planner_result: {
        goal:
          recommendations[0]?.scheme_name
            ? `Explore ${recommendations[0].scheme_name}`
            : "Explore relevant government schemes",

        plan_steps: [
          "Review the recommended scheme",
          "Check eligibility requirements",
          "Prepare the required documents",
          "Verify the official application process",
        ],

        selected_scheme_ids: selectedSchemeIds,
      },

      verification_result: null,

      readiness_score: 82,

      final_verdict:
        recommendations.length > 0
          ? "Potential matches found"
          : "No potential matches found",
    },
  };
}


/* =========================================================
   REAL BACKEND RECOMMENDATIONS
   ========================================================= */

async function backendRecommendations(payload) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/recommendations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    let message =
      `Recommendation request failed: ${response.status}`;

    try {
      const error = await response.json();

      if (error?.detail) {
        message =
          typeof error.detail === "string"
            ? error.detail
            : JSON.stringify(error.detail);
      }

      if (error?.message) {
        message = error.message;
      }
    } catch {
      // Ignore JSON parsing errors.
    }

    throw new Error(message);
  }

  return response.json();
}


/* =========================================================
   PUBLIC RECOMMENDATION FUNCTION
   ========================================================= */

export async function getRecommendations(payload) {
  if (USE_MOCK_API) {
    return mockRecommendations(payload);
  }

  return backendRecommendations(payload);
}


/* =========================================================
   FUTURE-FRIENDLY SCHEME DETAILS
   ========================================================= */

export async function getSchemeDetails(schemeId) {
  if (USE_MOCK_API) {
    await wait(300);

    const scheme = findScheme(schemeId);

    return {
      success: true,
      data: scheme || null,
    };
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/schemes/${encodeURIComponent(schemeId)}`
  );

  if (!response.ok) {
    throw new Error(
      `Scheme details failed: ${response.status}`
    );
  }

  return response.json();
}