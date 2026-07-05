const params = new URLSearchParams(window.location.search);
const sortButtons =
    document.querySelectorAll(".sort-btn");
let currentSort = "default";
const query = params.get("q");
const budget = params.get("budget");
const resultsTitle =
    document.getElementById("results-title");
const loadingState =
    document.getElementById("loading-state");
const hotelsContainer =
    document.getElementById("hotels-container");

async function fetchHotels() {
    try {
        loadingState.style.display = "block";
        hotelsContainer.style.display = "none";
        const response = await fetch(API_URL);
        const hotels = await response.json();
        await new Promise(
            resolve => setTimeout(resolve, 1000)
        );

        let filteredHotels = [];
        if (query) {
            filteredHotels = hotels.data.filter((hotel) => {
                return (
                    hotel.name.toLowerCase().includes(query.toLowerCase()) ||
                    hotel.location.toLowerCase().includes(query.toLowerCase())
                );
            });
            resultsTitle.textContent =
                `Hotels in ${query} · ${filteredHotels.length} stays found`;
        }
        else if (budget) {
            filteredHotels = hotels.data.filter((hotel) => {
                const price = Number(hotel.price);
                if (budget === "under3000") {
                    return price < 3000;
                }
                if (budget === "3000to6000") {
                    return price >= 3000 && price < 6000;
                }
                if (budget === "6000to9000") {
                    return price >= 6000 && price < 9000;
                }
                if (budget === "above9000") {
                    return price >= 9000;
                }
            });
            let budgetTitle = "";
            if (budget === "under3000") {
                budgetTitle = "Hotels Under ₹3000";
            }
            else if (budget === "3000to6000") {
                budgetTitle = "Hotels Between ₹3000–₹6000";
            }
            else if (budget === "6000to9000") {
                budgetTitle = "Hotels Between ₹6000–₹9000";
            }
            else if (budget === "above9000") {
                budgetTitle = "Premium Hotels Above ₹9000";
            }
            resultsTitle.textContent =
                `${budgetTitle} · ${filteredHotels.length} stays found`;
        }
        const sortValue = currentSort;
        if (sortValue === "price-asc") {
            filteredHotels.sort(
                (a, b) => a.price - b.price
            );
        }
        else if (sortValue === "price-desc") {
            filteredHotels.sort(
                (a, b) => b.price - a.price
            );
        }
        else if (sortValue === "rating-desc") {
            filteredHotels.sort(
                (a, b) => b.rating - a.rating
            );
        }
        else if (sortValue === "name-asc") {

            filteredHotels.sort(
                (a, b) =>
                    a.name.localeCompare(b.name)
            );
        }
        if (filteredHotels.length === 0) {
            hotelsContainer.innerHTML = `
                <div class="empty-results">
                    <h2>
                        Oops! We couldn't find any matching stays.
                    </h2>
                    <p>
                        Try searching for another city, hotel,
                        or explore our popular destinations.
                    </p>
                    <a href="index.html" class="home-btn">
                        Back to Home
                    </a>
                </div>
            `;
            loadingState.style.display = "none";
            hotelsContainer.style.display = "block";
            return;
        }
        hotelsContainer.innerHTML = "";
        const wishlist = JSON.parse(
            localStorage.getItem("wishlist")
        ) || [];
        const history = JSON.parse(
            localStorage.getItem("history")
        ) || [];

        filteredHotels.forEach((hotel) => {
            hotelsContainer.innerHTML += `
                <div
                    class="hotel-card"
                    onclick="window.location.href='hotel-details.html?id=${hotel.id}'"
                >
                    ${history.some(item => item.id === hotel.id)
                        ? `
                            <span class="history-badge">
                                🗓️ Previously Booked
                            </span>
                        `
                        : ""
                    }
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
                    </div>
                </div>
            `;
        });
        loadingState.style.display = "none";
        hotelsContainer.style.display = "grid";
    }
    catch (error) {
        console.error("Error fetching hotels:", error);
    }
}

sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
        sortButtons.forEach((btn) => {
            btn.classList.remove("active");
        });
        button.classList.add("active");
        currentSort =
            button.dataset.sort;
        fetchHotels();
    });
});

fetchHotels();