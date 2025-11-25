// 1. FIN DU CHARGEMENT KI
setTimeout(() => {
    document.getElementById("loader").style.opacity = "0";

    setTimeout(() => {
        document.getElementById("loader").style.display = "none";
        launchGoku();
    }, 900);
}, 2500);

// 2. LANCER ANIMATION GOKU
function launchGoku() {
    const gokuScreen = document.getElementById("goku-transition");
    gokuScreen.style.opacity = "1";

    setTimeout(() => {
        const goku = document.getElementById("goku");
        goku.style.bottom = "1000px"; // Monter vers le ciel

        setTimeout(() => {
            endTransition();
        }, 2000);

    }, 200);
}

// 3. AFFICHER PAGE DES TP
function endTransition() {
    const gokuScreen = document.getElementById("goku-transition");
    gokuScreen.style.opacity = "0";

    setTimeout(() => {
        gokuScreen.style.display = "none";
        document.getElementById("content").style.opacity = "1";
    }, 600);
}