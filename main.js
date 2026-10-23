document.addEventListener("DOMContentLoaded", function () {

    const progressFill =
        document.querySelector(".progress-fill");

    if (progressFill) {

        progressFill.style.width = "0%";

        setTimeout(function () {
            progressFill.style.width = "78%";
        }, 300);

    }


    const featureCards =
        document.querySelectorAll(".feature-card");

    featureCards.forEach(function (card, index) {

        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";

        setTimeout(function () {

            card.style.transition =
                "opacity 0.6s ease, transform 0.6s ease";

            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

        }, 150 * index);

    });

});
// =====================================================
// NUTRITRACK - HERO BACKGROUND IMAGE SLIDER
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const hero = document.querySelector(".hero");
    const previousButton = document.getElementById("heroPrev");
    const nextButton = document.getElementById("heroNext");

    if (!hero || !previousButton || !nextButton) {
        return;
    }

    const heroImages = [
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
        "https://images.unsplash.com/photo-1547592180-85f173990554"
    ];

    let currentImage = 0;

    function showHeroImage(index) {

        if (index < 0) {
            currentImage = heroImages.length - 1;
        } else if (index >= heroImages.length) {
            currentImage = 0;
        } else {
            currentImage = index;
        }

        hero.style.backgroundImage =
            `url("${heroImages[currentImage]}")`;
    }

    previousButton.addEventListener("click", function () {
        showHeroImage(currentImage - 1);
    });

    nextButton.addEventListener("click", function () {
        showHeroImage(currentImage + 1);
    });

    // First image
    showHeroImage(0);
});