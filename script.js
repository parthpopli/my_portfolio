document.addEventListener("DOMContentLoaded", () => {
    console.log("Portfolio Loaded Successfully");

    // ==========================
    // Time on Website Counter
    // ==========================
  // ==========================
// LEETCODE COUNTER
// ==========================

function animateCounter(id, target) {

    let current = 0;

    const element =
        document.getElementById(id);

    const increment =
        Math.ceil(target / 50);

    const timer = setInterval(() => {

        current += increment;

        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        element.textContent =
            current + "+";

    }, 30);
}

animateCounter("leetcodeCounter", 100);

animateCounter("leetcodeCounter", 100);

animateCounter("leetcodeCounter", 100);
animateCounter("projectCounter", 5);

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
        const timeline =
document.querySelector(".timeline-container");

const progress =
document.querySelector(".timeline-progress");

window.addEventListener("scroll", () => {


if(!timeline || !progress) return;

const rect =
    timeline.getBoundingClientRect();

const windowHeight =
    window.innerHeight;

const total =
    timeline.offsetHeight;

const visible =
    windowHeight - rect.top;

const percentage =
    Math.min(
        Math.max(
            (visible / total) * 100,
            0
        ),
        100
    );

progress.style.height =
    percentage + "%";


});


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

