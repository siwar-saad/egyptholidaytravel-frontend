import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function Hotels({ showSuccess }) {
  const defaultCover =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

  const [hotels, setHotels] = useState([]);
  const [hotelSearch, setHotelSearch] = useState("");
  const [showHotelForm, setShowHotelForm] = useState(false);

  const [newHotel, setNewHotel] = useState({
    name: "",
    city: "",
    mealPlan: "",
    fromDate: "",
    toDate: "",
    singleRoom: "",
    doubleRoom: "",
    tripleRoom: "",
    images: [],
  });

  const filteredHotels = hotels.filter((hotel) =>
    `${hotel.name || ""} ${hotel.city || ""} ${hotel.mealPlan || ""} ${
      hotel.singleRoom || ""
    } ${hotel.doubleRoom || ""}`
      .toLowerCase()
      .includes(hotelSearch.toLowerCase())
  );

  const handleHotelImages = (e) => {
    const files = Array.from(e.target.files || []);
    const images = files.map((file) => URL.createObjectURL(file));

    setNewHotel({
      ...newHotel,
      images: [...newHotel.images, ...images],
    });

    e.target.value = "";
  };

  const removeHotelImage = (index) => {
    setNewHotel({
      ...newHotel,
      images: newHotel.images.filter((_, i) => i !== index),
    });
  };

  const addHotel = () => {
    if (!newHotel.name || !newHotel.city || !newHotel.mealPlan) {
      showSuccess("Please fill hotel information.");
      return;
    }

    setHotels([newHotel, ...hotels]);

    setNewHotel({
      name: "",
      city: "",
      mealPlan: "",
      fromDate: "",
      toDate: "",
      singleRoom: "",
      doubleRoom: "",
      tripleRoom: "",
      images: [],
    });

    setShowHotelForm(false);
    showSuccess("Hotel added successfully.");
  };

  return (
    <>
      <section className="admin-panel">
        <div className="panel-head">
          <div>
            <h2>Hotels</h2>
            <p>Manage hotel photos, meal plans, prices and travel periods.</p>
          </div>

          <button
            className="add-package-btn-pro"
            onClick={() => setShowHotelForm(true)}
          >
            <FaPlus /> Add New Hotel
          </button>
        </div>

        <div className="client-tools">
          <input
            type="text"
            placeholder="Search hotels by name, city or meal plan..."
            value={hotelSearch}
            onChange={(e) => setHotelSearch(e.target.value)}
          />
        </div>

        {filteredHotels.length === 0 ? (
          <p className="empty-msg">No hotels found.</p>
        ) : (
          <div className="packages-admin-grid">
            {filteredHotels.map((hotel, index) => (
              <div className="package-admin-card" key={index}>
                <img
                  src={hotel.images[0] || defaultCover}
                  alt={hotel.name}
                  className="package-admin-image"
                  onError={(e) => {
                    e.currentTarget.src = defaultCover;
                  }}
                />

                <div className="package-admin-content">
                  <h3>{hotel.name}</h3>

                  <p>
                    <strong>City:</strong> {hotel.city} <br />
                    <strong>Meal Plan:</strong> {hotel.mealPlan} <br />
                    <strong>Period:</strong> {hotel.fromDate || "No date"} →{" "}
                    {hotel.toDate || "No date"}
                  </p>

                  <div className="package-admin-meta">
                    <span>Single: {hotel.singleRoom || "-"} USD</span>
                    <span>Double: {hotel.doubleRoom || "-"} USD</span>
                    <span>Triple: {hotel.tripleRoom || "-"} USD</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showHotelForm && (
        <div className="package-popup-overlay">
          <div className="package-popup">
            <div className="package-popup-head">
              <div>
                <h2>Add New Hotel</h2>
                <p>Add hotel details, photos, prices and travel periods.</p>
              </div>

              <button
                className="close-package-popup"
                onClick={() => setShowHotelForm(false)}
              >
                ×
              </button>
            </div>

            <div className="package-popup-form">
              <input
                type="text"
                placeholder="Hotel Name"
                value={newHotel.name}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, name: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="City"
                value={newHotel.city}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, city: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Meal Plan"
                value={newHotel.mealPlan}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, mealPlan: e.target.value })
                }
              />

              <input
                type="date"
                value={newHotel.fromDate}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, fromDate: e.target.value })
                }
              />

              <input
                type="date"
                value={newHotel.toDate}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, toDate: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Single Room Price"
                value={newHotel.singleRoom}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, singleRoom: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Double Room Price"
                value={newHotel.doubleRoom}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, doubleRoom: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Triple Room / Note"
                value={newHotel.tripleRoom}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, tripleRoom: e.target.value })
                }
              />

              <input type="file" accept="image/*" multiple onChange={handleHotelImages} />

              {newHotel.images.length > 0 && (
                <div className="hotel-preview-grid">
                  {newHotel.images.map((img, index) => (
                    <div className="hotel-preview-item" key={index}>
                      <img src={img} alt="hotel preview" />

                      <button type="button" onClick={() => removeHotelImage(index)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="package-popup-actions">
                <button onClick={addHotel}>Save Hotel</button>

                <button
                  className="cancel-package-btn"
                  onClick={() => setShowHotelForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
