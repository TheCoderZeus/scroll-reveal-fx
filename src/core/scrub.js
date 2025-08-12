/**
 * Links an animation's progress directly to the scroll position.
 * As the user scrolls through a trigger element, the target element's properties are interpolated.
 *
 * @param {object} [options={}] - The configuration options.
 * @param {string|HTMLElement} options.trigger - The element that acts as the scroll track.
 * @param {string|HTMLElement} options.target - The element(s) to be animated.
 * @param {object} options.from - The initial CSS properties.
 * @param {object} options.to - The final CSS properties.
 * @param {number} [options.startOffset=0] - Pixel offset from the top of the trigger to start the animation.
 * @param {number} [options.endOffset=0] - Pixel offset from the bottom of the trigger to end the animation.
 * @param {boolean} [options.clamp=true] - If true, the progress value will be clamped between 0 and 1.
 */
export function scrubAnimation(options = {}) {
    const {
        trigger,
        target,
        from,
        to,
        startOffset = 0,
        endOffset = 0,
        clamp = true,
    } = options;

    const triggerEl = typeof trigger === 'string' ? document.querySelector(trigger) : trigger;
    const targetEls = typeof target === 'string' ? document.querySelectorAll(target) : (target instanceof HTMLElement ? [target] : target);

    if (!triggerEl || !targetEls || targetEls.length === 0) {
        console.warn('ScrubAnimation: Trigger or target element not found.');
        return;
    }

    const fromProps = Object.keys(from);
    const toProps = Object.keys(to);

    const updateAnimation = () => {
        const rect = triggerEl.getBoundingClientRect();
        const triggerTop = rect.top + window.scrollY;
        const triggerHeight = triggerEl.offsetHeight;
        const viewportHeight = window.innerHeight;

        const start = triggerTop + startOffset;
        const end = triggerTop + triggerHeight - viewportHeight + endOffset;
        
        let progress = (window.scrollY - start) / (end - start);
        
        if (clamp) {
            progress = Math.max(0, Math.min(1, progress));
        }
        
        if (progress === -Infinity || progress === Infinity || isNaN(progress)) {
            progress = window.scrollY < start ? 0 : 1;
        }

        targetEls.forEach(targetEl => {
            let transformValue = '';
            const propsToApply = new Set([...fromProps, ...toProps]);

            propsToApply.forEach(prop => {
                const fromValue = from[prop];
                const toValue = to[prop];

                const currentValue = fromValue + (toValue - fromValue) * progress;

                if (['translateX', 'translateY', 'translateZ', 'scale', 'rotate', 'rotateX', 'rotateY', 'rotateZ'].includes(prop)) {
                    const unit = prop.includes('translate') ? 'px' : (prop.includes('rotate') ? 'deg' : '');
                    if (prop === 'scale') {
                         transformValue += `${prop}(${currentValue}) `;
                    } else {
                         transformValue += `${prop}(${currentValue}${unit}) `;
                    }
                } else if (prop === 'opacity') {
                    targetEl.style.opacity = currentValue;
                } else {
                    targetEl.style[prop] = `${currentValue}px`;
                }
            });

            if (transformValue) {
                targetEl.style.transform = transformValue;
                targetEl.style.willChange = 'transform, opacity';
            }
        });
    };
    
    window.addEventListener('scroll', updateAnimation, { passive: true });
    window.addEventListener('resize', updateAnimation, { passive: true });
    updateAnimation();
}


