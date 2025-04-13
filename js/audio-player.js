document.addEventListener('DOMContentLoaded', function() {
    // Audio Player Functionality
    const playButtons = document.querySelectorAll('.play-button');
    let currentAudio = null;
    let isPlaying = false;
    
    // Create audio element with support for various formats
    const audioElement = document.createElement('audio');
    audioElement.preload = 'auto'; // Preload audio for better performance
    document.body.appendChild(audioElement);
    
    // Create mini player
    const miniPlayer = document.createElement('div');
    miniPlayer.className = 'mini-player';
    miniPlayer.innerHTML = `
        <div class="mini-player-info">
            <div class="mini-player-image">
                <img src="" alt="Now playing">
            </div>
            <div class="mini-player-details">
                <h4 class="mini-player-title">Track Name</h4>
                <p class="mini-player-producer">Producer</p>
            </div>
        </div>
        <div class="mini-player-controls">
            <div class="mini-player-progress">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="time-display">
                    <span class="current-time">0:00</span>
                    <span class="duration">0:00</span>
                </div>
            </div>
            <div class="mini-player-buttons">
                <button class="mini-player-button" id="mini-player-prev">
                    <i class="fas fa-step-backward"></i>
                </button>
                <button class="mini-player-button play-pause" id="mini-player-play">
                    <i class="fas fa-play"></i>
                </button>
                <button class="mini-player-button" id="mini-player-next">
                    <i class="fas fa-step-forward"></i>
                </button>
                <button class="mini-player-button" id="mini-player-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(miniPlayer);
    
    // Get mini player elements
    const miniPlayerTitle = miniPlayer.querySelector('.mini-player-title');
    const miniPlayerProducer = miniPlayer.querySelector('.mini-player-producer');
    const miniPlayerImage = miniPlayer.querySelector('.mini-player-image img');
    const miniPlayerPlayButton = miniPlayer.querySelector('#mini-player-play');
    const miniPlayerCloseButton = miniPlayer.querySelector('#mini-player-close');
    const miniPlayerPrevButton = miniPlayer.querySelector('#mini-player-prev');
    const miniPlayerNextButton = miniPlayer.querySelector('#mini-player-next');
    const progressFill = miniPlayer.querySelector('.progress-fill');
    const currentTimeDisplay = miniPlayer.querySelector('.current-time');
    const durationDisplay = miniPlayer.querySelector('.duration');
    
    // Hide mini player initially
    miniPlayer.style.display = 'none';
    
    // Play button click event
    playButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const audioSrc = this.getAttribute('data-audio');
            const beatCard = this.closest('.beat-card');
            const beatName = beatCard.querySelector('h3').textContent;
            const beatProducer = beatCard.querySelector('.producer').textContent;
            const beatImage = beatCard.querySelector('img').getAttribute('src');
            
            // If clicking the same button that's already playing
            if (audioElement.src.includes(audioSrc) && isPlaying) {
                pauseAudio();
                return;
            }
            
            // If a different audio is already playing, stop it
            if (isPlaying) {
                resetPlayButtons();
            }
            
            // Set new audio source
            audioElement.src = audioSrc;
            audioElement.dataset.index = index;
            
            // Update mini player
            miniPlayerTitle.textContent = beatName;
            miniPlayerProducer.textContent = beatProducer;
            miniPlayerImage.src = beatImage;
            
            // Show mini player
            miniPlayer.style.display = 'flex';
            
            // Play audio
            playAudio();
            
            // Update button icon
            this.querySelector('i').classList.remove('fa-play');
            this.querySelector('i').classList.add('fa-pause');
        });
    });
    
    // Mini player play/pause button
    miniPlayerPlayButton.addEventListener('click', function() {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    });
    
    // Mini player close button
    miniPlayerCloseButton.addEventListener('click', function() {
        pauseAudio();
        miniPlayer.style.display = 'none';
        resetPlayButtons();
    });
    
    // Mini player previous button
    miniPlayerPrevButton.addEventListener('click', function() {
        playPreviousTrack();
    });
    
    // Mini player next button
    miniPlayerNextButton.addEventListener('click', function() {
        playNextTrack();
    });
    
    // Audio events
    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('ended', function() {
        playNextTrack();
    });
    audioElement.addEventListener('loadedmetadata', function() {
        // Update duration display
        const minutes = Math.floor(audioElement.duration / 60);
        const seconds = Math.floor(audioElement.duration % 60).toString().padStart(2, '0');
        durationDisplay.textContent = `${minutes}:${seconds}`;
    });
    
    // Progress bar click event
    const progressBar = miniPlayer.querySelector('.progress-bar');
    progressBar.addEventListener('click', function(e) {
        const progressBarWidth = this.clientWidth;
        const clickPosition = e.offsetX;
        const jumpToTime = (clickPosition / progressBarWidth) * audioElement.duration;
        audioElement.currentTime = jumpToTime;
    });
    
    // Play audio function
    function playAudio() {
        audioElement.play();
        isPlaying = true;
        miniPlayerPlayButton.querySelector('i').classList.remove('fa-play');
        miniPlayerPlayButton.querySelector('i').classList.add('fa-pause');
        
        // Update current play button
        const currentIndex = parseInt(audioElement.dataset.index);
        const currentPlayButton = playButtons[currentIndex];
        if (currentPlayButton) {
            currentPlayButton.querySelector('i').classList.remove('fa-play');
            currentPlayButton.querySelector('i').classList.add('fa-pause');
        }
    }
    
    // Pause audio function
    function pauseAudio() {
        audioElement.pause();
        isPlaying = false;
        miniPlayerPlayButton.querySelector('i').classList.remove('fa-pause');
        miniPlayerPlayButton.querySelector('i').classList.add('fa-play');
        
        // Update current play button
        const currentIndex = parseInt(audioElement.dataset.index);
        const currentPlayButton = playButtons[currentIndex];
        if (currentPlayButton) {
            currentPlayButton.querySelector('i').classList.remove('fa-pause');
            currentPlayButton.querySelector('i').classList.add('fa-play');
        }
    }
    
    // Reset all play buttons
    function resetPlayButtons() {
        playButtons.forEach(button => {
            button.querySelector('i').classList.remove('fa-pause');
            button.querySelector('i').classList.add('fa-play');
        });
    }
    
    // Update progress bar
    function updateProgress() {
        const currentTime = audioElement.currentTime;
        const duration = audioElement.duration;
        
        if (duration) {
            // Update progress fill
            const progressPercent = (currentTime / duration) * 100;
            progressFill.style.width = `${progressPercent}%`;
            
            // Update current time display
            const minutes = Math.floor(currentTime / 60);
            const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
            currentTimeDisplay.textContent = `${minutes}:${seconds}`;
        }
    }
    
    // Play next track
    function playNextTrack() {
        const currentIndex = parseInt(audioElement.dataset.index);
        const nextIndex = (currentIndex + 1) % playButtons.length;
        
        // Reset current button
        resetPlayButtons();
        
        // Trigger click on next button
        playButtons[nextIndex].click();
    }
    
    // Play previous track
    function playPreviousTrack() {
        const currentIndex = parseInt(audioElement.dataset.index);
        const prevIndex = (currentIndex - 1 + playButtons.length) % playButtons.length;
        
        // Reset current button
        resetPlayButtons();
        
        // Trigger click on previous button
        playButtons[prevIndex].click();
    }
    
    // Add CSS for mini player
    const style = document.createElement('style');
    style.textContent = `
        .mini-player {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: var(--dark-color);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            z-index: 999;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
        }
        
        .mini-player-info {
            display: flex;
            align-items: center;
            width: 30%;
        }
        
        .mini-player-image {
            width: 50px;
            height: 50px;
            border-radius: 5px;
            overflow: hidden;
            margin-right: 15px;
        }
        
        .mini-player-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .mini-player-details h4 {
            margin: 0;
            font-size: 1rem;
        }
        
        .mini-player-details p {
            margin: 5px 0 0;
            font-size: 0.8rem;
            opacity: 0.7;
        }
        
        .mini-player-controls {
            width: 65%;
            display: flex;
            flex-direction: column;
        }
        
        .mini-player-progress {
            margin-bottom: 10px;
        }
        
        .progress-bar {
            height: 5px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 5px;
        }
        
        .progress-fill {
            height: 100%;
            background-color: var(--primary-color);
            border-radius: 5px;
            width: 0;
        }
        
        .time-display {
            display: flex;
            justify-content: space-between;
            font-size: 0.8rem;
            opacity: 0.7;
        }
        
        .mini-player-buttons {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .mini-player-button {
            background: none;
            border: none;
            color: white;
            font-size: 1rem;
            cursor: pointer;
            margin: 0 10px;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: var(--transition);
        }
        
        .mini-player-button:hover {
            color: var(--primary-color);
        }
        
        .play-pause {
            width: 40px;
            height: 40px;
            background-color: var(--primary-color);
            border-radius: 50%;
        }
        
        .play-pause:hover {
            background-color: #5a36d4;
            color: white;
        }
        
        #mini-player-close {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 0.8rem;
        }
        
        @media (max-width: 768px) {
            .mini-player {
                flex-direction: column;
                padding: 15px;
            }
            
            .mini-player-info {
                width: 100%;
                margin-bottom: 15px;
            }
            
            .mini-player-controls {
                width: 100%;
            }
            
            #mini-player-close {
                top: 15px;
                right: 15px;
            }
        }
    `;
    
    document.head.appendChild(style);
});