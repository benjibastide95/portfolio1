// Fond d'étoiles scintillantes (même effet que les pages certifications)
const canvas = document.getElementById("stars-canvas");
const ctx = canvas.getContext("2d");
let stars = [];
const STAR_COUNT = 120;

let mouse = { x: null, y: null, radius: 150 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createStar() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseX: 0, baseY: 0,
        size: Math.random() * 2.5 + 0.5,
        twinkleSpeed: Math.random() * 0.0015 + 0.0005,
        twinklePhase: Math.random() * Math.PI * 2
    };
}

function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        const star = createStar();
        star.baseX = star.x;
        star.baseY = star.y;
        stars.push(star);
    }
}

function drawStar(star, time) {
    const twinkle = Math.sin(time * star.twinkleSpeed * 1000 + star.twinklePhase);
    const opacity = 0.25 + (twinkle + 1) * 0.15;

    if (mouse.x !== null && mouse.y !== null) {
        const dx = star.baseX - mouse.x;
        const dy = star.baseY - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            star.x = star.baseX + Math.cos(angle) * force * 50;
            star.y = star.baseY + Math.sin(angle) * force * 50;
        } else {
            star.x = star.baseX;
            star.y = star.baseY;
        }
    } else {
        star.x = star.baseX;
        star.y = star.baseY;
    }

    const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.3})`);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fill();
}

function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => drawStar(star, time / 1000));
    requestAnimationFrame(animate);
}

window.addEventListener("mousemove", (e) => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener("mouseout", () => { mouse.x = null; mouse.y = null; });
window.addEventListener("resize", () => { resizeCanvas(); initStars(); });

resizeCanvas();
initStars();
animate(0);
