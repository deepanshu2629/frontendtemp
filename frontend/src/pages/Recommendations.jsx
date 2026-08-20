import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  getSchemeDetails,
} from "../services/api";
import "../App.css";

function Recommendations() {
  const location = useLocation();

  const profile = location.state?.profile || null;
  const recommendations =
    location.state?.recommendations || [];

  const [selectedScheme, setSelectedScheme] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");


  const finalVerdict =
    location.state?.finalVerdict ||
    "Potential matches found";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openSchemeDetails = async (scheme) => {
    setSelectedScheme(scheme);
    setDetailsError("");
    setDetailsLoading(true);

    try {
      const response = await getSchemeDetails(
        scheme.scheme_id || scheme.slug
      );

      const details = response?.data;

      if (details) {
        setSelectedScheme({
          ...scheme,
          ...details,
        });
      }
    } catch (error) {
      console.error(error);
      setDetailsError(
        "Unable to load additional scheme details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <main className="recommendations-page">

      {/* HEADER */}
      <div className="recommendations-header">

        <div>
          <span>
        <Link to="/" className="brand">
  Scheme<span>Navigator</span>
</Link> <br></br>
      </span>
          <span className="section-number">
            <br></br>
            RESULTS
          </span>

          <h1>
            Schemes that
            <br />
            <span>may fit you.</span>
          </h1>

          <p className="recommendations-subtitle">
            Based on the information you provided, these
            schemes may be worth exploring.
          </p>
        </div>

        <Link
          className="recommendations-back"
          to="/profile"
        >
          ← Edit profile
        </Link>

      </div>


      {/* SUMMARY */}
      <section className="recommendations-summary">

        <div className="summary-main">
          <span>YOUR MATCHES</span>

          <strong>
            {recommendations.length}
          </strong>

          <p>
            potential scheme
            {recommendations.length !== 1 ? "s" : ""} found
          </p>
        </div>


        <div className="summary-verdict">
          <span>RESULT</span>

          <strong>
            {finalVerdict}
          </strong>

          <p>
            Always verify final eligibility through
            the official scheme requirements.
          </p>
        </div>

      </section>


      {/* RESULTS */}
      {recommendations.length > 0 ? (
        <section className="recommendations-list">

          <div className="results-heading">
            <div>
              <span>RECOMMENDED FOR YOU</span>
              <h2>Explore your matches</h2>
            </div>

            <span className="results-count">
              {recommendations.length} RESULTS
            </span>
          </div>


          <div className="scheme-results-grid">

            {recommendations.map((scheme, index) => (

              <article
                className="recommendation-card"
                key={
                  scheme.scheme_id ||
                  scheme.slug ||
                  index
                }
              >

                <div className="recommendation-card-top">

                  <span className="scheme-category">
                    {scheme.scheme_category ||
                      "Government Scheme"}
                  </span>

                </div>

                <h3>
                  {scheme.scheme_name}
                </h3>

                <p className="scheme-description">
                  {scheme.details ||
                    "Potentially relevant support based on your profile."}
                </p>


                {/* REASON */}
                {scheme.reason && (
                  <div className="match-reason">

                    <span>WHY THIS MATCHES</span>

                    <p>
                      {scheme.reason}
                    </p>

                  </div>
                )}


                {/* PROS */}
                {scheme.pros?.length > 0 && (
                  <div className="scheme-highlights">

                    {scheme.pros
                      .slice(0, 2)
                      .map((item, itemIndex) => (
                        <span key={itemIndex}>
                          ✓ {item}
                        </span>
                      ))}

                  </div>
                )}


                <div className="recommendation-card-footer">

                  <span className="priority-label">
                    {scheme.recommended_priority ||
                      "Potential match"}
                  </span>

                  <button
                    type="button"
                    className="scheme-details-btn"
                    onClick={() =>
                      openSchemeDetails(scheme)
                    }
                  >
                    View details
                    <span>→</span>
                  </button>

                </div>

              </article>

            ))}

          </div>

        </section>

      ) : (

        /* EMPTY STATE */

        <section className="recommendations-empty">

          <div className="empty-icon">
            ?
          </div>

          <span>NO POTENTIAL MATCHES</span>

          <h2>
            Let's try a different profile.
          </h2>

          <p>
            We couldn't find potential matches from
            the current information. You can edit your
            profile and try again.
          </p>

          <Link
            className="primary-btn"
            to="/profile"
          >
            Edit my profile
            <span>→</span>
          </Link>

        </section>

      )}


      {/* OFFICIAL SOURCE NOTICE */}
      <div className="recommendations-notice">

        <span>✦</span>

        <p>
          These are potential matches, not a final
          eligibility decision. Always check the latest
          requirements and application process through
          the official scheme source before applying.
        </p>

      </div>


      {/* DETAILS MODAL */}
      {selectedScheme && (

        <div
          className="scheme-details-overlay"
          onClick={() => setSelectedScheme(null)}
        >

          <div
            className="scheme-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="scheme-modal-close"
              onClick={() =>
                setSelectedScheme(null)
              }
            >
              ×
            </button>


            <span className="scheme-category">
              {selectedScheme.scheme_category ||
                "Government Scheme"}
            </span>

            <h2>
              {selectedScheme.scheme_name}
            </h2>

            <p className="modal-description">
              {selectedScheme.details}
            </p>


            {detailsLoading && (
              <div className="modal-loading">
                Loading additional details...
              </div>
            )}

            {detailsError && (
              <div className="modal-error">
                {detailsError}
              </div>
            )}


            <div className="modal-section">

              <span>BENEFITS</span>

              <ul>
                {(selectedScheme.benefits || []).map(
                  (benefit, index) => (
                    <li key={index}>
                      {benefit}
                    </li>
                  )
                )}
              </ul>

            </div>


            <div className="modal-section">

              <span>ELIGIBILITY</span>

              <ul>
                {(selectedScheme.eligibility || []).map(
                  (item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}
              </ul>

            </div>


            <div className="modal-section">

              <span>DOCUMENTS</span>

              <ul>
                {(selectedScheme.documents || []).map(
                  (document, index) => (
                    <li key={index}>
                      {document}
                    </li>
                  )
                )}
              </ul>

            </div>


            <div className="modal-section">

              <span>APPLICATION STEPS</span>

              <ol>
                {(selectedScheme.application_steps || []).map(
                  (step, index) => (
                    <li key={index}>
                      {step}
                    </li>
                  )
                )}
              </ol>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

export default Recommendations;