import { useEffect, useState } from "react";
import API from "../../api";
import "./Admin.css";

const getReviewFlagUrl = (review) => {
  const code = String(review.code || review.countryCode || "")
    .trim()
    .toLowerCase();

  return /^[a-z]{2}$/.test(code)
    ? `https://flagcdn.com/w80/${code}.png`
    : "";
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [notice, setNotice] = useState({
    show: false,
    type: "error",
    title: "",
    message: "",
  });

  const showNotice = (type, title, message) => {
    setNotice({
      show: true,
      type,
      title,
      message,
    });
  };

  const closeNotice = () => {
    setNotice({
      show: false,
      type: "error",
      title: "",
      message: "",
    });
  };

  const loadReviews = async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/reviews/all");
      setReviews(res.data || []);
    } catch {
      showNotice(
        "error",
        "Unable to Load Reviews",
        "Please make sure the backend server is running and the reviews route is added correctly."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/admin/reviews/${id}/status`, { status });

      setReviews((prev) =>
        prev.map((review) => (review._id === id ? res.data : review))
      );

      showNotice(
        "success",
        status === "public" ? "Review Is Public" : "Review Is Private",
        status === "public"
          ? "This review will now appear on the Home page."
          : "This review is now hidden from the Home page."
      );
    } catch (err) {
      showNotice(
        "error",
        "Update Failed",
        err.response?.data?.error || "Unable to update review status."
      );
    }
  };

  const confirmDeleteReview = async () => {
    if (!deleteTarget?._id) return;

    try {
      await API.delete(`/admin/reviews/${deleteTarget._id}`);

      setReviews((prev) =>
        prev.filter((review) => review._id !== deleteTarget._id)
      );

      setDeleteTarget(null);

      showNotice(
        "success",
        "Review Deleted",
        "The review has been removed successfully."
      );
    } catch (err) {
      setDeleteTarget(null);

      showNotice(
        "error",
        "Delete Failed",
        err.response?.data?.error || "Unable to delete this review."
      );
    }
  };

  return (
    <>
      <section className="admin-panel reviews-admin-panel">
        <div className="panel-head">
          <div>
            <h2>Client Reviews</h2>
            <p>
              Manage visitor and client reviews. Make them public to show them
              on the Home page, keep them private, or delete them.
            </p>
          </div>

          <button type="button" onClick={loadReviews}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="admin-loading">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="admin-empty-state large">
            <h3>No reviews yet</h3>
            <p>New reviews will appear here after visitors submit them.</p>
          </div>
        ) : (
          <div className="admin-reviews-grid">
            {reviews.map((review) => (
              <article className="admin-review-card" key={review._id}>
                <div className="admin-review-head">
                  <div className="admin-review-avatar">
                    {review.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div className="admin-review-person">
                    <h3>
                      {review.name}
                      {getReviewFlagUrl(review) && (
                        <img
                          className="admin-review-flag"
                          src={getReviewFlagUrl(review)}
                          alt={`${review.country || "Country"} flag`}
                          title={review.country || "Country"}
                          loading="lazy"
                        />
                      )}
                    </h3>

                    <span className="admin-review-stars">
                      {"\u2605".repeat(Number(review.rating || 5))}
                    </span>

                    {review.country && (
                      <small className="admin-review-country">
                        {review.country} traveler
                      </small>
                    )}
                  </div>

                  <span className={`review-status ${review.status}`}>
                    {review.status === "public" ? "Public" : "Private"}
                  </span>
                </div>

                <p className="admin-review-comment">{review.comment}</p>

                <small className="admin-review-date">
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString("en-GB")
                    : "New review"}
                </small>

                <div className="admin-review-actions">
                  <button
                    type="button"
                    className="make-public-btn"
                    onClick={() => updateStatus(review._id, "public")}
                    disabled={review.status === "public"}
                  >
                    Make Public
                  </button>

                  <button
                    type="button"
                    className="make-private-btn"
                    onClick={() => updateStatus(review._id, "private")}
                    disabled={review.status === "private"}
                  >
                    Make Private
                  </button>

                  <button
                    type="button"
                    className="delete-review-btn"
                    onClick={() => setDeleteTarget(review)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {notice.show && (
        <ReviewNoticePopup notice={notice} onClose={closeNotice} />
      )}

      {deleteTarget && (
        <ReviewDeletePopup
          review={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDeleteReview}
        />
      )}
    </>
  );
}

function ReviewNoticePopup({ notice, onClose }) {
  return (
    <div className="admin-pro-popup-overlay">
      <div className={`admin-pro-popup ${notice.type}`}>
        <div className="admin-pro-popup-icon">
          {notice.type === "success" ? "\u2713" : "!"}
        </div>

        <h3>{notice.title}</h3>
        <p>{notice.message}</p>

        <button type="button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

function ReviewDeletePopup({ review, onCancel, onConfirm }) {
  return (
    <div className="admin-pro-popup-overlay">
      <div className="admin-pro-popup danger">
        <div className="admin-pro-popup-icon">!</div>

        <h3>Delete Review?</h3>

        <p>
          Are you sure you want to delete the review written by{" "}
          <strong>{review.name}</strong>? This action cannot be undone.
        </p>

        <div className="admin-pro-popup-actions">
          <button
            type="button"
            className="delete-confirm-btn"
            onClick={onConfirm}
          >
            Delete
          </button>

          <button
            type="button"
            className="cancel-confirm-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
