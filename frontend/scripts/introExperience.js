export function initIntroExperience() { 
    const intro = document.getElementById("introScreen");
    const enterBtn = document.getElementById("enterExperience");
    const music = document.getElementById("backgroundMusic");
    const musicToggle = document.getElementById("musicToggle");

    if (!intro || !enterBtn || !music) return;

    music.volume = 0.4;
    music.loop = true;

    let musicStarted = false;
    let userWantsMusic = true;

    function showMusicButton() {
        if (!musicToggle) return;
        musicToggle.classList.add("visible");
    }

    function updateMusicButton() {
        if (!musicToggle) return;

        if (music.paused) {
            musicToggle.classList.add("is-paused");
            musicToggle.setAttribute("aria-label", "Reproducir música");
        } else {
            musicToggle.classList.remove("is-paused");
            musicToggle.setAttribute("aria-label", "Pausar música");
        }
    }

    async function playMusic() {
        try {
            await music.play();
            musicStarted = true;
            userWantsMusic = true;
            updateMusicButton();
        } catch (error) {
            console.log("El navegador bloqueó la música");
        }
    }

    function pauseMusic() {
        music.pause();
        userWantsMusic = false;
        updateMusicButton();
    }

    enterBtn.addEventListener("click", async () => {
        await playMusic();

        intro.classList.add("hide");
        document.body.style.overflow = "auto";

        showMusicButton();
        updateMusicButton();
    });

    if (musicToggle) {
        musicToggle.addEventListener("click", async () => {
            if (music.paused) {
                await playMusic();
            } else {
                pauseMusic();
            }
        });
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            music.pause();
            updateMusicButton();
            return;
        }

        if (musicStarted && userWantsMusic) {
            music.play()
                .then(updateMusicButton)
                .catch(() => {});
        }
    });
}