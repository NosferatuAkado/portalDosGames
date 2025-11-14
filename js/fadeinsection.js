const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
        }
    });
});

document.querySelectorAll(".fade-in-section")
        .forEach(sec => observer.observe(sec));
