// Vérifier si l'intro doit être jouée
const introPlayed = sessionStorage.getItem("introPlayed");

if (introPlayed === "yes") {
    skipIntro(); // Si déjà jouée → afficher directement le menu
} else {
    startIntro(); // Sinon → jouer l’intro complète
}


// ----------------------------------------
// 🔥 1. CHARGEMENT DU KI (0% → 100%)
// ----------------------------------------
function startIntro() {
    let percent = 0;

    let interval = setInterval(() => {
        percent++;
        document.getElementById("loader-text").textContent =
            "Chargement du Ki : " + percent + "%";

        if (percent >= 100) {
            clearInterval(interval);
            finishKi();
        }
    }, 25);
}


// ----------------------------------------
// 🔥 2. FIN DU LOADER → AFFICHER GOKU
// ----------------------------------------
function finishKi() {
    const loader = document.getElementById("loader");
    loader.style.opacity = "0";

    setTimeout(() => {
        loader.style.display = "none";
        launchGoku();
    }, 700);
}


// ----------------------------------------
// 🐉 3. GOKU QUI VOLE (propre, lent, lisible)
// ----------------------------------------
function launchGoku() {
    const gokuScreen = document.getElementById("goku-transition");
    const goku = document.getElementById("goku");

    // Affiche l’écran noir + Goku au centre
    gokuScreen.style.opacity = "1";

    // Petit délai avant le décollage
    setTimeout(() => {

        // 🔥 Animation du décollage (4s pour être bien lisible)
        goku.style.transition = "transform 4s ease-out";
        goku.style.transform = "translateY(-2000px)";

        // Quand il a fini de monter
        setTimeout(() => {
            endTransition();
        }, 4200);

    }, 500);
}


// ----------------------------------------
// 🌟 4. FIN DE TRANSITION → AFFICHER TP
// ----------------------------------------
function endTransition() {
    const gokuScreen = document.getElementById("goku-transition");
    const content = document.getElementById("content");

    gokuScreen.style.opacity = "0";

    setTimeout(() => {
        gokuScreen.style.display = "none"; // 🔥 retire Goku de l’écran
        content.style.opacity = "1";       // 🔥 affiche les TP

        // Empêcher l’intro si on revient depuis un TP
        sessionStorage.setItem("introPlayed", "yes");

    }, 700);
}


// ----------------------------------------
// 🚀 5. SI INTRO DÉJÀ JOUÉE : SKIP DIRECT
// ----------------------------------------
function skipIntro() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("goku-transition").style.display = "none";
    document.getElementById("content").style.opacity = "1";
}
