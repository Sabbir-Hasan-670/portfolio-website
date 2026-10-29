const fs = require('fs');

let code = fs.readFileSync('public/home-v5.js', 'utf8');

const oldLoop = `        animId = requestAnimationFrame(render);
    };

    const obs = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !animId) {
            animId = requestAnimationFrame(render);
        }
    }, { threshold: 0.05 });`;

const newLoop = `        if (inView) {
            animId = requestAnimationFrame(render);
        } else {
            animId = null;
        }
    };

    const obs = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !animId) {
            animId = requestAnimationFrame(render);
        } else if (!inView && animId) {
            cancelAnimationFrame(animId);
            animId = null;
        }
    }, { threshold: 0.05 });`;

if (code.includes('animId = requestAnimationFrame(render);')) {
    code = code.replace(oldLoop, newLoop);
    fs.writeFileSync('public/home-v5.js', code, 'utf8');
    console.log('✅ public/home-v5.js patched');
} else {
    console.log('Target not found in home-v5.js');
}

