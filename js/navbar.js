const currentPage =
    window.location.pathname
        .split("/")
        .pop();
const navLinks =
    document.querySelectorAll(
        ".nav-links a"
    );
navLinks.forEach((link) => {
    const href =
        link.getAttribute("href");
    if (href === currentPage) {
        link.classList.add("active");
    }
});