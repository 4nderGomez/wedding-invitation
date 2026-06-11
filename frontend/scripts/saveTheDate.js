export function initSaveTheDate() {
    const saveTheDateVideo = document.getElementById("saveTheDateVideo");

    if (!saveTheDateVideo) return;

    const pageAudio = document.querySelector("audio");
    let audioWasPlayingBeforeVideo = false;

    saveTheDateVideo.addEventListener("play", () => {
        if (!pageAudio) return;

        audioWasPlayingBeforeVideo = !pageAudio.paused;

        if (audioWasPlayingBeforeVideo) {
            pageAudio.pause();
        }
    });

    saveTheDateVideo.addEventListener("ended", async () => {
        if (!pageAudio || !audioWasPlayingBeforeVideo) return;

        try {
            await pageAudio.play();
        } catch (error) {
            audioWasPlayingBeforeVideo = false;
        }
    });
}