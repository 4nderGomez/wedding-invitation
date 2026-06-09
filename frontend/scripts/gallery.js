export function initGalleryModal() {
    const images = document.querySelectorAll(".gallery-track img");
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const overlay = document.querySelector(".image-modal-overlay");

    const closeButton = document.querySelector(".image-modal-close");
    const modalPrevButton = document.querySelector(".image-modal-arrow-left");
    const modalNextButton = document.querySelector(".image-modal-arrow-right");

    const galleryViewport = document.querySelector(".gallery-viewport");
    const galleryPrevButton = document.querySelector(".gallery-arrow-left");
    const galleryNextButton = document.querySelector(".gallery-arrow-right");

    if (!images.length || !modal || !modalImg || !overlay) return;

    let currentImageIndex = 0;

    const originalImages = Array.from(images).slice(0, 6);

    function openModal(index) {
        currentImageIndex = index % originalImages.length;

        modal.classList.add("active");
        modalImg.src = originalImages[currentImageIndex].src;
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
    }

    function showPreviousImage() {
        currentImageIndex--;

        if (currentImageIndex < 0) {
            currentImageIndex = originalImages.length - 1;
        }

        modalImg.src = originalImages[currentImageIndex].src;
    }

    function showNextImage() {
        currentImageIndex++;

        if (currentImageIndex >= originalImages.length) {
            currentImageIndex = 0;
        }

        modalImg.src = originalImages[currentImageIndex].src;
    }

    images.forEach((img, index) => {
        img.addEventListener("click", () => {
            openModal(index);
        });
    });

    overlay.addEventListener("click", closeModal);

    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }

    if (modalPrevButton) {
        modalPrevButton.addEventListener("click", showPreviousImage);
    }

    if (modalNextButton) {
        modalNextButton.addEventListener("click", showNextImage);
    }

    if (galleryViewport && galleryPrevButton && galleryNextButton) {
        galleryPrevButton.addEventListener("click", () => {
            galleryViewport.scrollBy({
                left: -380,
                behavior: "smooth"
            });
        });

        galleryNextButton.addEventListener("click", () => {
            galleryViewport.scrollBy({
                left: 380,
                behavior: "smooth"
            });
        });
    }

    document.addEventListener("keydown", (event) => {
        if (!modal.classList.contains("active")) return;

        if (event.key === "Escape") {
            closeModal();
        }

        if (event.key === "ArrowLeft") {
            showPreviousImage();
        }

        if (event.key === "ArrowRight") {
            showNextImage();
        }
    });
}