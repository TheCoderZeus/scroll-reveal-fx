/**
 * Animates SVG paths to look like they are being drawn on scroll.
 * It works by manipulating the 'stroke-dasharray' and 'stroke-dashoffset' CSS properties.
 *
 * @param {object} [options={}] - The configuration options, extends revealOnScroll options.
 * @param {string} [options.selector] - The CSS selector for the SVG elements.
 */
export function drawSVG(options = {}) {
    const defaults = {
        duration: 2000,
        stagger: 200,
        easing: 'ease-out',
        once: true
    };
    const config = { ...defaults, ...options };

    const svgs = document.querySelectorAll(config.selector);

    if (svgs.length === 0) {
        console.warn(`DrawSVG: No elements found with selector: "${config.selector}"`);
        return;
    }

    svgs.forEach((svg, svgIndex) => {
        const paths = svg.querySelectorAll('path');
        if (paths.length === 0) {
            console.warn(`DrawSVG: No <path> elements found in SVG with selector: "${config.selector}"[${svgIndex}]`);
            return;
        }

        const uniqueClass = `reveal-svg-path-${svgIndex}`;
        let pathIndex = 0;

        paths.forEach(path => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.willChange = 'stroke-dashoffset';
            path.dataset.revealIndex = pathIndex++;
            path.classList.add(uniqueClass);
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetSvg = entry.target;
                    const targetPaths = targetSvg.querySelectorAll(`.${uniqueClass}`);
                    
                    targetPaths.forEach((p, index) => {
                        const currentDelay = (config.delay || 0) + (index * config.stagger);
                        p.style.transition = `stroke-dashoffset ${config.duration}ms ${config.easing} ${currentDelay}ms`;
                        p.style.strokeDashoffset = '0';
                    });

                    if (config.once) {
                        observer.unobserve(targetSvg);
                    }
                } else if (config.reset && !config.once) {
                    const targetPaths = entry.target.querySelectorAll(`.${uniqueClass}`);
                    targetPaths.forEach(p => {
                        p.style.transition = 'none';
                        p.style.strokeDashoffset = p.getTotalLength();
                    });
                }
            });
        }, { threshold: config.threshold || 0.5 });
        
        observer.observe(svg);
    });
}


