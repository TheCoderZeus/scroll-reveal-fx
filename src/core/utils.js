export function getAnimation(effect, direction) {
    const animations = {
        fade: {
            initial: { opacity: 0 },
            target: { opacity: 1 }
        },
        slide: {
            initial: { opacity: 0, transform: `translateY(${direction === 'up' ? '20px' : direction === 'down' ? '-20px' : '0'}) translateX(${direction === 'left' ? '20px' : direction === 'right' ? '-20px' : '0'})` },
            target: { opacity: 1, transform: 'translate(0, 0)' }
        },
        scale: {
            initial: { opacity: 0, transform: 'scale(0.9)' },
            target: { opacity: 1, transform: 'scale(1)' }
        },
        blur: {
            initial: { opacity: 0, filter: 'blur(10px)' },
            target: { opacity: 1, filter: 'blur(0)' }
        },
        flip: {
            initial: { opacity: 0, transform: 'perspective(1000px) rotateY(90deg)' },
            target: { opacity: 1, transform: 'perspective(1000px) rotateY(0)' }
        },
        rotate: {
            initial: { opacity: 0, transform: 'rotate(15deg) scale(0.95)' },
            target: { opacity: 1, transform: 'rotate(0) scale(1)' }
        },
        roll: {
            initial: { opacity: 0, transform: 'rotate(270deg) scale(0.5)' },
            target: { opacity: 1, transform: 'rotate(0) scale(1)' }
        },
        flicker: {
            initial: { opacity: 0, filter: 'blur(12px) contrast(3)' },
            target: { opacity: 1, filter: 'none' }
        }
    };
    return animations[effect];
}


