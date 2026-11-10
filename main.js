/* ═══════════════════════════════════════════════════════════════════════════
   ⚡ PORTFOLIO FUTURISTE - JAVASCRIPT

   Ce fichier est chargé par les 6 pages principales (accueil, parcours,
   projets, missions, veille, compétences). Il gère :
     1. l'intro « boot système » (jouée une seule fois par visite) ;
     2. la recherche et les filtres de la page Projets ;
     3. les raccourcis clavier (CTRL+K, Échap) ;
     4. les effets au survol (inclinaison 3D des cartes, halo de la recherche) ;
     5. le fond d'étoiles animé dessiné dans un <canvas>.

   Chaque fonction vérifie que les éléments dont elle a besoin existent :
   c'est ce qui permet d'utiliser le même fichier sur toutes les pages,
   même celles qui n'ont ni intro ni barre de recherche.
   ═══════════════════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 CONFIGURATION
// Tous les réglages sont regroupés ici pour être modifiés sans toucher au reste.
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
    bootDuration: 1800,      // Durée totale de la barre de progression (ms)
    bootMessages: [          // Lignes affichées dans le faux terminal
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
    ],
    stars: {
        count: 150,          // Nombre d'étoiles
        minSize: 0.5,        // Rayon minimum (px)
        maxSize: 3,          // Rayon maximum (px)
        minSpeed: 0.0005,    // Vitesse de scintillement minimum
        maxSpeed: 0.002,     // Vitesse de scintillement maximum
        mouseRadius: 150,    // Rayon d'influence de la souris (px)
        pushDistance: 50     // Distance max. de déplacement d'une étoile (px)
    }
};

// L'utilisateur a-t-il demandé à son système de réduire les animations ?
// (réglage d'accessibilité de Windows / macOS / Android / iOS)
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// L'appareil a-t-il une vraie souris ? (faux sur téléphone et tablette)
const HAS_MOUSE = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 INITIALISATION
// sessionStorage garde une valeur tant que l'onglet reste ouvert : on s'en sert
// pour ne jouer l'intro qu'une fois, puis l'ignorer en changeant de page.
// ═══════════════════════════════════════════════════════════════════════════

// Empêche de brancher deux fois les mêmes écouteurs d'événements
// (skipIntro peut être appelée au chargement ET par l'événement pageshow).
let interfaceReady = false;

if (sessionStorage.getItem("introPlayed") === "yes") {
    skipIntro();
} else {
    startBoot();
}

// « pageshow » se déclenche aussi quand on revient avec le bouton Précédent :
// le navigateur ressort alors la page de son cache (bfcache) sans relancer
// le script, donc on s'assure ici que l'intro reste masquée.
window.addEventListener("pageshow", (event) => {
    if (event.persisted || sessionStorage.getItem("introPlayed") === "yes") {
        skipIntro();
    }
});

// Prépare la recherche et les raccourcis, une seule fois par page.
function initInterface() {
    if (interfaceReady) return;
    interfaceReady = true;

    initSearch();
    initKeyboardShortcuts();
}

// ═══════════════════════════════════════════════════════════════════════════
// 💻 ANIMATION BOOT SYSTÈME (page d'accueil uniquement)
// ═══════════════════════════════════════════════════════════════════════════

function startBoot() {
    const bootLines = document.getElementById("boot-lines");
    const progressFill = document.getElementById("progress-fill");
    const progressText = document.getElementById("progress-text");
    const bootStatus = document.getElementById("boot-status");

    // Pas d'écran de boot sur cette page : on affiche directement le contenu.
    if (!bootLines || !progressFill || !progressText) {
        skipIntro();
        return;
    }

    let currentLine = 0;
    let progress = 0;

    // Barre de progression : +1 % à intervalle régulier jusqu'à 100 %.
    const progressInterval = setInterval(() => {
        progress += 1;
        progressFill.style.width = progress + "%";
        progressText.textContent = progress + "%";

        if (progress >= 100) {
            clearInterval(progressInterval);
        }
    }, CONFIG.bootDuration / 100);

    // Affiche les messages un par un. La fonction se rappelle elle-même
    // avec setTimeout, ce qui crée l'effet « lignes qui défilent ».
    function showNextLine() {
        // Plus de message : le boot est terminé.
        if (currentLine >= CONFIG.bootMessages.length) {
            setTimeout(() => {
                if (bootStatus) bootStatus.textContent = "SYSTÈME PRÊT";
                setTimeout(finishBoot, 300);
            }, 200);
            return;
        }

        const message = CONFIG.bootMessages[currentLine];
        const lineElement = document.createElement("div");
        lineElement.className = `boot-line ${message.type}`;
        // textContent (et non innerHTML) : le texte n'est jamais interprété
        // comme du HTML, c'est la bonne pratique contre les injections.
        lineElement.textContent = message.text;
        bootLines.appendChild(lineElement);

        currentLine++;

        // Délai légèrement aléatoire pour un rendu plus « réel ».
        const delay = message.text === "" ? 40 : Math.random() * 80 + 60;
        setTimeout(showNextLine, delay);
    }

    setTimeout(showNextLine, 200);
}

// ═══════════════════════════════════════════════════════════════════════════
// ✅ FIN DU BOOT : fondu de l'intro puis affichage du contenu
// ═══════════════════════════════════════════════════════════════════════════

function finishBoot() {
    const intro = document.getElementById("intro");
    const content = document.getElementById("content");

    if (!intro || !content) return;

    // On mémorise que l'intro a été vue pour ne plus la rejouer.
    sessionStorage.setItem("introPlayed", "yes");

    intro.style.opacity = "0";

    // On attend la fin du fondu avant de retirer l'intro de la page.
    setTimeout(() => {
        intro.style.display = "none";
        // La classe « visible » déclenche les animations d'entrée du CSS.
        content.classList.add("visible");
        initInterface();
    }, 400);
}

// ═══════════════════════════════════════════════════════════════════════════
// ⏭️ SKIP INTRO : affichage immédiat du contenu
// ═══════════════════════════════════════════════════════════════════════════

function skipIntro() {
    // Classe posée sur <html> : le CSS masque alors l'intro sans aucun flash.
    document.documentElement.classList.add("intro-done");

    const intro = document.getElementById("intro");
    const content = document.getElementById("content");

    if (intro) {
        intro.style.display = "none";
    }

    if (content) {
        content.classList.add("visible");
    }

    initInterface();
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔍 SYSTÈME DE RECHERCHE (page Projets)
// Chaque carte porte deux attributs HTML :
//   data-name     → les mots-clés comparés au texte tapé ;
//   data-category → la catégorie comparée au filtre choisi (tp, php, certif).
// ═══════════════════════════════════════════════════════════════════════════

function initSearch() {
    const searchInput = document.getElementById("search-input");
    const projectsGrid = document.getElementById("projects-grid");
    const noResults = document.getElementById("no-results");
    const tags = document.querySelectorAll(".tag");

    if (!searchInput || !projectsGrid) return;

    const cards = projectsGrid.querySelectorAll(".project-card");
    let currentFilter = "all";

    // « input » se déclenche à chaque caractère : recherche en temps réel.
    searchInput.addEventListener("input", filterProjects);

    // Boutons de filtre (Tous, TPs, Projets PHP, Certifications).
    tags.forEach(tag => {
        tag.addEventListener("click", () => {
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
            const name = (card.dataset.name || "").toLowerCase();
            const category = card.dataset.category;

            // Une carte reste affichée si elle respecte la recherche ET le filtre.
            const matchesSearch = query === "" || name.includes(query);
            const matchesFilter = currentFilter === "all" || category === currentFilter;

            if (matchesSearch && matchesFilter) {
                // --i = rang de la carte parmi celles affichées. Le CSS s'en
                // sert pour décaler son animation d'entrée (effet cascade).
                card.style.setProperty("--i", visibleCount);
                card.classList.remove("hidden");
                visibleCount++;
            } else {
                card.classList.add("hidden");
            }
        });

        // Message « Aucun projet trouvé » si plus aucune carte n'est visible.
        if (noResults) {
            noResults.classList.toggle("visible", visibleCount === 0);
        }
    }

    // Premier passage : donne son rang (--i) à chaque carte dès l'arrivée.
    filterProjects();
}

// ═══════════════════════════════════════════════════════════════════════════
// ⌨️ RACCOURCIS CLAVIER
// ═══════════════════════════════════════════════════════════════════════════

function initKeyboardShortcuts() {
    const searchInput = document.getElementById("search-input");

    if (!searchInput) return;

    document.addEventListener("keydown", (e) => {
        // CTRL + K (ou CMD + K sur Mac) : place le curseur dans la recherche.
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault(); // bloque le raccourci par défaut du navigateur
            searchInput.focus();
        }

        // Échap : vide la recherche et réaffiche toutes les cartes.
        if (e.key === "Escape") {
            searchInput.value = "";
            searchInput.blur();
            // On déclenche « input » à la main pour relancer le filtrage.
            searchInput.dispatchEvent(new Event("input"));
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 EFFETS AU SURVOL
// Inutiles sur écran tactile, et désactivés si l'utilisateur a demandé moins
// d'animations : on ne branche alors aucun écouteur.
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
    if (!HAS_MOUSE || REDUCED_MOTION) return;

    // --- Inclinaison 3D des cartes selon la position de la souris ---
    document.querySelectorAll(".project-card").forEach(card => {
        let frame = null; // identifiant de l'image d'animation en attente

        card.addEventListener("mousemove", (e) => {
            // « mousemove » se déclenche très souvent. On ne recalcule qu'une
            // fois par image affichée (requestAnimationFrame) pour rester fluide.
            if (frame) return;

            frame = requestAnimationFrame(() => {
                frame = null;

                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;   // souris dans la carte
                const y = e.clientY - rect.top;

                // Écart par rapport au centre → angle de rotation (en degrés).
                const rotateX = (y - rect.height / 2) / 20;
                const rotateY = (rect.width / 2 - x) / 20;

                card.style.transform =
                    `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
        });

        card.addEventListener("mouseleave", () => {
            if (frame) {
                cancelAnimationFrame(frame);
                frame = null;
            }
            // On retire le style : la carte reprend sa position définie en CSS.
            card.style.transform = "";
        });
    });

    // --- Halo qui suit la souris dans la barre de recherche ---
    // Le JS transmet la position au CSS via deux variables (--mouse-x / --mouse-y).
    const searchBox = document.querySelector(".search-box");

    if (searchBox) {
        searchBox.addEventListener("mousemove", (e) => {
            const rect = searchBox.getBoundingClientRect();
            searchBox.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
            searchBox.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        });
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// ✨ ÉTOILES SCINTILLANTES
// Les étoiles sont dessinées dans un <canvas> : une « feuille de dessin » que
// l'on efface et redessine environ 60 fois par seconde.
//
// Optimisations pour que l'animation reste fluide :
//   - l'image d'une étoile (halo lumineux) est dessinée UNE seule fois dans un
//     petit canvas caché, puis simplement recopiée pour chaque étoile ;
//   - l'animation se met en pause quand l'onglet n'est plus visible ;
//   - elle ne tourne pas si l'utilisateur a demandé moins d'animations.
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("stars-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const settings = CONFIG.stars;

    let stars = [];
    let width = 0;          // Taille de la fenêtre en pixels CSS
    let height = 0;
    let animationId = null; // Identifiant de l'animation en cours (null = en pause)

    // Position de la souris (null = souris hors de la page)
    const mouse = { x: null, y: null };

    // Image d'une étoile, préparée une fois pour toutes.
    const sprite = createStarSprite();

    // Dessine un disque blanc qui s'estompe vers les bords (dégradé radial).
    function createStarSprite() {
        const size = 64;
        const spriteCanvas = document.createElement("canvas");
        spriteCanvas.width = size;
        spriteCanvas.height = size;

        const spriteCtx = spriteCanvas.getContext("2d");
        const center = size / 2;
        const gradient = spriteCtx.createRadialGradient(center, center, 0, center, center, center);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");      // cœur brillant
        gradient.addColorStop(0.22, "rgba(255, 255, 255, 0.95)");
        gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.55)"); // début du halo
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.25)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");      // bord transparent

        spriteCtx.fillStyle = gradient;
        spriteCtx.fillRect(0, 0, size, size);
        return spriteCanvas;
    }

    // Adapte le canvas à la fenêtre. Sur les écrans haute densité (téléphones,
    // écrans Retina) on multiplie la résolution pour éviter un rendu flou,
    // en la limitant à x2 pour ne pas surcharger la carte graphique.
    function resizeCanvas() {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * ratio;
        canvas.height = height * ratio;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    // Crée les étoiles : position, taille et rythme de scintillement aléatoires.
    function initStars() {
        stars = [];
        for (let i = 0; i < settings.count; i++) {
            stars.push({
                baseX: Math.random() * width,   // position de repos
                baseY: Math.random() * height,
                size: Math.random() * (settings.maxSize - settings.minSize) + settings.minSize,
                twinkleSpeed: Math.random() * (settings.maxSpeed - settings.minSpeed) + settings.minSpeed,
                twinklePhase: Math.random() * Math.PI * 2  // décalage : elles ne clignotent pas ensemble
            });
        }
    }

    function drawStar(star, time) {
        // Scintillement : un sinus oscille entre -1 et 1 au fil du temps,
        // ce qui fait varier l'opacité de l'étoile entre 0,25 et 0,55.
        const twinkle = Math.sin(time * star.twinkleSpeed * 1000 + star.twinklePhase);
        const opacity = 0.25 + (twinkle + 1) * 0.15;

        let x = star.baseX;
        let y = star.baseY;

        // Effet « vague » : les étoiles proches de la souris sont repoussées.
        if (mouse.x !== null) {
            const dx = star.baseX - mouse.x;
            const dy = star.baseY - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy); // théorème de Pythagore

            if (distance < settings.mouseRadius) {
                // Plus l'étoile est proche de la souris, plus la force est grande.
                const force = (settings.mouseRadius - distance) / settings.mouseRadius;
                const angle = Math.atan2(dy, dx); // direction opposée à la souris
                x += Math.cos(angle) * force * settings.pushDistance;
                y += Math.sin(angle) * force * settings.pushDistance;
            }
        }

        // On recopie l'image préparée, à la bonne taille et la bonne opacité.
        const radius = star.size * 4;
        ctx.globalAlpha = opacity;
        ctx.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2);
    }

    // Efface tout puis redessine chaque étoile.
    function draw(time) {
        ctx.clearRect(0, 0, width, height);
        for (const star of stars) {
            drawStar(star, time / 1000);
        }
    }

    // Boucle d'animation : requestAnimationFrame rappelle la fonction juste
    // avant chaque rafraîchissement de l'écran.
    function animate(time) {
        draw(time);
        animationId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (REDUCED_MOTION) {
            draw(0); // image fixe : les étoiles sont là mais ne bougent pas
            return;
        }
        if (animationId === null) {
            animationId = requestAnimationFrame(animate);
        }
    }

    function stopAnimation() {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    // --- Événements ---

    if (HAS_MOUSE) {
        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        // La souris quitte la fenêtre : les étoiles reprennent leur place.
        document.documentElement.addEventListener("mouseleave", () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    // Onglet masqué : inutile de dessiner, on économise processeur et batterie.
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });

    // Redimensionnement : on attend que l'utilisateur ait fini (150 ms sans
    // nouvel événement) avant de recalculer. Cette technique s'appelle le
    // « debounce ». Les étoiles ne sont replacées que si la largeur change,
    // sinon elles sauteraient sur mobile quand la barre d'adresse se replie.
    let resizeTimer = null;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const previousWidth = width;
            resizeCanvas();
            if (width !== previousWidth) {
                initStars();
            }
            if (REDUCED_MOTION) draw(0);
        }, 150);
    });

    // --- Démarrage ---
    resizeCanvas();
    initStars();
    startAnimation();
});
