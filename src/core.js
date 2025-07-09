/**
 * Reveals elements on scroll with various effects and options.
 *
 * @param {object} [options={}] - The configuration options.
 * @param {string} [options.selector='.reveal'] - The CSS selector for elements to reveal.
 * @param {string} [options.effect='fade'] - The reveal effect. Can be 'fade', 'slide', 'scale', 'blur', 'flip', 'rotate', 'roll', 'flicker'.
 * @param {number} [options.threshold=0.25] - The percentage of the element that must be visible to trigger the animation.
 * @param {number} [options.duration=800] - The duration of the animation in milliseconds.
 * @param {number} [options.delay=0] - A base delay for the animation in milliseconds.
 * @param {string} [options.easing='cubic-bezier(0.5, 0, 0, 1)'] - A CSS easing function for the animation.
 * @param {string} [options.direction='up'] - For 'slide' effect, the direction from which the element appears. Can be 'up', 'down', 'left', 'right'.
 * @param {number} [options.scale=0.9] - For 'scale' effect, the initial scale of the element.
 * @param {number} [options.rotation=15] - For 'rotate' effect, the initial rotation in degrees.
 * @param {number} [options.stagger=150] - The delay in milliseconds between each element's animation.
 * @param {boolean} [options.once=true] - Whether the animation should only run once.
 * @param {boolean} [options.reset=false] - If 'once' is false, this determines if the element should reset to its initial state when it goes out of view.
 * @param {function(HTMLElement): void} [options.onReveal] - Callback function when an element starts to reveal.
 * @param {function(HTMLElement): void} [options.onComplete] - Callback function when an element's reveal animation is complete.
 * @param {function(HTMLElement): void} [options.onReset] - Callback function when an element is reset to its initial state.
 * @param {string | HTMLElement} [options.trigger] - An element selector or element object that triggers the animation. If not provided, the element itself is the trigger.
 */
export function revealOnScroll(options = {}) {
    const defaults = {
        selector: '.reveal',
        effect: 'fade',
        threshold: 0.25,
        duration: 800,
        delay: 0,
        easing: 'cubic-bezier(0.5, 0, 0, 1)',
        direction: 'up',
        scale: 0.9,
        rotation: 15,
        stagger: 150,
        once: true,
        reset: false,
        onReveal: null,
        onComplete: null,
        onReset: null,
        trigger: null,
    };

    const config = { ...defaults, ...options };

    const elements = document.querySelectorAll(config.selector);

    if (elements.length === 0) {
        console.warn(`ScrollRevealFX: No elements found with selector: "${config.selector}"`);
        return;
    }

    const setInitialStyles = (el) => {
        el.style.transition = 'none';
        el.style.opacity = '0';
        el.style.willChange = 'opacity, transform, filter';

        let transformValue = '';
        switch (config.effect) {
            case 'slide':
                const slideDistance = '20px';
                switch (config.direction) {
                    case 'down': transformValue = `translateY(-${slideDistance})`; break;
                    case 'left': transformValue = `translateX(${slideDistance})`; break;
                    case 'right': transformValue = `translateX(-${slideDistance})`; break;
                    default: transformValue = `translateY(${slideDistance})`; break;
                }
                break;
            case 'scale':
                transformValue = `scale(${config.scale})`;
                break;
            case 'rotate':
                transformValue = `rotate(${config.rotation}deg) scale(0.95)`;
                el.style.transformOrigin = 'center';
                break;
            case 'roll':
                transformValue = 'rotate(270deg) scale(0.5)';
                el.style.transformOrigin = 'center';
                break;
            case 'flip':
                transformValue = 'perspective(1000px) rotateY(90deg)';
                el.style.transformOrigin = 'center';
                break;
        }

        if (config.effect === 'blur') {
            el.style.filter = 'blur(10px)';
        } else if (config.effect === 'flicker') {
            el.style.filter = 'blur(12px) contrast(3)';
        }
        else {
            el.style.filter = 'none';
        }

        el.style.transform = transformValue;
        
        if (config.onReset && typeof config.onReset === 'function') {
            config.onReset(el);
        }
    };

    const applyAnimation = (el, index) => {
        const currentDelay = config.delay + (index * config.stagger);

        if (config.onReveal && typeof config.onReveal === 'function') {
            config.onReveal(el);
        }

        setTimeout(() => {
            el.style.transition = `all ${config.duration}ms ${config.easing} ${currentDelay}ms`;
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.filter = 'none';

            if (config.onComplete && typeof config.onComplete === 'function') {
                el.addEventListener('transitionend', () => config.onComplete(el), { once: true });
            }
        }, 20);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const elementsToAnimate = config.trigger ? elements : [entry.target];
            
            if (entry.isIntersecting) {
                elementsToAnimate.forEach(el => {
                    const index = parseInt(el.dataset.revealIndex, 10);
                    applyAnimation(el, index);
                });

                if (config.once) {
                    observer.unobserve(entry.target);
                }
            } else if (config.reset && !config.once) {
                elementsToAnimate.forEach(el => setInitialStyles(el));
            }
        });
    }, { threshold: config.threshold });

    if (config.trigger) {
        const triggerElement = typeof config.trigger === 'string' 
            ? document.querySelector(config.trigger) 
            : config.trigger;
            
        if (triggerElement) {
            elements.forEach((el, index) => {
                el.dataset.revealIndex = index;
                setInitialStyles(el);
            });
            observer.observe(triggerElement);
        } else {
            console.warn(`ScrollRevealFX: Trigger element "${config.trigger}" not found.`);
        }
    } else {
        elements.forEach((el, index) => {
            el.dataset.revealIndex = index;
            setInitialStyles(el);
            observer.observe(el);
        });
    }
}
  