const params = new URLSearchParams(window.location.search);

const hotelId = Number(params.get("id"));

async function fetchBookingHotel() {

    try {

        const response = await fetch(API_URL);

        const data = await response.json();

        const hotel = data.data.find(
            (item) => item.id === hotelId
        );

        renderBookingPage(hotel);

    }

    catch (error) {

        console.error("Booking Error:", error);

    }

}

function renderBookingPage(hotel) {

    const bookingContainer =
        document.getElementById("booking-container");

    bookingContainer.innerHTML = `

        <div class="booking-card">

            <h1>
                Book Your Stay at ${hotel.name}
            </h1>

            <p>📍 ${hotel.location}</p>

            <p class="details-price">
                ₹${hotel.price} / night
            </p>

            <div class="booking-field">

                <label>Check-in Date</label>

                <input
                    type="date"
                    id="check-in"
                >

            </div>

            <div class="booking-field">

                <label>Check-out Date</label>

                <input
                    type="date"
                    id="check-out"
                >

            </div>

            <div class="booking-field">

                <label>Guests</label>

                <select id="guests">

                    <option value="1">1 Guest</option>
                    <option value="2" selected>2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>

                </select>

            </div>

            <div class="booking-field">

                <label>Rooms</label>

                <select id="rooms">

                    <option value="1" selected>1 Room</option>
                    <option value="2">2 Rooms</option>
                    <option value="3">3 Rooms</option>

                </select>

            </div>

            <div class="booking-summary">

                <p id="nights-text">
                    Select dates to see total nights.
                </p>

                <h3 id="total-price">
                    Total: ₹0
                </h3>

            </div>

            <button
                id="confirm-booking-btn"
                class="book-btn"
            >
                Confirm Booking
            </button>

        </div>

    `;

    setupDateInputs(hotel.price);

}

function setupDateInputs(hotelPrice) {

    const checkInInput =
        document.getElementById("check-in");

    const checkOutInput =
        document.getElementById("check-out");

    const guestsInput =
        document.getElementById("guests");

    const roomsInput =
        document.getElementById("rooms");

    const nightsText =
        document.getElementById("nights-text");

    const totalPriceText =
        document.getElementById("total-price");

    function updateBookingSummary() {

        if (
            !checkInInput.value ||
            !checkOutInput.value
        ) {
            return;
        }

        const checkIn =
            new Date(checkInInput.value);

        const checkOut =
            new Date(checkOutInput.value);

        const diffTime =
            checkOut - checkIn;

        const nights =
            diffTime / (1000 * 60 * 60 * 24);

        if (nights <= 0) {

            nightsText.textContent =
                "Check-out must be after check-in.";

            totalPriceText.textContent =
                "Total: ₹0";

            return;
        }

        const total =
            hotelPrice * nights *
            Number(roomsInput.value);

        nightsText.textContent =
            `${nights} night${nights > 1 ? "s" : ""}`;

        totalPriceText.textContent =
            `Total: ₹${total.toLocaleString("en-IN")}`;

    }

    checkInInput.addEventListener(
        "change",
        updateBookingSummary
    );

    checkOutInput.addEventListener(
        "change",
        updateBookingSummary
    );

    roomsInput.addEventListener(
        "change",
        updateBookingSummary
    );

    const today =
        new Date().toISOString().split("T")[0];

    checkInInput.min = today;
    checkOutInput.min = today;

    checkInInput.addEventListener("change", () => {

        checkOutInput.min =
            checkInInput.value;

    });

    const confirmButton =
        document.getElementById(
            "confirm-booking-btn"
        );

    confirmButton.addEventListener("click", () => {

        if (
            !checkInInput.value ||
            !checkOutInput.value
        ) {

            alert(
                "Please select both check-in and check-out dates."
            );

            return;
        }

        if (
            checkOutInput.value <= checkInInput.value
        ) {

            alert(
                "Check-out date must be after check-in date."
            );

            return;
        }

        let history = JSON.parse(
            localStorage.getItem("history")
        ) || [];

        history = history.filter(
            item => item.id !== hotelId
        );

        const checkIn =
            new Date(checkInInput.value);

        const checkOut =
            new Date(checkOutInput.value);

        const nights =
            (checkOut - checkIn)
            / (1000 * 60 * 60 * 24);

        const totalPrice =
            hotelPrice * nights *
            Number(roomsInput.value);

        history.push({

            id: hotelId,

            bookedAt: new Date().toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            ),

            checkIn: checkInInput.value,

            checkOut: checkOutInput.value,

            guests: Number(guestsInput.value),

            rooms: Number(roomsInput.value),

            nights: nights,

            totalPrice: totalPrice

        });

        localStorage.setItem(
            "history",
            JSON.stringify(history)
        );

        window.location.href =
            `booking-success.html?id=${hotelId}`;

    });

}
fetchBookingHotel();


