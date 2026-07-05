const wishlist = JSON.parse(
    localStorage.getItem("wishlist")
) || [];

async function loadWishlist() {
    const response = await fetch(API_URL);
    const data = await response.json();
    const savedHotels = data.data.filter(hotel =>
        wishlist.includes(hotel.id)
    );
    renderWishlist(savedHotels);
}

function renderWishlist(savedHotels) {
    const container =
        document.getElementById("wishlist-container");
    if (savedHotels.length === 0) {
        container.innerHTML = `
            <div class="empty-wishlist">
                <h2>Your Wishlist is Empty</h2>
                <p>
                    Start exploring hotels and save your
                    favorite stays for later.
                </p>
                <a href="index.html" class="home-btn">
                    Explore All Stays
                </a>
            </div>
        `;
        return;
    }

    container.innerHTML = "";
    savedHotels.forEach(hotel => {
        container.innerHTML += `
            <div
                class="hotel-card"
                onclick="window.location.href='hotel-details.html?id=${hotel.id}'"
            >
                <span class="wishlist-badge">❤️</span>
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
                    <button
                        class="remove-btn"
                        onclick="removeFromWishlist(event, ${hotel.id})"
                    >
                        Remove from Wishlist
                    </button>
                </div>
            </div>
        `;
    });
}

loadWishlist();

function removeFromWishlist(event, id) {
    event.stopPropagation();
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