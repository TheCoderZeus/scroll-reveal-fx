/**
 *
 * @param {object} [options={}] - Configuration options.
 * @param {string} [options.selector='.wave-reveal'] - CSS selector for elements to reveal.
 * @param {number} [options.duration=800] - Duration of the animation in milliseconds.
 * @param {number} [options.stagger=100] - Delay between each element's animation in milliseconds.
 * @param {string} [options.easing='ease-out'] - CSS easing function for the animation.
 * @param {boolean} [options.once=true] - Whether the animation should only run once.
 */
export function applyWaveReveal(options = {}) {
    const defaults = {
        selector: '.wave-reveal',
        duration: 800,
        stagger: 100,
        easing: 'ease-out',
        once: true,
    };

    const config = { ...defaults, ...options };
    const elements = document.querySelectorAll(config.selector);

    if (elements.length === 0) {
        console.warn(`applyWaveReveal: No elements found with selector: "${config.selector}"`);
        return;
    }

    elements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity ${config.duration}ms ${config.easing}, transform ${config.duration}ms ${config.easing}`;
    });

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                setTimeout(() => {
                    el.style.opacity = 1;
                    el.style.transform = 'translateY(0)';
                }, index * config.stagger);

                if (config.once) {
                    observer.unobserve(el);
                }
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}


