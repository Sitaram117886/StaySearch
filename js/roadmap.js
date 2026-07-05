const infoButton =
    document.getElementById("info-btn");
const roadmapPanel =
    document.getElementById("roadmap-panel");
infoButton.addEventListener("click", (event) => {
    event.stopPropagation();
    roadmapPanel.classList.toggle("show");
});

document.addEventListener("click", (event) => {
    if (
        !roadmapPanel.contains(event.target) &&
        !infoButton.contains(event.target)
    ) {
        roadmapPanel.classList.remove("show");
    }
});