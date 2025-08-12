/**
 * @param {object} [options={}] - The configuration options.
 * @param {string} [options.selector] - The CSS selector for elements to apply the effect to.
 * @param {number} [options.intensity=10] - The max rotation in degrees.
 * @param {number} [options.perspective=1000] - The perspective value for the 3D effect.
 * @param {number} [options.speed=400] - The transition speed in ms when entering/leaving.
 * @param {string} [options.easing='cubic-bezier(0.03, 0.98, 0.52, 0.99)'] - Easing for the transition.
 */
export function applyTilt(options = {}) {
    const defaults = {
        selector: '.tilt',
        intensity: 10,
        perspective: 1000,
        speed: 400,
        easing: 'cubic-bezier(0.03, 0.98, 0.52, 0.99)',
    };
    const config = { ...defaults, ...options };

    const elements = document.querySelectorAll(config.selector);

    if (elements.length === 0) {
        console.warn(`Tilt: No elements found with selector: "${config.selector}"`);
        return;
    }

    elements.forEach(el => {
        if (el.parentElement) {
            el.parentElement.style.perspective = `${config.perspective}px`;
        }

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -config.intensity;
            const rotateY = ((x - centerX) / centerX) * config.intensity;

            el.style.transition = `transform 50ms linear`;
            el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transition = `transform ${config.speed}ms ${config.easing}`;
            el.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    });
}

export function applyMagnetism(options) {
    const defaults = {
        selector: '.magnetic',
        intensity: 0.2,
        threshold: 100,
        easing: 'cubic-bezier(0.03, 0.98, 0.52, 0.99)',
        scale: 1.1
    };
    const config = { ...defaults, ...options };

    const elements = document.querySelectorAll(config.selector);

    elements.forEach(element => {
        let animationFrameId = null;

        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = mouseX - centerX;
            const deltaY = mouseY - centerY;

            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance < config.threshold) {
                const targetX = deltaX * config.intensity;
                const targetY = deltaY * config.intensity;
                
                cancelAnimationFrame(animationFrameId);
                animationFrameId = requestAnimationFrame(() => {
                    element.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) scale(${config.scale})`;
                    element.style.transition = `transform 0.2s ${config.easing}`;
                });
            } else {
                resetTransform();
            }
        });

        const resetTransform = () => {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                element.style.transform = 'translate3d(0, 0, 0) scale(1)';
                element.style.transition = `transform 0.5s ${config.easing}`;
            });
        };

        element.addEventListener('mouseleave', resetTransform);
    });
}


