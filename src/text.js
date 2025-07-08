import { revealOnScroll } from './core.js';

/**
 * Animate text elements (chars, words) on scroll.
 * This function wraps each character or word in a <span> and then uses
 * the core revealOnScroll function to animate them with a stagger effect.
 *
 * @param {object} [options={}] - The configuration options, extends revealOnScroll options.
 * @param {'chars' | 'words'} [options.splitType='chars'] - How to split the text for animation.
 */
export function animateText(options = {}) {
    const defaults = {
        splitType: 'chars',
        effect: 'slide',
        direction: 'up',
        duration: 400,
        stagger: 30,
        once: true
    };
    
    const config = { ...defaults, ...options };

    const elements = document.querySelectorAll(config.selector);

    if (elements.length === 0) {
        console.warn(`AnimateText: No elements found with selector: "${config.selector}"`);
        return;
    }

    elements.forEach(el => {
        const originalText = el.textContent;
        const splitRegex = config.splitType === 'words' ? /(\s+)/ : '';
        const parts = originalText.split(splitRegex);

        el.innerHTML = '';
        el.style.opacity = 1;

        let spanIndex = 0;
        const tempContainer = document.createDocumentFragment();

        parts.forEach(part => {
            if (part.trim() === '') {
                tempContainer.appendChild(document.createTextNode(part));
            } else {
                const chunks = config.splitType === 'chars' ? part.split('') : [part];
                chunks.forEach(chunk => {
                    const span = document.createElement('span');
                    span.textContent = chunk;
                    span.style.display = 'inline-block';
                    span.style.willChange = 'opacity, transform, filter';
                    span.dataset.revealIndex = spanIndex++;
                    span.classList.add('reveal-text-part');
                    tempContainer.appendChild(span);
                });
            }
        });
        el.appendChild(tempContainer);
    });

    const revealConfig = {
        ...config,
        selector: `${config.selector} .reveal-text-part`
    };

    revealOnScroll(revealConfig);
} 