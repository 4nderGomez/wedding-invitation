export function initFloatingMenu() {
    const floatingMenu = document.getElementById("floatingMenu");
    const floatingMenuToggle = document.getElementById("floatingMenuToggle");
    const floatingMenuPanel = document.getElementById("floatingMenuPanel");
    const menuLinks = document.querySelectorAll(".floating-menu-panel a");

    if (!floatingMenu || !floatingMenuToggle || !floatingMenuPanel) return;

    function showFloatingMenu() {
        floatingMenu.classList.add("visible");
    }

    function closeFloatingMenu() {
        floatingMenu.classList.remove("active");
        floatingMenuToggle.setAttribute("aria-label", "Abrir menú");
    }

    function toggleFloatingMenu() {
        floatingMenu.classList.toggle("active");

        if (floatingMenu.classList.contains("active")) {
            floatingMenuToggle.setAttribute("aria-label", "Cerrar menú");
        } else {
            floatingMenuToggle.setAttribute("aria-label", "Abrir menú");
        }
    }

    floatingMenuToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleFloatingMenu();
    });

    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            closeFloatingMenu();
        });
    });

    document.addEventListener("click", (event) => {
        if (!floatingMenu.contains(event.target)) {
            closeFloatingMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeFloatingMenu();
        }
    });

    document.addEventListener("introExperienceStarted", () => {
        showFloatingMenu();
    });
}