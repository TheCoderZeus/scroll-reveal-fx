/**
 *
 * @param {object} [options={}] - The configuration options.
 * @param {string} [options.selector='.flip3d-reveal'] - CSS selector for elements to reveal.
 * @param {number} [options.duration=700] - Duration of the animation in milliseconds.
 * @param {string} [options.easing='ease-in-out'] - CSS easing function for the animation.
 * @param {boolean} [options.once=true] - Whether the animation should only run once.
 */
export function applyFlip3D(options = {}) {
    const defaults = {
        selector: '.flip3d-reveal',
        duration: 700,
        easing: 'ease-in-out',
        once: true,
    };

    const config = { ...defaults, ...options };
    const elements = document.querySelectorAll(config.selector);

    if (elements.length === 0) {
        console.warn(`applyFlip3D: No elements found with selector: "${config.selector}"`);
        return;
    }

    elements.forEach(el => {
        el.style.transformStyle = 'preserve-3d';
        el.style.backfaceVisibility = 'hidden';
        el.style.transform = 'rotateY(90deg)';
        el.style.opacity = 0;
        el.style.transition = `transform ${config.duration}ms ${config.easing}, opacity ${config.duration}ms ${config.easing}`;
        el.style.transformOrigin = 'center center';
        el.style.perspective = '1000px';
    });

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.transform = 'rotateY(0deg)';
                el.style.opacity = 1;

                if (config.once) {
                    observer.unobserve(el);
                }
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}


