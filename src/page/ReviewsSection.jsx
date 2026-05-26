import { useEffect, useState } from "react";
import API from "../api";
import "./ReviewsSection.css";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    name: "",
    rating: "5",
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  const loadReviews = async () => {
    try {
      const res = await API.get("/reviews");
      setReviews(res.data || []);
    } catch (err) {
      console.log("Load reviews error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const submitReview = async () => {
    if (!form.name.trim() || !form.comment.trim()) {
      alert("Please write your name and review");
      return;
    }

    try {
      setLoading(true);

      await API.post("/reviews", {
        name: form.name.trim(),
        rating: Number(form.rating),
        comment: form.comment.trim(),
      });

      setForm({
        name: "",
        rating: "5",
        comment: "",
      });

      alert("Thank you! Your review has been sent to the admin for approval.");
    } catch (err) {
      alert(err.response?.data?.error || "Review not sent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="reviews-section">
      <div className="reviews-form-card">
        <span className="reviews-label">Share Your Experience</span>

        <h2>Write Your Point Of View</h2>

        <p>
          Tell us about your experience with Egypt Holiday Travel. Your review
          helps other travelers choose with confidence.
        </p>

        <div className="reviews-form-grid">
          <div>
            <label>Your Name</label>
            <input
              type="text"
              placeholder="Example: Mohamed A."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label>Rating</label>
            <select
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
            >
              <option value="5">★★★★★ Excellent</option>
              <option value="4">★★★★ Good</option>
              <option value="3">★★★ Average</option>
              <option value="2">★★ Poor</option>
              <option value="1">★ Bad</option>
            </select>
          </div>
        </div>

        <div>
          <label>Your Review</label>
          <textarea
            placeholder="Write your opinion about our service..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
          />
        </div>

        <button type="button" onClick={submitReview} disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>

      {reviews.length > 0 && (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div className="review-card" key={review._id}>
              <div className="review-card-head">
                <div className="review-avatar">
                  {review.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div>
                  <h3>{review.name}</h3>
                  <span>{"★".repeat(Number(review.rating || 5))}</span>
                </div>
              </div>

              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}