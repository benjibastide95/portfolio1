// ═══════════════════════════════════════════════════════════════════════════
// Apparition des blocs au défilement (« scroll reveal »).
//
// Les blocs situés plus bas que l'écran sont d'abord invisibles. Quand on
// descend et qu'un bloc entre dans l'écran, il apparaît en douceur.
//
// Principe :
//   1. au chargement, on cache les blocs placés sous l'écran (classe "reveal") ;
//   2. un IntersectionObserver prévient quand un bloc devient visible ;
//   3. on ajoute alors la classe "reveal-visible", et c'est le CSS qui fait
//      l'animation (voir .reveal dans style.css et tp-php/projet.css).
//
// Ce fichier est commun aux pages principales et aux pages projets.
// ═══════════════════════════════════════════════════════════════════════════

// Blocs concernés : sections des pages principales et cartes des pages projets.
const revealBlocks = document.querySelectorAll(".page-section, .info-card");

// Réglage d'accessibilité du système : « réduire les animations ».
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// On n'anime que si le navigateur connaît IntersectionObserver et que
// l'utilisateur n'a pas demandé moins d'animations. Sinon tout reste visible.
if ("IntersectionObserver" in window && !reduceMotion) {

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            // isIntersecting vaut true quand le bloc est entré dans l'écran.
            if (!entry.isIntersecting) return;

            const block = entry.target;
            block.classList.add("reveal-visible");

            // Une fois l'animation finie, on retire les deux classes : le bloc
            // retrouve son style normal (et ses effets au survol).
            block.addEventListener("transitionend", () => {
                block.classList.remove("reveal", "reveal-visible");
            }, { once: true });

            // Le bloc est apparu : inutile de continuer à le surveiller.
            observer.unobserve(block);
        });
    }, {
        threshold: 0.1 // se déclenche quand 10 % du bloc est visible
    });

    revealBlocks.forEach((block) => {
        // getBoundingClientRect().top = distance entre le haut du bloc et le
        // haut de l'écran. Si elle dépasse la hauteur de l'écran, le bloc est
        // plus bas : on le cache et on le surveille. Les blocs déjà visibles
        // à l'ouverture de la page ne sont pas touchés.
        if (block.getBoundingClientRect().top > window.innerHeight) {
            block.classList.add("reveal");
            observer.observe(block);
        }
    });
}
