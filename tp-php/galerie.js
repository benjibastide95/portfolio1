// ═══════════════════════════════════════════════════════════════════════════
// Visionneuse d'images (« lightbox ») des pages projets.
//
//   - un clic sur une capture ou un schéma l'affiche en grand ;
//   - flèche droite / flèche gauche : image suivante / précédente ;
//   - Échap, ou un clic en dehors de l'image : fermeture.
//
// Principe : on range toutes les images de la page dans un tableau, et on
// retient la position (l'index) de celle qui est affichée. Passer à la
// suivante revient à ajouter 1 à cet index, à la précédente à retirer 1.
// ═══════════════════════════════════════════════════════════════════════════

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

// Toutes les images cliquables de la page, dans l'ordre où elles apparaissent.
// Array.from transforme la liste renvoyée par querySelectorAll en vrai tableau.
const images = Array.from(document.querySelectorAll(".shot img"));

// Position, dans le tableau « images », de l'image affichée en grand.
let currentIndex = 0;

// Éléments ajoutés à la visionneuse par ce script (créés plus bas).
let counter = null;

// Affiche en grand l'image qui se trouve à la position « index ».
function showImage(index) {
    // Le modulo (%) fait boucler la galerie : après la dernière image on
    // revient à la première, et avant la première on va à la dernière.
    // On ajoute images.length pour ne jamais avoir un index négatif.
    currentIndex = (index + images.length) % images.length;

    const image = images[currentIndex];
    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;

    // Légende : le texte du <figcaption> voisin, puis « 2 / 6 ».
    const caption = image.closest("figure").querySelector("figcaption");
    const title = caption ? caption.textContent : "";
    counter.textContent = `${title}  ·  ${currentIndex + 1} / ${images.length}`;
}

function openLightbox(index) {
    showImage(index);
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden"; // bloque le défilement de la page derrière
}

function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
}

function showNext() {
    showImage(currentIndex + 1);
}

function showPrevious() {
    showImage(currentIndex - 1);
}

// Crée un bouton flèche (‹ ou ›) et le place dans la visionneuse.
function createArrow(className, symbol, label, action) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lightbox-arrow " + className;
    button.textContent = symbol;
    button.setAttribute("aria-label", label); // texte lu par les lecteurs d'écran

    button.addEventListener("click", (event) => {
        // Sans stopPropagation, le clic « remonterait » jusqu'à la visionneuse,
        // qui se fermerait (un clic sur le fond la ferme).
        event.stopPropagation();
        action();
    });

    lightbox.appendChild(button);
}

if (lightbox && lightboxImg && images.length > 0) {
    // Légende + compteur, sous l'image.
    counter = document.createElement("p");
    counter.className = "lightbox-counter";
    lightbox.appendChild(counter);

    // Flèches cliquables : utiles à la souris et sur téléphone, où il n'y a
    // pas de clavier. Inutiles s'il n'y a qu'une seule image.
    if (images.length > 1) {
        createArrow("lightbox-prev", "‹", "Image précédente", showPrevious);
        createArrow("lightbox-next", "›", "Image suivante", showNext);
    }

    // Chaque image de la page ouvre la visionneuse à sa propre position.
    images.forEach((image, index) => {
        image.tabIndex = 0; // la rend atteignable avec la touche Tab
        image.addEventListener("click", () => openLightbox(index));
        image.addEventListener("keydown", (e) => {
            if (e.key === "Enter") openLightbox(index);
        });
    });

    // Un clic sur l'image agrandie ne ferme pas la visionneuse…
    lightboxImg.addEventListener("click", (event) => event.stopPropagation());
    // …mais un clic sur le fond sombre (ou sur FERMER) la ferme.
    lightbox.addEventListener("click", closeLightbox);

    // Clavier : on n'écoute les touches que si la visionneuse est ouverte.
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;

        if (e.key === "Escape") {
            closeLightbox();
        } else if (e.key === "ArrowRight") {
            showNext();
        } else if (e.key === "ArrowLeft") {
            showPrevious();
        }
    });
}
