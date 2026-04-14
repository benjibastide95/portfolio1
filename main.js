/* ═══════════════════════════════════════════════════════════════════════════
   ⚡ PORTFOLIO FUTURISTE - JAVASCRIPT
   ═══════════════════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
    bootDuration: 1800,      // Durée totale du boot (ms)
    typingSpeed: 15,         // Vitesse de frappe (ms)
    bootMessages: [
        { text: "NEXUS PORTFOLIO SYSTEM v4.2.1", type: "normal" },
        { text: "Initialisation du noyau...", type: "normal" },
        { text: "[OK] Noyau chargé", type: "success" },
        { text: "Chargement des modules graphiques...", type: "normal" },
        { text: "[OK] GPU détecté: QUANTUM-X9000", type: "success" },
        { text: "Connexion au serveur neural...", type: "normal" },
        { text: "[OK] Connexion établie (latence: 0.3ms)", type: "success" },
        { text: "Vérification des certificats...", type: "normal" },
        { text: "[OK] Authentification validée", type: "success" },
        { text: "Chargement de l'interface holographique...", type: "normal" },
        { text: "[OK] Interface prête", type: "success" },
        { text: "", type: "normal" },
        { text: ">>> BIENVENUE, UTILISATEUR <<<", type: "warning" },
    ]
};

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 INITIALISATION
// ═══════════════════════════════════════════════════════════════════════════

// Gestion du bfcache (retour arrière)
window.addEventListener("pageshow", function(event) {
    if (event.persisted || sessionStorage.getItem("introPlayed") === "yes") {
        skipIntro();
    }
});

// Vérifier si l'intro a déjà été jouée
const introPlayed = sessionStorage.getItem("introPlayed");

if (introPlayed === "yes") {
    skipIntro();
} else {
    startBoot();
}

// ═══════════════════════════════════════════════════════════════════════════
// 💻 ANIMATION BOOT SYSTÈME
// ═══════════════════════════════════════════════════════════════════════════

function startBoot() {
    // Vérification supplémentaire
    if (sessionStorage.getItem("introPlayed") === "yes") {
        skipIntro();
        return;
    }

    const bootLines = document.getElementById("boot-lines");
    const progressFill = document.getElementById("progress-fill");
    const progressText = document.getElementById("progress-text");
    const bootStatus = document.getElementById("boot-status");

    if (!bootLines || !progressFill || !progressText) {
        skipIntro();
        return;
    }

    let currentLine = 0;
    let progress = 0;

    // Animation de la barre de progression
    const progressInterval = setInterval(() => {
        progress += 1;
        progressFill.style.width = progress + "%";
        progressText.textContent = progress + "%";

        if (progress >= 100) {
            clearInterval(progressInterval);
        }
    }, CONFIG.bootDuration / 100);

    // Affichage des lignes du terminal
    function showNextLine() {
        if (currentLine >= CONFIG.bootMessages.length) {
            // Boot terminé
            setTimeout(() => {
                bootStatus.textContent = "SYSTÈME PRÊT";
                setTimeout(finishBoot, 300);
            }, 200);
            return;
        }

        const message = CONFIG.bootMessages[currentLine];
        const lineElement = document.createElement("div");
        lineElement.className = `boot-line ${message.type}`;
        lineElement.textContent = message.text;
        bootLines.appendChild(lineElement);

        // Scroll vers le bas
        bootLines.scrollTop = bootLines.scrollHeight;

        currentLine++;

        // Délai variable entre les lignes
        const delay = message.text === "" ? 40 : Math.random() * 80 + 60;
        setTimeout(showNextLine, delay);
    }

    // Démarrer l'animation après un court délai
    setTimeout(showNextLine, 200);
}

// ═══════════════════════════════════════════════════════════════════════════
// ✅ FIN DU BOOT
// ═══════════════════════════════════════════════════════════════════════════

function finishBoot() {
    const intro = document.getElementById("intro");
    const content = document.getElementById("content");

    if (!intro || !content) return;

    // Marquer l'intro comme jouée
    sessionStorage.setItem("introPlayed", "yes");

    // Fade out de l'intro
    intro.style.opacity = "0";

    setTimeout(() => {
        intro.style.display = "none";
        content.classList.add("visible");

        // Initialiser la recherche après l'affichage
        initSearch();
        initKeyboardShortcuts();
    }, 400);
}

// ═══════════════════════════════════════════════════════════════════════════
// ⏭️ SKIP INTRO
// ═══════════════════════════════════════════════════════════════════════════

function skipIntro() {
    // Ajouter la classe sur HTML
    document.documentElement.classList.add("intro-done");

    const intro = document.getElementById("intro");
    const content = document.getElementById("content");

    if (intro) {
        intro.style.display = "none";
        intro.style.visibility = "hidden";
        intro.style.opacity = "0";
    }

    if (content) {
        content.style.opacity = "1";
        content.style.visibility = "visible";
        content.classList.add("visible");
    }

    // Initialiser la recherche
    setTimeout(() => {
        initSearch();
        initKeyboardShortcuts();
    }, 100);
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔍 SYSTÈME DE RECHERCHE
// ═══════════════════════════════════════════════════════════════════════════

function initSearch() {
    const searchInput = document.getElementById("search-input");
    const projectsGrid = document.getElementById("projects-grid");
    const noResults = document.getElementById("no-results");
    const tags = document.querySelectorAll(".tag");

    if (!searchInput || !projectsGrid) return;

    const cards = projectsGrid.querySelectorAll(".project-card");
    let currentFilter = "all";

    // Recherche en temps réel
    searchInput.addEventListener("input", () => {
        filterProjects();
    });

    // Filtres par tags
    tags.forEach(tag => {
        tag.addEventListener("click", () => {
            // Mettre à jour le tag actif
            tags.forEach(t => t.classList.remove("active"));
            tag.classList.add("active");
            
            currentFilter = tag.dataset.filter;
            filterProjects();
        });
    });

    function filterProjects() {
        const query = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        cards.forEach(card => {
            const name = card.dataset.name.toLowerCase();
            const category = card.dataset.category;

            // Vérifier si la carte correspond à la recherche ET au filtre
            const matchesSearch = query === "" || name.includes(query);
            const matchesFilter = currentFilter === "all" || category === currentFilter;

            if (matchesSearch && matchesFilter) {
                card.classList.remove("hidden");
                visibleCount++;
            } else {
                card.classList.add("hidden");
            }
        });

        // Afficher/masquer le message "aucun résultat"
        if (noResults) {
            if (visibleCount === 0) {
                noResults.classList.add("visible");
            } else {
                noResults.classList.remove("visible");
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ⌨️ RACCOURCIS CLAVIER
// ═══════════════════════════════════════════════════════════════════════════

function initKeyboardShortcuts() {
    const searchInput = document.getElementById("search-input");

    if (!searchInput) return;

    document.addEventListener("keydown", (e) => {
        // CTRL + K pour focus sur la recherche
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
            e.preventDefault();
            searchInput.focus();
        }

        // Escape pour vider la recherche
        if (e.key === "Escape") {
            searchInput.value = "";
            searchInput.blur();
            // Déclencher l'événement input pour mettre à jour les filtres
            searchInput.dispatchEvent(new Event("input"));
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 EFFETS VISUELS SUPPLÉMENTAIRES
// ═══════════════════════════════════════════════════════════════════════════

// Effet parallaxe sur les cartes au mouvement de la souris
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".project-card");

    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// 🌟 EFFET GLOW SUIVANT LA SOURIS
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.querySelector(".search-box");

    if (searchBox) {
        searchBox.addEventListener("mousemove", (e) => {
            const rect = searchBox.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            searchBox.style.setProperty("--mouse-x", `${x}px`);
            searchBox.style.setProperty("--mouse-y", `${y}px`);
        });
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// ✨ ÉTOILES SCINTILLANTES AVEC EFFET VAGUE
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("stars-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let stars = [];
    const STAR_COUNT = 150;

    // Position de la souris
    let mouse = {
        x: null,
        y: null,
        radius: 150 // Rayon d'influence de la souris
    };

    // Configuration des étoiles
    const STAR_CONFIG = {
        minSize: 0.5,
        maxSize: 3,
        minSpeed: 0.0005,
        maxSpeed: 0.002
    };

    // Redimensionner le canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Créer une étoile
    function createStar() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            baseX: 0,
            baseY: 0,
            size: Math.random() * (STAR_CONFIG.maxSize - STAR_CONFIG.minSize) + STAR_CONFIG.minSize,
            twinkleSpeed: Math.random() * (STAR_CONFIG.maxSpeed - STAR_CONFIG.minSpeed) + STAR_CONFIG.minSpeed,
            twinklePhase: Math.random() * Math.PI * 2,
            vx: 0,
            vy: 0
        };
    }

    // Initialiser les étoiles
    function initStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            const star = createStar();
            star.baseX = star.x;
            star.baseY = star.y;
            stars.push(star);
        }
    }

    // Dessiner une étoile avec effet de brillance
    function drawStar(star, time) {
        // Calcul de l'opacité avec scintillement (plus subtil)
        const twinkle = Math.sin(time * star.twinkleSpeed * 1000 + star.twinklePhase);
        const opacity = 0.25 + (twinkle + 1) * 0.15;

        // Effet vague : réaction à la souris
        if (mouse.x !== null && mouse.y !== null) {
            const dx = star.baseX - mouse.x;
            const dy = star.baseY - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                // Force de répulsion (plus forte quand proche)
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);

                // Déplacer l'étoile instantanément
                star.x = star.baseX + Math.cos(angle) * force * 50;
                star.y = star.baseY + Math.sin(angle) * force * 50;
            } else {
                // Retour instantané à la position de base
                star.x = star.baseX;
                star.y = star.baseY;
            }
        } else {
            // Retour instantané à la position de base
            star.x = star.baseX;
            star.y = star.baseY;
        }

        // Dessiner le halo lumineux
        const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 4
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.3})`);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Dessiner le cœur de l'étoile
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();

        // Effet de croix scintillante pour les grosses étoiles
        if (star.size > 2 && opacity > 0.6) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(star.x - star.size * 3, star.y);
            ctx.lineTo(star.x + star.size * 3, star.y);
            ctx.moveTo(star.x, star.y - star.size * 3);
            ctx.lineTo(star.x, star.y + star.size * 3);
            ctx.stroke();
        }
    }

    // Animation principale
    function animate(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            drawStar(star, time / 1000);
        });

        requestAnimationFrame(animate);
    }

    // Événements souris
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener("mouseout", () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Initialisation
    resizeCanvas();
    initStars();
    animate(0);

    // Redimensionnement de la fenêtre
    window.addEventListener("resize", () => {
        resizeCanvas();
        initStars();
    });
});
