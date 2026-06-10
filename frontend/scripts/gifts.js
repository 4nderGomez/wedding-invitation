export function initGifts() {
    const copyButtons = document.querySelectorAll(".copy-btn");
    const copyToast = document.getElementById("copyToast");

    let toastTimeout;

    if (!copyButtons.length) return;

    function showCopyToast() {
        if (!copyToast) return;

        copyToast.classList.add("active");

        clearTimeout(toastTimeout);

        toastTimeout = setTimeout(() => {
            copyToast.classList.remove("active");
        }, 1800);
    }

    async function copyTextToClipboard(textToCopy) {
        try {
            await navigator.clipboard.writeText(textToCopy);
        } catch (error) {
            const tempInput = document.createElement("textarea");

            tempInput.value = textToCopy;
            tempInput.setAttribute("readonly", "");

            tempInput.style.position = "absolute";
            tempInput.style.left = "-9999px";

            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
        }
    }

    copyButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const textToCopy = button.getAttribute("data-copy");
            const originalText = button.textContent;

            if (!textToCopy) return;

            await copyTextToClipboard(textToCopy);

            button.textContent = "Copiado";
            button.classList.add("copied");

            showCopyToast();

            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove("copied");
            }, 1800);
        });
    });
}