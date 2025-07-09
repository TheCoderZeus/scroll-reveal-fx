import { revealOnScroll } from './core.js';

const TYPEWRITER_EFFECT = 'typewriter';

/**
 * Animate text elements on scroll.
 * Can reveal text by characters or words using various effects,
 * or use a special typewriter effect.
 *
 * @param {object} [options={}] - The configuration options, extends revealOnScroll options.
 * @param {'chars' | 'words'} [options.splitType='chars'] - How to split the text.
 * @param {boolean} [options.randomOrder=false] - If true, reveals parts in a random order (not for typewriter).
 * @param {string} [options.effect='slide'] - Animation effect. Use 'typewriter' for a special typing effect.
 * @param {number} [options.typewriterSpeed=50] - Speed in ms for the typewriter effect.
 */
export function animateText(options = {}) {
    const defaults = {
        splitType: 'chars',
        randomOrder: false,
        typewriterSpeed: 50,
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

    if (config.effect === TYPEWRITER_EFFECT) {
        elements.forEach(el => {
            if (el.dataset.typingInitialized === undefined) {
                el.dataset.originalText = el.textContent;
                el.dataset.typingInitialized = 'true';
            }
            const originalText = el.dataset.originalText;
            el.innerHTML = '';

            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    if (el.dataset.isTyping === 'true') return;
                    el.dataset.isTyping = 'true';

                    let i = 0;
                    el.innerHTML = '';

                    const type = () => {
                        if (i < originalText.length) {
                            el.innerHTML += originalText.charAt(i);
                            i++;
                            setTimeout(type, config.typewriterSpeed);
                        } else {
                            delete el.dataset.isTyping;
                            if (!config.once) {
                                el.dataset.canReset = 'true';
                            }
                        }
                    };
                    type();

                    if (config.once) {
                        observer.unobserve(el);
                    }
                } else {
                    if (!config.once && el.dataset.canReset === 'true') {
                        el.innerHTML = '';
                        delete el.dataset.isTyping;
                    }
                }
            }, { threshold: config.threshold || 0.75 });
            observer.observe(el);
        });
        return;
    }

    elements.forEach(el => {
        const originalText = el.textContent;
        const splitRegex = config.splitType === 'words' ? /(\s+)/ : '';
        const parts = originalText.split(splitRegex);

        el.innerHTML = '';
        el.style.opacity = 1;

        let partSpans = [];
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
                    span.classList.add('reveal-text-part');
                    partSpans.push(span);
                    tempContainer.appendChild(span);
                });
            }
        });
        el.appendChild(tempContainer);

        if (config.randomOrder) {
            partSpans.sort(() => Math.random() - 0.5);
        }
        
        partSpans.forEach((span, index) => {
            span.dataset.revealIndex = index;
        });
    });

    const revealConfig = {
        ...config,
        selector: `${config.selector} .reveal-text-part`
    };

    revealOnScroll(revealConfig);
} 