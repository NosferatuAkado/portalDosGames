const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        observer.unobserve(entry.target);
    });
}, {
    threshold: 0.2, 
    rootMargin: "0px 0px -10% 0px" 
});

document.querySelectorAll(".fade-in-section").forEach(el => observer.observe(el));
