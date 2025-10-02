const songs = [
  { title: "Tate McRae - bloodonmyhands", file: "songs/Tate McRae - bloodonmyhands.mp3" },
  { title: "Girls' Generation  - Gee", file: "songs/Girls' Generation - Gee.mp3" },
  { title: "Donna Missal - God Complex", file: "songs/Donna Missal - God Complex.mp3" },
  { title: "Tate McRae - Like I do", file: "songs/Tate McRae - Like I do.mp3" },
];

let currentSongIndex = 0;
let audioPlayer;
let playPauseButton;
let songTitle;
let playlist;
let progressBar;
let timeStart;
let timeEnd;
let togglePlaylist;
let playIcon;
let pauseIcon;
let nextSong;
let backSong;

document.addEventListener("DOMContentLoaded", function () {
  audioPlayer = document.getElementById("audio-player");
  playPauseButton = document.getElementById("play-pause");
  nextSong = document.getElementById("next-song");
  backSong = document.getElementById("back-song")
  songTitle = document.getElementById("song-title");
  playlist = document.getElementById("playlist");
  progressBar = document.getElementById("progress-bar");
  timeStart = document.getElementById("time-start");
  timeEnd = document.getElementById("time-end");
  togglePlaylist = document.getElementById("toggle-playlist");
  playIcon = document.getElementById("play-icon");
  pauseIcon = document.getElementById("pause-icon");
  
  if (!audioPlayer) {
    console.error("Audio player element not found");
    return;
  }

  // Tracks time of song
  audioPlayer.addEventListener("timeupdate", () => {
    if (!isNaN(audioPlayer.duration)) {
      progressBar.max = Math.floor(audioPlayer.duration);
      progressBar.value = Math.floor(audioPlayer.currentTime);

      const currentMinutes = Math.floor(audioPlayer.currentTime / 60);
      const currentSeconds = Math.floor(audioPlayer.currentTime % 60).toString().padStart(2, '0');
      const totalMinutes = Math.floor(audioPlayer.duration / 60);
      const totalSeconds = Math.floor(audioPlayer.duration % 60).toString().padStart(2, '0');

      timeStart.textContent = `${currentMinutes}:${currentSeconds}`;
      timeEnd.textContent = `${totalMinutes}:${totalSeconds}`;
    }
  });

  audioPlayer.addEventListener("timeupdate", () => {
    if (!isNaN(audioPlayer.duration)) {
      const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressBar.value = audioPlayer.currentTime;
      progressBar.max = audioPlayer.duration;
      progressBar.style.background = `linear-gradient(to right, #4caf50 0%, #4caf50 ${percent}%, white ${percent}%, white 100%)`;
    }
  });
  
  // Allow user to seek using the progress bar
  progressBar.addEventListener("input", () => {
    audioPlayer.currentTime = progressBar.value;
  });

  // Update progress bar as the song plays
  audioPlayer.addEventListener("timeupdate", () => {
    if (!isNaN(audioPlayer.duration)) {
      progressBar.max = Math.floor(audioPlayer.duration);
      progressBar.value = Math.floor(audioPlayer.currentTime);
    }
  });

  // Continues to play the next song
  audioPlayer.addEventListener("ended", () => {
    if (currentSongIndex + 1 < songs.length) {
      currentSongIndex += 1;
      play(currentSongIndex);
    } else {
      // Optional: Loop back to first song if at end
      currentSongIndex = 0;
      play(currentSongIndex);
    }
  });

  // Populate static playlist
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.title;
    //li.textContent = `${index + 1} ${song.title}`; 1 Song
    li.addEventListener("click", () => {
      currentSongIndex = index;
      play(currentSongIndex);
    });
    playlist.appendChild(li);
  });

  // Hides playlist
  togglePlaylist.addEventListener("click", () => {
    playlist.classList.toggle("hidden");
  });

  // Space bar play/pause
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      event.preventDefault();
      if (audioPlayer.paused) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    }
  });

  // Play/pause 
  playPauseButton.addEventListener("click", () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      playIcon.style.display = "none";
      pauseIcon.style.display = "inline";
    } else {
      audioPlayer.pause();
      playIcon.style.display = "inline";
      pauseIcon.style.display = "none";
    }
  });

  // Autoplay the first song
  //play(currentSongIndex);

  // Skips the current song and goes to the next
  nextSong.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    play(currentSongIndex);
    pauseIcon.style.display = "inline";
  });

  // Returns to the previous song
  backSong.addEventListener("click", () => {
    play(currentSongIndex - 1);
    currentSongIndex -= 1
    pauseIcon.style.display = "inline";
  });

});

function play(index) {
  if (index >= 0 && index < songs.length) {
    song = songs[index];
    audioPlayer.src = song.file;
    audioPlayer.play();
    songTitle.textContent = song.title;
  }
}

