const searchInput =
    document.getElementById("search-input");

const searchButton = document.getElementById("search-btn");

const suggestionsBox =
    document.getElementById("suggestions-box");

let suggestions = [];
async function loadSuggestions() {

    const response = await fetch(API_URL);

    const data = await response.json();

    const cities = [
        ...new Set(data.data.map(hotel => hotel.location))
    ];

    const hotelNames = data.data.map(hotel => hotel.name);

    const ratings = [
    "5 Stars",
    "4 Stars & Above",
    "3 Stars & Above"
    ];

    suggestions = [
        ...cities,
        ...hotelNames,
        ...ratings
    ];

}

loadSuggestions();
searchInput.addEventListener("input", () => {

    const value =
        searchInput.value.toLowerCase();

    if (!value) {

        suggestionsBox.style.display = "none";

        return;
    }

    const filteredSuggestions =
        suggestions.filter(item =>
            item.toLowerCase().includes(value)
        );

    suggestionsBox.innerHTML = "";

    filteredSuggestions
    .slice(0, 6)
    .forEach(item => {

        let icon = "🏨";

        if (
            item.includes("Stars")
        ) {
            icon = "⭐";
        }

        else if (
            !item.toLowerCase().includes("hotel")
        ) {
            icon = "📍";
        }

        suggestionsBox.innerHTML += `
            <div class="suggestion-item">
                ${icon} ${item}
            </div>
        `;

    });

    suggestionsBox.style.display =
        filteredSuggestions.length
            ? "block"
            : "none";

});

suggestionsBox.addEventListener("click", (event) => {

    if (
        event.target.classList.contains(
            "suggestion-item"
        )
    ) {

        searchInput.value =
            event.target.textContent
                .replace("📍 ", "")
                .replace("🏨 ", "")
                .trim();

        suggestionsBox.style.display = "none";
    }

});

searchButton.addEventListener("click", () => {

    const query = searchInput.value.trim();

    if (query === "") {
        alert("Please enter something to search.");
        return;
    }

    window.location.href = `results.html?q=${query}`;

});
searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        searchButton.click();
    }

});

document.addEventListener("click", (event) => {

    if (
        !searchInput.contains(event.target) &&
        !suggestionsBox.contains(event.target)
    ) {

        suggestionsBox.style.display = "none";

    }

});