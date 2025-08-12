import { getAnimation } from './utils.js';

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
 * @param {string} [options.customClassName] - A custom CSS class to apply when the effect is 'custom'.
 */
export function revealOnScroll(options = {}) {
    const defaults = {
        selector: '.reveal',
        effect: 'fade',
        direction: 'up',
        threshold: 0.25,
        duration: 800,
        delay: 0,
        stagger: 150,
        easing: 'cubic-bezier(0.5, 0, 0, 1)',
        once: true,
        reset: false,
        onReveal: null,
        onComplete: null,
        onReset: null,
        trigger: null,
        customClassName: 'is-visible',
    };

    const config = { ...defaults, ...options };

    const elements = document.querySelectorAll(config.selector);

    const reveal = (el, index) => {
        if (el.isRevealed) return;
        el.isRevealed = true;

        if (config.effect === 'custom') {
            el.classList.add(config.customClassName);
        } else {
            const animation = getAnimation(config.effect, config.direction);
            if (!animation) return;
            const { initial, target } = animation;
            Object.assign(el.style, {
                transition: `all ${config.duration}ms ${config.easing} ${config.delay + index * config.stagger}ms`,
                ...initial
            });
            requestAnimationFrame(() => { Object.assign(el.style, target); });
        }
        
        if (config.onReveal) config.onReveal(el);
        el.addEventListener('transitionend', () => { if (config.onComplete) config.onComplete(el); }, { once: true });
    };

    const hide = (el) => {
        if (!el.isRevealed) return;
        el.isRevealed = false;

        if (config.effect === 'custom') {
            el.classList.remove(config.customClassName);
        } else {
            const animation = getAnimation(config.effect, config.direction);
            if (animation) {
                Object.assign(el.style, {
                    transition: 'none',
                    ...animation.initial
                });
            }
        }
        
        if (config.onReset) config.onReset(el);
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            const el = entry.target;
            if (entry.isIntersecting) {
                reveal(el, index);
                if (config.once) {
                    observer.unobserve(el);
                }
            } else if (config.reset) {
                hide(el);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, {
        root: null,
        rootMargin: '0px',
        threshold: config.threshold,
    });

    elements.forEach(el => {
        const triggerElement = config.trigger ? document.querySelector(config.trigger) || el : el;
        
        if (config.effect !== 'custom') {
            const animation = getAnimation(config.effect, config.direction);
            if (animation) {
                Object.assign(el.style, animation.initial);
            }
        }
        
        observer.observe(triggerElement);
    });
}


