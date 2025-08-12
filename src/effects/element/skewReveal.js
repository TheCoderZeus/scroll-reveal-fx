/**
 * applySkewReveal - Reveals elements with a subtle skew and slide that settles to normal.
 *
 * @param {object} [options={}] - Configuration options.
 * @param {string} [options.selector='.skew-reveal'] - CSS selector for elements to reveal.
 * @param {'x'|'y'} [options.axis='y'] - Axis to skew along.
 * @param {number} [options.angle=10] - Skew angle in degrees.
 * @param {number} [options.distance=20] - Initial translate distance in px.
 * @param {number} [options.duration=700] - Duration in ms.
 * @param {string} [options.easing='ease-out'] - CSS easing.
 * @param {boolean} [options.once=true] - Run only once.
 */
export function applySkewReveal(options = {}) {
    const defaults = {
        selector: '.skew-reveal',
        axis: 'y',
        angle: 10,
        distance: 20,
        duration: 700,
        easing: 'ease-out',
        once: true
    };
    const config = { ...defaults, ...options };

    const elements = document.querySelectorAll(config.selector);
    if (!elements.length) {
        console.warn(`applySkewReveal: No elements found with selector: "${config.selector}"`);
        return;
    }

    const skewProp = config.axis === 'x' ? 'skewX' : 'skewY';
    const translate = config.axis === 'x' ? `translateX(${config.distance}px)` : `translateY(${config.distance}px)`;

    elements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = `${skewProp}(${config.angle}deg) ${translate}`;
        el.style.transition = `opacity ${config.duration}ms ${config.easing}, transform ${config.duration}ms ${config.easing}`;
        el.style.willChange = 'opacity, transform';
    });

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.opacity = 1;
                el.style.transform = `${skewProp}(0deg) translate(0, 0)`;
                if (config.once) observer.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}


