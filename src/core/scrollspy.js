/**
 * Creates a Scroll-Spy that adds an active class to navigation links when the corresponding section is in the viewport.
 *
 * @param {object} options - The options for the Scroll-Spy.
 * @param {string} [options.links] - A CSS selector for the navigation links. The `href` of these links must match the `id` of the sections.
 * @param {string} [options.sections] - A CSS selector for the content sections to be spied on. Each section must have an `id`.
 * @param {string} [options.activeClassName='active'] - The CSS class to apply to the active navigation link.
 * @param {string} [options.rootMargin='-50% 0px -50% 0px'] - The `rootMargin` for the IntersectionObserver. This default centers the detection area in the middle of the viewport.
 */
export function createScrollSpy(options = {}) {
    const defaults = {
        links: '.scroll-spy-link',
        sections: '.scroll-spy-section',
        activeClassName: 'active',
        rootMargin: '-50% 0px -50% 0px',
    };

    const config = { ...defaults, ...options };

    const links = document.querySelectorAll(config.links);
    const sections = document.querySelectorAll(config.sections);

    if (links.length === 0 || sections.length === 0) {
        console.warn(`ScrollRevealFX: ScrollSpy couldn't find links ("${config.links}") or sections ("${config.sections}").`);
        return;
    }

    const activateLink = (id) => {
        links.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add(config.activeClassName);
            } else {
                link.classList.remove(config.activeClassName);
            }
        });
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activateLink(entry.target.id);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, {
        rootMargin: config.rootMargin,
        threshold: 0,
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}


