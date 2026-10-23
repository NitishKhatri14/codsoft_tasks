
document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("audioPlayer");
    const fileInput = document.getElementById("fileInput");
    const playlist = document.getElementById("playlist");

    const songTitle = document.getElementById("songTitle");
    const artistName = document.getElementById("artistName");
    const albumArt = document.getElementById("albumArt");
    const playingBadge = document.getElementById("playingBadge");

    const playBtn = document.getElementById("playBtn");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const shuffleBtn = document.getElementById("shuffleBtn");
    const repeatBtn = document.getElementById("repeatBtn");
    const favoriteBtn = document.getElementById("favoriteBtn");
    const muteBtn = document.getElementById("muteBtn");

    const progressBar = document.getElementById("progressBar");
    const currentTime = document.getElementById("currentTime");
    const duration = document.getElementById("duration");
    const volumeBar = document.getElementById("volumeBar");
    const volumeValue = document.getElementById("volumeValue");

    const playlistSearch = document.getElementById("playlistSearch");
    const playlistFilter = document.getElementById("playlistFilter");
    const playlistEmpty = document.getElementById("playlistEmpty");
    const trackCount = document.getElementById("trackCount");
    const themeToggle = document.getElementById("themeToggle");

    const FAVORITES_KEY = "vibeTunesFavorites";
    const THEME_KEY = "vibeTunesTheme";

    let songs = [];
    let currentIndex = -1;
    let shuffle = false;
    let repeat = false;
    let isSeeking = false;
    let savedVolume = 0.7;

    let favorites = loadFavorites();

    // Read saved favorites.
    function loadFavorites() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(FAVORITES_KEY) || "[]"
            );

            return Array.isArray(saved) ? saved : [];
        } catch (error) {
            return [];
        }
    }

    function saveFavorites() {
        try {
            localStorage.setItem(
                FAVORITES_KEY,
                JSON.stringify(favorites)
            );
        } catch (error) {
            console.warn("Could not save favorites.", error);
        }
    }

    // Format seconds as minutes and seconds.
    function formatTime(seconds) {
        if (!Number.isFinite(seconds) || seconds < 0) {
            return "0:00";
        }

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        return mins + ":" + String(secs).padStart(2, "0");
    }

    // Create safe HTML elements.
    function makeElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    // Use a filename as a simple title and artist placeholder.
    function getSongDetails(filename) {
        const withoutExtension = filename.replace(/\.[^/.]+$/, "");
        const parts = withoutExtension.split(" - ");

        if (parts.length >= 2) {
            return {
                artist: parts[0].trim(),
                title: parts.slice(1).join(" - ").trim()
            };
        }

        return {
            artist: "Local Music",
            title: withoutExtension
        };
    }

    function getCurrentSong() {
        return songs[currentIndex] || null;
    }

    function isFavorite(song) {
        return favorites.includes(song.favoriteKey);
    }

    // Add selected audio files to the playlist.
    fileInput.addEventListener("change", function () {
        const files = Array.from(fileInput.files || []);

        files.forEach(function (file) {
            if (!file.type.startsWith("audio/")) return;

            const details = getSongDetails(file.name);

            songs.push({
                id: createId(),
                favoriteKey: file.name + "|" + file.size +
                    "|" + file.lastModified,
                title: details.title || file.name,
                artist: details.artist,
                file: file,
                url: URL.createObjectURL(file),
                duration: 0
            });
        });

        fileInput.value = "";

        renderPlaylist();

        if (currentIndex === -1 && songs.length > 0) {
            loadSong(0, false);
        }
    });

    function createId() {
        if (window.crypto &&
            typeof window.crypto.randomUUID === "function") {
            return window.crypto.randomUUID();
        }

        return Date.now().toString() +
            Math.random().toString(36).slice(2);
    }

    // Load a selected song into the audio player.
    function loadSong(index, autoplay) {
        if (songs.length === 0) return;

        currentIndex = (index + songs.length) % songs.length;

        const song = getCurrentSong();

        audio.pause();
        audio.src = song.url;
        audio.load();

        songTitle.textContent = song.title;
        artistName.textContent = song.artist;

        currentTime.textContent = "0:00";
        duration.textContent = "0:00";
        progressBar.value = 0;

        updateFavoriteButton();
        updatePlaybackUI();
        renderPlaylist();

        if (autoplay) {
            playAudio();
        }
    }

    // Play audio and handle browser playback restrictions.
    async function playAudio() {
        if (!getCurrentSong()) {
            songTitle.textContent = "Choose a song";
            artistName.textContent = "Add audio files to begin";
            return;
        }

        try {
            await audio.play();
        } catch (error) {
            playingBadge.textContent = "READY";
            playBtn.textContent = "▶";
            playBtn.setAttribute("aria-label", "Play");
            console.warn("Playback could not start.", error);
        }
    }

    playBtn.addEventListener("click", function () {
        if (!getCurrentSong()) {
            if (songs.length > 0) {
                loadSong(0, true);
            } else {
                fileInput.click();
            }

            return;
        }

        if (audio.paused) {
            playAudio();
        } else {
            audio.pause();
        }
    });

    // Previous track.
    prevBtn.addEventListener("click", function () {
        if (songs.length === 0) return;

        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }

        loadSong(currentIndex - 1, true);
    });

    // Next track.
    nextBtn.addEventListener("click", function () {
        if (songs.length === 0) return;

        if (shuffle && songs.length > 1) {
            let nextIndex;

            do {
                nextIndex = Math.floor(Math.random() * songs.length);
            } while (nextIndex === currentIndex);

            loadSong(nextIndex, true);
        } else {
            loadSong(currentIndex + 1, true);
        }
    });

    // Update playback controls.
    function updatePlaybackUI() {
        const playing = !audio.paused;

        playBtn.textContent = playing ? "❚❚" : "▶";
        playBtn.setAttribute(
            "aria-label",
            playing ? "Pause" : "Play"
        );

        playingBadge.textContent = playing ? "PLAYING" : "PAUSED";
    }

    audio.addEventListener("play", updatePlaybackUI);
    audio.addEventListener("pause", updatePlaybackUI);

    // Update duration when audio metadata is available.
    audio.addEventListener("loadedmetadata", function () {
        const song = getCurrentSong();

        if (song) {
            song.duration = audio.duration;
        }

        duration.textContent = formatTime(audio.duration);
        renderPlaylist();
    });

    // Update the playback time and progress bar.
    audio.addEventListener("timeupdate", function () {
        if (!isSeeking && Number.isFinite(audio.duration) &&
            audio.duration > 0) {
            progressBar.value =
                (audio.currentTime / audio.duration) * 100;
        }

        currentTime.textContent = formatTime(audio.currentTime);
    });

    // Allow users to seek through a song.
    progressBar.addEventListener("input", function () {
        isSeeking = true;

        if (Number.isFinite(audio.duration) && audio.duration > 0) {
            audio.currentTime =
                (Number(progressBar.value) / 100) * audio.duration;
        }
    });

    progressBar.addEventListener("change", function () {
        isSeeking = false;
    });

    // Autoplay the next song after the current one ends.
    audio.addEventListener("ended", function () {
        if (repeat) {
            audio.currentTime = 0;
            playAudio();
        } else if (shuffle && songs.length > 1) {
            let nextIndex;

            do {
                nextIndex = Math.floor(Math.random() * songs.length);
            } while (nextIndex === currentIndex);

            loadSong(nextIndex, true);
        } else if (currentIndex < songs.length - 1) {
            loadSong(currentIndex + 1, true);
        } else {
            audio.currentTime = 0;
            progressBar.value = 0;
            updatePlaybackUI();
        }
    });

    // Volume control.
    audio.volume = savedVolume;
    volumeBar.value = savedVolume;
    updateVolumeUI();

    volumeBar.addEventListener("input", function () {
        savedVolume = Number(volumeBar.value);
        audio.volume = savedVolume;
        audio.muted = savedVolume === 0;

        updateVolumeUI();
    });

    muteBtn.addEventListener("click", function () {
        if (audio.muted || audio.volume === 0) {
            audio.muted = false;

            if (audio.volume === 0) {
                audio.volume = savedVolume || 0.7;
                volumeBar.value = audio.volume;
            }
        } else {
            savedVolume = audio.volume;
            audio.muted = true;
        }

        updateVolumeUI();
    });

    function updateVolumeUI() {
        const muted = audio.muted || audio.volume === 0;

        muteBtn.textContent = muted ? "🔇" :
            audio.volume < 0.5 ? "🔉" : "🔊";

        muteBtn.setAttribute("aria-label", muted ? "Unmute" : "Mute");
        volumeValue.textContent = muted
            ? "Muted"
            : Math.round(audio.volume * 100) + "%";

        volumeBar.value = muted ? 0 : audio.volume;
    }

    // Shuffle mode.
    shuffleBtn.addEventListener("click", function () {
        shuffle = !shuffle;

        shuffleBtn.classList.toggle("active", shuffle);
        shuffleBtn.setAttribute("aria-pressed", String(shuffle));
        shuffleBtn.title = shuffle ? "Shuffle on" : "Shuffle off";
    });

    // Repeat current song mode.
    repeatBtn.addEventListener("click", function () {
        repeat = !repeat;

        repeatBtn.classList.toggle("active", repeat);
        repeatBtn.setAttribute("aria-pressed", String(repeat));
        repeatBtn.title = repeat ? "Repeat current song" : "Repeat off";
    });

    // Favorite the current song.
    favoriteBtn.addEventListener("click", function () {
        const song = getCurrentSong();

        if (!song) return;

        toggleFavorite(song);
    });

    function toggleFavorite(song) {
        if (isFavorite(song)) {
            favorites = favorites.filter(function (key) {
                return key !== song.favoriteKey;
            });
        } else {
            favorites.push(song.favoriteKey);
        }

        saveFavorites();
        updateFavoriteButton();
        renderPlaylist();
    }

    function updateFavoriteButton() {
        const song = getCurrentSong();
        const active = song ? isFavorite(song) : false;

        favoriteBtn.textContent = active ? "♥" : "♡";
        favoriteBtn.classList.toggle("active", active);
        favoriteBtn.setAttribute(
            "aria-label",
            active ? "Remove from favorites" : "Add song to favorites"
        );
    }

    // Build a playlist item.
    function createTrackElement(song, index) {
        const row = makeElement(
            "div",
            "track" + (index === currentIndex ? " active" : "")
        );

        const artwork = makeElement("div", "track-art", "♫");

        const info = makeElement("div", "track-info");
        const title = makeElement("h3", "", song.title);
        const artist = makeElement("p", "", song.artist);

        info.appendChild(title);
        info.appendChild(artist);

        info.addEventListener("click", function () {
            loadSong(index, true);
        });

        const trackDuration = makeElement(
            "span",
            "track-duration",
            formatTime(song.duration)
        );

        const favorite = makeElement(
            "button",
            "track-favorite" + (isFavorite(song) ? " active" : ""),
            isFavorite(song) ? "♥" : "♡"
        );

        favorite.type = "button";
        favorite.title = "Toggle favorite";
        favorite.setAttribute(
            "aria-label",
            "Toggle favorite for " + song.title
        );

        favorite.addEventListener("click", function () {
            toggleFavorite(song);
        });

        row.appendChild(artwork);
        row.appendChild(info);
        row.appendChild(trackDuration);
        row.appendChild(favorite);

        return row;
    }

    // Search and filter the playlist.
    function renderPlaylist() {
        playlist.replaceChildren();

        const query = playlistSearch.value.trim().toLowerCase();
        const favoriteOnly = playlistFilter.value === "favorites";

        const filteredSongs = songs.map(function (song, index) {
            return { song: song, index: index };
        }).filter(function (item) {
            const song = item.song;

            const matchesSearch =
                song.title.toLowerCase().includes(query) ||
                song.artist.toLowerCase().includes(query);

            const matchesFavorites =
                !favoriteOnly || isFavorite(song);

            return matchesSearch && matchesFavorites;
        });

        filteredSongs.forEach(function (item) {
            playlist.appendChild(
                createTrackElement(item.song, item.index)
            );
        });

        trackCount.textContent =
            songs.length + (songs.length === 1 ? " song" : " songs");

        playlistEmpty.hidden = filteredSongs.length > 0;

        if (songs.length === 0) {
            playlistEmpty.querySelector("h3").textContent =
                "Your playlist is waiting";

            playlistEmpty.querySelector("p").textContent =
                "Add audio files to start listening.";
        } else if (filteredSongs.length === 0) {
            playlistEmpty.querySelector("h3").textContent =
                "No matching songs";

            playlistEmpty.querySelector("p").textContent =
                "Try another search or filter.";
        }
    }

    playlistSearch.addEventListener("input", renderPlaylist);
    playlistFilter.addEventListener("change", renderPlaylist);

    // Theme preference.
    function applyTheme(theme) {
        document.body.classList.toggle("light", theme === "light");

        themeToggle.textContent = theme === "light" ? "🌙" : "☀️";
        themeToggle.setAttribute(
            "aria-label",
            theme === "light" ? "Switch to dark theme" : "Switch to light theme"
        );
    }

    let savedTheme = "dark";

    try {
        savedTheme = localStorage.getItem(THEME_KEY) || "dark";
    } catch (error) {
        savedTheme = "dark";
    }

    applyTheme(savedTheme);

    themeToggle.addEventListener("click", function () {
        const newTheme = document.body.classList.contains("light")
            ? "dark"
            : "light";

        applyTheme(newTheme);

        try {
            localStorage.setItem(THEME_KEY, newTheme);
        } catch (error) {
            // Theme changes still work for the current session.
        }
    });

    // Update the footer year.
    document.getElementById("year").textContent =
        new Date().getFullYear();

    // Initial display.
    renderPlaylist();
});
