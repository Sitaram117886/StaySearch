const params = new URLSearchParams(window.location.search);
const hotelId = Number(params.get("id"));
const loadingState =
    document.getElementById(
        "loading-state"
    );
const hotelContainer =
    document.getElementById(
        "hotel-details-container"
    );
console.log("Hotel ID:", hotelId);

async function fetchHotelDetails() {
    try {
        loadingState.style.display = "block";
        hotelContainer.style.display = "none";
        const response = await fetch(API_URL);
        const data = await response.json();
        await new Promise(
            resolve => setTimeout(resolve, 800)
        );
        const hotel = data.data.find(
            (item) => item.id === hotelId
        );
        if (!hotel) {
            loadingState.style.display = "none";
            hotelContainer.style.display = "block";
            hotelContainer.innerHTML = `
                <h2>Hotel not found.</h2>
            `;
            return;
        }
        const detailsContainer =
            document.getElementById("hotel-details-container");
        const wishlist = JSON.parse(
            localStorage.getItem("wishlist")
        ) || [];
        const isSaved = wishlist.includes(hotel.id);
        const history = JSON.parse(
            localStorage.getItem("history")
        ) || [];
        const bookingInfo = history.find(
            item => item.id === hotel.id
        );
        detailsContainer.innerHTML = `
        <div class="hotel-details-card">
            <img
                src="${hotel.thumbnail}"
                alt="${hotel.name}"
                class="details-hero-image"
            >
            <div class="details-content">
                <h1>${hotel.name}</h1>
                <div class="details-meta">
                    <span>📍 ${hotel.location}</span>
                    <span>⭐ ${hotel.rating}</span>
                </div>
                <p class="details-price">
                    ₹${hotel.price} / night
                </p>
                ${bookingInfo ? `
                    <div class="previous-booking-info">
                        🗓️ Previously booked on ${bookingInfo.bookedAt}
                    </div>
                ` : ""}
                <p class="details-description">
                    ${hotel.description}
                </p>
                <div class="details-actions">
                    <button
                        class="wishlist-btn"
                        onclick="${
                            isSaved
                                ? `removeFromWishlist(${hotel.id})`
                                : `addToWishlist(${hotel.id})`
                        }"
                    >
                        ${
                            isSaved
                                ? "Remove from Wishlist"
                                : "❤️ Add to Wishlist"
                        }
                    </button>
                    <button
                        class="book-btn"
                        onclick="bookHotel(${hotel.id})"
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
        `;
        loadingState.style.display = "none";
        hotelContainer.style.display = "block";
    }
    catch (error) {
        console.error("Error fetching hotel details:", error);
    }
}

fetchHotelDetails();

function addToWishlist(id) {
    let wishlist = JSON.parse(
        localStorage.getItem("wishlist")
    ) || [];
    if (!wishlist.includes(id)) {
        wishlist.push(id);
        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );
        alert("Added to wishlist ❤️");
    }
    else {
        alert("Already in wishlist!");
    }
}

function removeFromWishlist(id) {
    let wishlist = JSON.parse(
        localStorage.getItem("wishlist")
    ) || [];
    wishlist = wishlist.filter(
        hotelId => hotelId !== id
    );
    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );
    location.reload();
}

function bookHotel(id) {
    let history = JSON.parse(
        localStorage.getItem("history")
    ) || [];
    const alreadyBooked = history.some(
        item => item.id === id
    );
    if (!alreadyBooked) {
        history.push({
            id: id,
            bookedAt: new Date().toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            )
        });
        localStorage.setItem(
            "history",
            JSON.stringify(history)
        );
    }
    window.location.href =
        `booking.html?id=${id}`;
}