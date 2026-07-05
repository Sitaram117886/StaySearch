const params =
    new URLSearchParams(window.location.search);

const hotelId =
    Number(params.get("id"));

const loadingState =
    document.getElementById(
        "loading-state"
    );

const bookingContainer =
    document.getElementById(
        "booking-container"
    );

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

async function loadSuccessPage() {

    loadingState.style.display = "block";

    bookingContainer.style.display = "none";

    const response =
        await fetch(API_URL);

    const data =
        await response.json();

    await new Promise(
        resolve => setTimeout(resolve, 1000)
    );

    const hotel =
        data.data.find(
            item => item.id === hotelId
        );

    const history =
        JSON.parse(
            localStorage.getItem("history")
        ) || [];

    const bookingInfo =
        history.find(
            item => item.id === hotelId
        );

    renderSuccessPage(
        hotel,
        bookingInfo
    );

    loadingState.style.display = "none";

    bookingContainer.style.display = "block";

}

function renderSuccessPage(
    hotel,
    bookingInfo
) {

    const container =
        document.getElementById(
            "booking-container"
        );

    container.innerHTML = `

        <div class="booking-card">

            <div class="success-icon">
                ✅
            </div>

            <h1>
                Booking Confirmed!
            </h1>

            <p class="booking-message">
                Thank you for choosing StaySearch.
            </p>

            <div class="booking-hotel-info">

                <h2>${hotel.name}</h2>

                <p>
                    📍 ${hotel.location}
                </p>

                <p>
                    🗓️ Check-in:
                    ${formatDate(bookingInfo.checkIn)}
                </p>

                <p>
                    🗓️ Check-out:
                    ${formatDate(bookingInfo.checkOut)}
                </p>

                <p>
                    Guests:
                    ${bookingInfo.guests}
                </p>

                <p>
                    Rooms:
                    ${bookingInfo.rooms}
                </p>

                <p>
                    Nights:
                    ${bookingInfo.nights}
                </p>

                <p class="success-total">
                    Total Paid:
                    ₹${bookingInfo.totalPrice.toLocaleString("en-IN")}
                </p>

            </div>

            <div class="booking-actions">

                <a
                    href="history.html"
                    class="home-btn"
                >
                    View History
                </a>

                <a
                    href="index.html"
                    class="explore-btn"
                >
                    Back to Home
                </a>

            </div>

        </div>

    `;

}

loadSuccessPage();