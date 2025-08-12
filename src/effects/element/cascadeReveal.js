/**
 * applyCascadeReveal - Reveals children of a container in a cascading sequence.
 *
 * @param {object} [options={}]
 * @param {string} [options.selector='.cascade'] - Container selector.
 * @param {string} [options.childSelector='.cascade-item'] - Children to animate.
 * @param {number} [options.duration=600]
 * @param {number} [options.stagger=100]
 * @param {string} [options.easing='ease-out']
 * @param {boolean} [options.once=true]
 */
export function applyCascadeReveal(options = {}) {
    const defaults = {
        selector: '.cascade',
        childSelector: '.cascade-item',
        duration: 600,
        stagger: 100,
        easing: 'ease-out',
        once: true
    };
    const config = { ...defaults, ...options };

    const containers = document.querySelectorAll(config.selector);
    if (!containers.length) {
        console.warn(`applyCascadeReveal: No containers found with selector: "${config.selector}"`);
        return;
    }

    containers.forEach(container => {
        const children = container.querySelectorAll(config.childSelector);
        if (!children.length) return;

        children.forEach(child => {
            child.style.opacity = 0;
            child.style.transform = 'translateY(12px)';
            child.style.transition = `opacity ${config.duration}ms ${config.easing}, transform ${config.duration}ms ${config.easing}`;
            child.style.willChange = 'opacity, transform';
        });

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = 1;
                            child.style.transform = 'translateY(0)';
                        }, index * config.stagger);
                    });

                    if (config.once) observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(container);
    });
}


