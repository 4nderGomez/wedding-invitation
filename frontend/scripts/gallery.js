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

    const originalImages = Array.from(images).slice(0, 6);
    let currentImageIndex = 0;

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
        const imageMovement = 380;

        function getHalfScrollWidth() {
            return galleryViewport.scrollWidth / 2;
        }

        function normalizeGalleryScroll() {
            const halfScrollWidth = getHalfScrollWidth();

            if (galleryViewport.scrollLeft >= halfScrollWidth) {
                galleryViewport.scrollLeft = galleryViewport.scrollLeft - halfScrollWidth;
            }

            if (galleryViewport.scrollLeft <= 0) {
                galleryViewport.scrollLeft = galleryViewport.scrollLeft + halfScrollWidth;
            }
        }

        galleryPrevButton.addEventListener("click", () => {
            normalizeGalleryScroll();

            galleryViewport.scrollBy({
                left: -imageMovement,
                behavior: "smooth"
            });

            setTimeout(normalizeGalleryScroll, 450);
        });

        galleryNextButton.addEventListener("click", () => {
            normalizeGalleryScroll();

            galleryViewport.scrollBy({
                left: imageMovement,
                behavior: "smooth"
            });

            setTimeout(normalizeGalleryScroll, 450);
        });

        galleryViewport.addEventListener("scroll", () => {
            window.clearTimeout(galleryViewport.scrollTimer);

            galleryViewport.scrollTimer = window.setTimeout(() => {
                normalizeGalleryScroll();
            }, 120);
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