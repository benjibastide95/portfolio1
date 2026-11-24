// ═══════════════════════════════════════════════════════════════════════════
// Mode sombre / mode clair.
//
// Principe :
//   1. le thème choisi est écrit sur la balise <html> : data-theme="dark"
//      ou data-theme="light" ;
//   2. le CSS change les couleurs quand data-theme vaut "light"
//      (voir « MODE CLAIR » dans style.css et tp-php/projet.css) ;
//   3. le choix est gardé dans localStorage, la mémoire du navigateur :
//      il est conservé d'une page à l'autre et même après fermeture.
//
// Ce fichier est chargé dans le <head>, donc AVANT l'affichage de la page :
// le bon thème est posé tout de suite, sans « flash » de l'autre thème.
// ═══════════════════════════════════════════════════════════════════════════

// Nom sous lequel le choix est enregistré dans localStorage.
const THEME_KEY = "theme";

// Lit le thème enregistré. Par défaut (première visite) : sombre.
function getSavedTheme() {
    try {
        return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
    } catch (error) {
        // localStorage peut être bloqué (navigation privée) : on reste en sombre.
        return "dark";
    }
}

// Applique un thème : document.documentElement, c'est la balise <html>.
function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
}

// Appliqué immédiatement, avant que la page ne s'affiche.
applyTheme(getSavedTheme());

// Le bouton, lui, ne peut être créé qu'une fois le HTML chargé
// (avant, la balise <body> n'existe pas encore).
document.addEventListener("DOMContentLoaded", () => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";

    // Met à jour le symbole et le texte lu par les lecteurs d'écran.
    function updateButton() {
        const isLight = document.documentElement.dataset.theme === "light";
        button.textContent = isLight ? "☾" : "☀"; // lune : repasser en sombre
        button.setAttribute("aria-label", isLight ? "Passer en mode sombre" : "Passer en mode clair");
        button.title = button.getAttribute("aria-label");
    }

    // Au clic : on passe à l'autre thème et on enregistre le choix.
    button.addEventListener("click", () => {
        const newTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
        applyTheme(newTheme);
        try {
            localStorage.setItem(THEME_KEY, newTheme);
        } catch (error) {
            // Enregistrement impossible : le thème change quand même sur cette page.
        }
        updateButton();
    });

    updateButton();
    document.body.appendChild(button);
});
