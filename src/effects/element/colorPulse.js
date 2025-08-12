/**
 * applyColorPulse - Reveals elements with a smooth color pulse animation on scroll.
 *
 * @param {object} [options={}] - Configuration options.
 * @param {string} [options.selector='.color-pulse'] - CSS selector for elements to reveal.
 * @param {string} [options.pulseColor='#ff4081'] - The color to pulse to.
 * @param {number} [options.duration=1000] - Duration of one pulse cycle in milliseconds.
 * @param {boolean} [options.once=true] - Whether the animation should only run once.
 */
export function applyColorPulse(options = {}) {
    const defaults = {
        selector: '.color-pulse',
        pulseColor: '#ff4081',
        duration: 1000,
        once: true,
    };

    const config = { ...defaults, ...options };
    const elements = document.querySelectorAll(config.selector);

    if (elements.length === 0) {
        console.warn(`applyColorPulse: No elements found with selector: "${config.selector}"`);
        return;
    }

    elements.forEach(el => {
        el.style.transition = `background-color ${config.duration}ms ease-in-out`;
    });

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const originalColor = window.getComputedStyle(el).backgroundColor;

                let pulseOn = true;
                const pulse = () => {
                    if (!entry.isIntersecting) return;
                    el.style.backgroundColor = pulseOn ? config.pulseColor : originalColor;
                    pulseOn = !pulseOn;
                    if (!config.once) {
                        setTimeout(pulse, config.duration);
                    }
                };

                pulse();

                if (config.once) {
                    observer.unobserve(el);
                }
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}


