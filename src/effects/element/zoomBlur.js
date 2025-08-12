/**
 * applyZoomBlur - Reveals elements by zooming in with a blur effect that clears on full reveal.
 *
 * @param {object} [options={}] - Configuration options.
 * @param {string} [options.selector='.zoom-blur'] - CSS selector for elements to reveal.
 * @param {number} [options.duration=700] - Duration of the animation in milliseconds.
 * @param {string} [options.easing='ease-out'] - CSS easing function for the animation.
 * @param {boolean} [options.once=true] - Whether the animation should only run once.
 */
export function applyZoomBlur(options = {}) {
    const defaults = {
        selector: '.zoom-blur',
        duration: 700,
        easing: 'ease-out',
        once: true,
    };

    const config = { ...defaults, ...options };
    const elements = document.querySelectorAll(config.selector);

    if (elements.length === 0) {
        console.warn(`applyZoomBlur: No elements found with selector: "${config.selector}"`);
        return;
    }

    elements.forEach(el => {
        el.style.opacity = 0;
        el.style.filter = 'blur(5px)';
        el.style.transform = 'scale(0.8)';
        el.style.transition = `opacity ${config.duration}ms ${config.easing}, filter ${config.duration}ms ${config.easing}, transform ${config.duration}ms ${config.easing}`;
    });

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.opacity = 1;
                el.style.filter = 'blur(0)';
                el.style.transform = 'scale(1)';

                if (config.once) {
                    observer.unobserve(el);
                }
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}


