import { revealOnScroll } from './core.js';

/**
 * Creates a timeline to orchestrate multiple animations in sequence.
 *
 * @param {object} [options={}] - Configuration for the timeline itself.
 * @param {string|HTMLElement} options.trigger - The element that triggers the entire timeline.
 * @param {boolean} [options.once=true] - If true, the timeline runs only once.
 * @param {number} [options.threshold=0.25] - The visibility threshold to trigger the timeline.
 */
export function createTimeline(options = {}) {
    const { trigger, once = true, threshold = 0.25 } = options;
    const triggerEl = typeof trigger === 'string' ? document.querySelector(trigger) : trigger;

    if (!triggerEl) {
        console.warn('Timeline: Trigger element not found.');
        return;
    }

    const animationQueue = [];
    let totalDelay = 0;
    let hasBeenTriggered = false;

    const timeline = {
        /**
         * Adds an animation step to the timeline.
         * @param {object} revealOptions - Configuration for this animation step, using revealOnScroll options.
         * @returns {timeline} - The timeline instance for chaining.
         */
        add: function(revealOptions) {
            const stepOptions = {
                ...revealOptions,
                delay: (revealOptions.delay || 0) + totalDelay
            };
            animationQueue.push(stepOptions);

            const elements = document.querySelectorAll(revealOptions.selector);
            const stagger = revealOptions.stagger || 0;
            const stepDuration = (revealOptions.duration || 800) + (elements.length > 0 ? (elements.length - 1) * stagger : 0);
            
            totalDelay += stepDuration + (revealOptions.delay || 0);

            return this;
        }
    };

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            if (hasBeenTriggered && once) return;

            hasBeenTriggered = true;
            animationQueue.forEach(opts => {
                revealOnScroll(opts);
            });

            if (once) {
                observer.unobserve(triggerEl);
            }
        }
    }, { threshold });

    observer.observe(triggerEl);

    return timeline;
}


