// Visionneuse d'images (« lightbox ») des pages projets.
// Un clic sur une capture ou un schéma l'affiche en grand ;
// un clic n'importe où, ou la touche Échap, la referme.

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

function openLightbox(image) {
    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden"; // bloque le défilement de la page derrière
}

function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
}

if (lightbox && lightboxImg) {
    // Chaque image de la galerie devient cliquable (et utilisable au clavier).
    document.querySelectorAll(".shot img").forEach(image => {
        image.tabIndex = 0;
        image.addEventListener("click", () => openLightbox(image));
        image.addEventListener("keydown", (e) => {
            if (e.key === "Enter") openLightbox(image);
        });
    });

    lightbox.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLightbox();
    });
}
