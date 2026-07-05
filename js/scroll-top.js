const scrollTopButton =
    document.getElementById(
        "scroll-top-btn"
    );

if (scrollTopButton) {

    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 300) {

                scrollTopButton.classList.add(
                    "show"
                );

            }

            else {

                scrollTopButton.classList.remove(
                    "show"
                );

            }

        }
    );

    scrollTopButton.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}