document.addEventListener("DOMContentLoaded", () => {
    console.log("Portfolio Loaded Successfully");

    // ==========================
    // Time on Website Counter
    // ==========================

    let seconds = 0;
    const timeElement = document.getElementById("timeSpent");

    setInterval(() => {
        seconds++;

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        if (timeElement) {
            timeElement.textContent = `${minutes}m ${remainingSeconds}s`;
        }
    }, 1000);

    // ==========================
    // Scroll Elements (cached)
    // ==========================

    const scrollElement = document.getElementById("scrollPercent");
    const progressBar = document.getElementById("progress-bar");
    const navLinks = document.querySelectorAll(".nav-links a");
    const sections = document.querySelectorAll("section");

    // ==========================
    // Scroll Handler (single)
    // ==========================

    window.addEventListener("scroll", () => {
        const scrollTop = window.pageYOffset;
        const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const percentage =
            docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

        // Update scroll percentage
        if (scrollElement) {
            scrollElement.textContent = `${percentage}%`;
        }

        // Update progress bar
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }

        // ==========================
        // Active Navbar Links
        // ==========================

        let currentSection = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 150;

            if (scrollTop >= sectionTop) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${currentSection}`
            );
        });
    });
});