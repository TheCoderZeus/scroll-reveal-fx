/**
 * Applies a parallax effect to elements based on scroll position.
 *
 * @param {object} [options={}] - The configuration options.
 * @param {string} [options.selector] - The CSS selector for elements to apply the effect to.
 * @param {number} [options.intensity=0.2] - The strength of the parallax effect. 
 *        A positive value moves the element up as you scroll down (appears slower).
 *        A negative value moves it down (appears faster). From -1 to 1 is a reasonable range.
 * @param {number} [options.threshold=0] - A threshold to start the effect only when the element is near or in the viewport.
 */
export function applyParallax(options = {}) {
    const defaults = {
        selector: '.parallax',
        intensity: 0.2,
        threshold: 100,
    };
    const config = { ...defaults, ...options };

    const elements = document.querySelectorAll(config.selector);

    if (elements.length === 0) {
        console.warn(`Parallax: No elements found with selector: "${config.selector}"`);
        return;
    }

    const updateParallax = () => {
        const viewportHeight = window.innerHeight;

        elements.forEach(el => {
            const rect = el.getBoundingClientRect();

            if (rect.bottom >= -config.threshold && rect.top <= viewportHeight + config.threshold) {
                const elementCenterY = rect.top + rect.height / 2;
                const viewportCenterY = viewportHeight / 2;
                
                const distance = elementCenterY - viewportCenterY;

                const parallaxOffset = distance * config.intensity * -1;
                
                el.style.transform = `translateY(${parallaxOffset}px)`;
                el.style.willChange = 'transform';
            }
        });
    };

    updateParallax();
    
    window.addEventListener('scroll', updateParallax, { passive: true });
}


