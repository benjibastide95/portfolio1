// Vérifier si l'intro a déjà tourné dans cette session (retour arrière)
const introPlayed = sessionStorage.getItem("introPlayed");

if (introPlayed === "yes") {
    skipIntro();
} else {
    startIntro();
}


// 🔥 1. CHARGEMENT KI 0% → 100%
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


// 🔥 2. FIN DU KI → LANCER GOKU
// 
function finishKi() {
    const loader = document.getElementById("loader");
    loader.style.opacity = "0";

    setTimeout(() => {
        loader.style.display = "none";
        launchGoku();
    }, 700);
}
// 🔥 3. TRANSITION GOKU + SLOW MOTION
function launchGoku() {
    const gokuScreen = document.getElementById("goku-transition");
    const goku = document.getElementById("goku");

    // Affichage de l'écran Goku
    gokuScreen.style.opacity = "1";

    // Petit délai avant décollage
    setTimeout(() => {

        // 🔥 Voici la modification demandée :
        // Animation PLUS LENTE pour que Goku ait le temps de voler
        goku.style.transition = "transform 4s ease-out";
        goku.style.transform = "translateY(-2000px)";

        // Quand il a fini de voler
        setTimeout(() => {
            endTransition();
        }, 4200);

    }, 500);
}


// 🚀 4. FIN DE TRANSITION → AFFICHER TP
function endTransition() {
    const gokuScreen = document.getElementById("goku-transition");
    const content = document.getElementById("content");

    gokuScreen.style.opacity = "0";

    setTimeout(() => {

        // 🔥 Correction écran coupé en deux :
        gokuScreen.style.display = "none";

        // On affiche les TP
        content.style.opacity = "1";

        // Éviter intro au retour arrière
        sessionStorage.setItem("introPlayed", "yes");

    }, 700);
}

// 🚀 5. SI INTRO DÉJÀ JOUÉE : SKIP DIRECT
function skipIntro() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("goku-transition").style.display = "none";
    document.getElementById("content").style.opacity = "1";
}
