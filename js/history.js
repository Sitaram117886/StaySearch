const historyData = JSON.parse(
    localStorage.getItem("history")
) || [];

function formatDate(dateString) {
    return new Date(dateString)
        .toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
}

async function loadHistory() {
    const response = await fetch(API_URL);
    const data = await response.json();
    const bookedHotels = data.data.filter(hotel =>
        historyData.some(item => item.id === hotel.id)
    );
    renderHistory(bookedHotels);
}

function renderHistory(bookedHotels) {
    const historyContainer =
        document.getElementById("history-container");
    if (bookedHotels.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-history">
                <h2>No Previous Bookings</h2>
                <p>
                    Your travel memories will appear here
                    after you book your first stay.
                </p>
                <a href="index.html" class="home-btn">
                    Explore All Stays
                </a>
            </div>
        `;
        return;
    }
    historyContainer.innerHTML = "";
    const wishlist = JSON.parse(
        localStorage.getItem("wishlist")
    ) || [];

    bookedHotels.forEach((hotel) => {
        const bookingInfo =
            historyData.find(item => item.id === hotel.id);
            historyContainer.innerHTML += `
            <div
                class="hotel-card"
                onclick="window.location.href='hotel-details.html?id=${hotel.id}'"
            >
                <span class="history-badge">
                    🗓️ Previously Booked
                </span>
                ${wishlist.includes(hotel.id)
                    ? '<span class="wishlist-badge">❤️</span>'
                    : ''
                }
                <img
                    src="${hotel.thumbnail}"
                    alt="${hotel.name}"
                    class="hotel-image"
                >
                <div class="hotel-info">
                    <h2>${hotel.name}</h2>
                    <div class="hotel-meta">
                        <span>📍 ${hotel.location}</span>
                        <span>⭐ ${hotel.rating}</span>
                    </div>
                    <p class="hotel-price">
                        ₹${hotel.price} / night
                    </p>
                    <p class="booking-date">
                        Booked on ${bookingInfo.bookedAt}
                    </p>
                    <p class="stay-dates">
                        ${formatDate(bookingInfo.checkIn)}
                        → ${formatDate(bookingInfo.checkOut)}
                    </p>
                    <p class="stay-info">
                        ${bookingInfo.guests} Guests
                    </p>
                    <p class="stay-info">
                        ${bookingInfo.rooms} Room${bookingInfo.rooms > 1 ? "s" : ""}
                    </p>
                    <p class="stay-info">
                        ${bookingInfo.nights} Night${bookingInfo.nights > 1 ? "s" : ""}
                    </p>
                    <p class="stay-price">
                        ${bookingInfo.totalPrice.toLocaleString("en-IN")}
                    </p>
                    <button
                        class="remove-history-btn"
                        onclick="removeFromHistory(event, ${hotel.id})"
                    >
                        Remove from History
                    </button>
                </div>
            </div>
        `;
    });
}

loadHistory();

function removeFromHistory(event, id) {
    event.stopPropagation();
    let history = JSON.parse(
        localStorage.getItem("history")
    ) || [];
    history = history.filter(
        item => item.id !== id
    );
    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );
    location.reload();
}