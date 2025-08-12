/**
 * applyMaskWipe - Reveals elements using a directional clip-path wipe.
 *
 * @param {object} [options={}]
 * @param {string} [options.selector='.mask-wipe']
 * @param {'left'|'right'|'top'|'bottom'} [options.direction='left']
 * @param {number} [options.duration=800]
 * @param {string} [options.easing='ease-in-out']
 * @param {boolean} [options.once=true]
 */
export function applyMaskWipe(options = {}) {
    const defaults = {
        selector: '.mask-wipe',
        direction: 'left',
        duration: 800,
        easing: 'ease-in-out',
        once: true
    };
    const config = { ...defaults, ...options };

    const toInset = (dir) => {
        switch (dir) {
            case 'right': return '0 0 0 100%';
            case 'top': return '100% 0 0 0';
            case 'bottom': return '0 0 100% 0';
            case 'left':
            default: return '0 100% 0 0';
        }
    };

    const elements = document.querySelectorAll(config.selector);
    if (!elements.length) {
        console.warn(`applyMaskWipe: No elements found with selector: "${config.selector}"`);
        return;
    }

    elements.forEach(el => {
        el.style.opacity = '0.001';
        el.style.clipPath = `inset(${toInset(config.direction)})`;
        el.style.transition = `clip-path ${config.duration}ms ${config.easing}, opacity ${config.duration}ms ${config.easing}`;
        el.style.willChange = 'clip-path, opacity';
        el.style.overflow = 'hidden';
    });

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.opacity = '1';
                el.style.clipPath = 'inset(0 0 0 0)';
                if (config.once) observer.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}


