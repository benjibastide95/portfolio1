// Vérifier si l'intro a déjà été jouée
const alreadyPlayed = localStorage.getItem("introPlay");

// Si déjà joué → skip direct vers les TP
if (alreadyPlayed === "done") {
    document.getElementById("loader").style.display = "none";
    document.getElementById("goku-transition").style.display = "none";
    document.getElementById("content").style.opacity = "1";
} else {
    startIntro();
}

function startIntro() {
    let percent = 0;

    // 🔥 CHARGEMENT KI 0% → 100%
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

//  FIN DU CHARGEMENT KI
function finishKi() {
    document.getElementById("loader").style.opacity = "0";

    setTimeout(() => {
        document.getElementById("loader").style.display = "none";
        launchGoku();
    }, 800);
}

//  GOKU PLEINE ECRAN
function launchGoku() {
    const screen = document.getElementById("goku-transition");
    screen.style.opacity = "1";

    setTimeout(() => {
        document.getElementById("goku").style.transform =
            "translateY(-1500px)";

        setTimeout(() => {
            endTransition();
        }, 2000);

    }, 400);
}

// AFFICHAGE DE LA PAGE TP
function endTransition() {
    const screen = document.getElementById("goku-transition");
    screen.style.opacity = "0";

    setTimeout(() => {
        screen.style.display = "none";
        document.getElementById("content").style.opacity = "1";

        // Marquer que l'intro est finie
        localStorage.setItem("introPlay", "done");
    }, 600);
}
