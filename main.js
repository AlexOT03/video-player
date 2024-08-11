$ = el => document.querySelector(el);

const videoPlayer = $('#video-player');
const mainVideo = videoPlayer.querySelector('#main-video');
const progressAreaTime = videoPlayer.querySelector('.progress-area-time');
const detailsPanel = videoPlayer.querySelector('.details-panel');
const controls = videoPlayer.querySelector('.controls');
const progressArea = videoPlayer.querySelector('.progress-area');
const progressBar = progressArea.querySelector('.progress-bar');
const bufferedBar = progressArea.querySelector('.buffered-bar');
const fastRewind = videoPlayer.querySelector('.fast-rewind');
const playPause = videoPlayer.querySelector('.play-pause');
const fastForward = videoPlayer.querySelector('.fast-forward');
const volume = videoPlayer.querySelector('.volume');
const volumeRange = videoPlayer.querySelector('.volume-range');
const currentTime = videoPlayer.querySelector('.current');
const totalTime = videoPlayer.querySelector('.total');
const autoPlay = videoPlayer.querySelector('.auto-play');
const captionsBtn = videoPlayer.querySelector('.captions-btn');
const settingsBtn = videoPlayer.querySelector('.settings-btn');
const settingsHome = videoPlayer.querySelectorAll('#settings [data-label="settings-home"] > ul > li');
const pictureInPicture = videoPlayer.querySelector('.picture-in-picture');
const fullscreen = videoPlayer.querySelector('.fullscreen');
const settings = videoPlayer.querySelector('#settings');
const captions = videoPlayer.querySelector('#captions');
const captionLabels = videoPlayer.querySelector('#captions ul');
const playback = videoPlayer.querySelectorAll('.playback li');
const tracks = mainVideo.querySelectorAll('track');
const spinner = videoPlayer.querySelector('.spinner');
let thumbnail = videoPlayer.querySelector('.thumbnail');

if (tracks.length != 0) {
    captionLabels.insertAdjacentHTML('afterbegin', '<li data-track="off" class="active">OFF</li>');
    tracks.forEach((track) => {
        var trackLi = `<li data-track="${track.srclang}">${track.label}</li>`;
        captionLabels.insertAdjacentHTML('beforeend', trackLi);
    });
} else {
    captionLabels.insertAdjacentHTML('afterbegin', '<li>No available</li>');
}

const captionTracks = captions.querySelectorAll('ul li');

// mainVideo.addEventListener('loadeddata', () => {
//     setInterval(() => {
//         let bufferedTime = mainVideo.buffered.end(0);
//         let duration = mainVideo.duration;
//         let widthVal = (bufferedTime / duration) * 100;
//         bufferedProgressBar.style.width = `${widthVal}%`;
//     }, 500);
// });


function playVideo() {
    playPause.classList.remove('ti-repeat');
    playPause.classList.remove('ti-player-play');
    playPause.classList.add('ti-player-pause');
    videoPlayer.classList.add('pause');
    mainVideo.play();
}


function pauseVideo() {
    playPause.classList.remove('ti-player-pause');
    playPause.classList.add('ti-player-play');
    videoPlayer.classList.remove('pause');
    mainVideo.pause();
}


playPause.addEventListener('click', () => {
    if (videoPlayer.classList.contains('pause')) {
        pauseVideo();
    } else {
        playVideo();
    }
});


mainVideo.addEventListener('play', () => {
    playVideo();
});


mainVideo.addEventListener('pause', () => {
    pauseVideo();
});

mainVideo.onended = () => {
    if (!autoPlay.classList.contains('active')) {
        controls.classList.add('active');
        detailsPanel.classList.add('active');
    }
};


fastRewind.addEventListener('click', () => {
    mainVideo.currentTime -= 10;
});


fastForward.addEventListener('click', () => {
    mainVideo.currentTime += 10;
});


mainVideo.addEventListener('loadeddata', (e) => {
    let videoDuration = e.target.duration;
    let totalMin = Math.floor(videoDuration / 60);
    let totalSec = Math.floor(videoDuration % 60);

    totalSec < 10 ? totalSec = '0' + totalSec : totalSec;
    totalTime.innerHTML = `${totalMin}:${totalSec}`;
});


mainVideo.addEventListener('timeupdate', (e) => {
    let currentVideoTime = e.target.currentTime;
    let currentMin = Math.floor(currentVideoTime / 60);
    let currentSec = Math.floor(currentVideoTime % 60);

    currentSec < 10 ? currentSec = '0' + currentSec : currentSec;
    currentTime.innerHTML = `${currentMin}:${currentSec}`;

    let videoDuration = e.target.duration;

    let progressBarWidth = (currentVideoTime / videoDuration) * 100 + 0.5;
    progressBar.style.width = `${progressBarWidth}%`;
});


progressArea.addEventListener('pointerdown', (e) => {
    setTimelinePosition(e);
    progressArea.addEventListener('pointermove', setTimelinePosition);
    progressArea.addEventListener('pointerup', () => {
        progressArea.removeEventListener('pointermove', setTimelinePosition);
    });
});


function setTimelinePosition(e) {
    let videoDuration = mainVideo.duration;
    let progressWidthVal = progressArea.clientWidth;
    let clickOffsetX = e.offsetX;
    mainVideo.currentTime = (clickOffsetX / progressWidthVal) * videoDuration;
    
    let progressBarWidth = (mainVideo.currentTime / videoDuration) * 100 + 0.5;
    progressBar.style.width = `${progressBarWidth}%`;

    let currentVideoTime = mainVideo.currentTime;
    let currentMin = Math.floor(currentVideoTime / 60);
    let currentSec = Math.floor(currentVideoTime % 60);
    currentSec < 10 ? currentSec = '0' + currentSec : currentSec;
    currentTime.innerHTML = `${currentMin}:${currentSec}`;
}


function drawProgress(canvas, buffered, duration) {
    let context = canvas.getContext('2d', { antialias: false });
    context.fillStyle = '#ffffffe6';

    let height = canvas.height;
    let width = canvas.width;

    if (!height || !width) throw "Canvas is not defined";
    context.clearRect(0, 0, width, height);
    for (let i = 0; i < buffered.length; i++) {
        let leadingEdge = buffered.start(i) / duration * width;
        let trailingEdge = buffered.end(i) / duration * width;
        context.fillReac(leadingEdge, 0 , trailingEdge - leadingEdge, height);
    }
}

mainVideo.addEventListener('progress', () => {
    drawProgress(bufferedBar, mainVideo.buffered, mainVideo.duration);
});


mainVideo.addEventListener('waiting', () => {
    spinner.style.display = 'block';
});


mainVideo.addEventListener('canplay', () => {
    spinner.style.display = 'none';
});

function setVolume() {
    mainVideo.volume = (volumeRange.value / 100) * (volumeRange.value / 100);
    if (volumeRange.value == 0) {
        volume.classList.remove('ti-volume')
        volume.classList.remove('ti-volume-2');
        volume.classList.add('ti-volume-off');
    } else if (volumeRange.value < 50) {
        volume.classList.remove('ti-volume');
        volume.classList.remove('ti-volume-off');
        volume.classList.add('ti-volume-2');
    } else {
        volume.classList.remove('ti-volume-off');
        volume.classList.remove('ti-volume-2');
        volume.classList.add('ti-volume');
    }
}


function toggleMute() {
    if (volumeRange.value == 0) {
        volumeRange.value = 70;
        mainVideo.volume = 0.8;

        volume.classList.remove('ti-volume-off');
        volume.classList.remove('ti-volume-2');
        volume.classList.add('ti-volume');
    } else {
        volumeRange.value = 0;
        mainVideo.volume = 0;

        volume.classList.remove('ti-volume');
        volume.classList.remove('ti-volume-2');
        volume.classList.add('ti-volume-off');
    }
}


volumeRange.addEventListener('change', () => {
    setVolume();
});


volume.addEventListener('click', () => {
    toggleMute();
});


progressArea.addEventListener('mousemove', (e) => {
    let progressWidthVal = progressArea.clientWidth + 2;
    let offsetX = e.offsetX;
    let videoDuration = mainVideo.duration;
    let progressTime = Math.floor((offsetX / progressWidthVal) * videoDuration);
    let currentMin = Math.floor(progressTime / 60);
    let currentSec = Math.floor(progressTime % 60);

    if (offsetX >= progressWidthVal - 100) {
        offsetX = progressWidthVal - 100;
    } else if (offsetX <= 80) {
        offsetX = 80;
    } else {
        offsetX = e.offsetX;
    }   

    progressAreaTime.style.setProperty('--x', `${offsetX}px`);
    progressAreaTime.style.display = 'block';

    currentSec < 10 ? currentSec = '0' + currentSec : currentSec;
    progressAreaTime.innerHTML = `${currentMin}:${currentSec}`;

    thumbnail.style.setProperty('--x', `${offsetX}px`);
    thumbnail.style.display = 'block';

    for (var item of thumbnails) {
        //
        var data = item.sec.find(x1 => x1.index === Math.floor(progressTime));
        // thumbnail found
        if (data) {
            if (item.data !== undefined) {
                thumbnail.setAttribute("style", `
                    background-image: url(${item.data}); background-position-x: ${data.backgroundPositionX}px;
                    background-position-y: ${data.backgroundPositionY}px;--x: ${offsetX}px;display: block;
                    `);
                // exit
                return;
            }
        }
    }
});


progressArea.addEventListener('mouseleave', () => {
    thumbnail.style.display = 'none';
    progressAreaTime.style.display = 'none';
});


autoPlay.addEventListener('click', () => {
    autoPlay.classList.toggle('active');
    if (autoPlay.classList.contains('active')) {
        autoPlay.title = 'Autoplay Enabled';
    } else {
        autoPlay.title = 'Autoplay Disabled';
    }
});


mainVideo.addEventListener('ended', () => {
    if (autoPlay.classList.contains('active')) {
        playVideo();
    } else {
        playPause.classList.remove('ti-player-play');
        playPause.classList.add('ti-repeat');
    }
});


pictureInPicture.addEventListener('click', () => {
    mainVideo.requestPictureInPicture();
});


fullscreen.addEventListener('click', () => {
    if (!videoPlayer.classList.contains('open-full-screen')) {
        videoPlayer.classList.add('open-full-screen');
        fullscreen.classList.remove('ti-maximize');
        fullscreen.classList.add('ti-minimize');
        videoPlayer.requestFullscreen();
    } else {
        videoPlayer.classList.remove('open-full-screen');
        fullscreen.classList.remove('ti-minimize');
        fullscreen.classList.add('ti-maximize');
        document.exitFullscreen();
    }
});


settingsBtn.addEventListener('click', () => {
    settings.classList.toggle('active');
    settingsBtn.classList.toggle('active');

    if (captionsBtn.classList.contains('active') || captions.classList.contains('active')) {
        captions.classList.remove('active');
        captionsBtn.classList.remove('active');
    }
});


playback.forEach((event) => {
    event.addEventListener('click', () => {
        removeActiveClass(playback);
        event.classList.add('active');
        let speed = event.getAttribute('data-speed');
        mainVideo.playbackRate = speed;
    });
});


captionsBtn.addEventListener('click', () => {
    captions.classList.toggle('active');
    captionsBtn.classList.toggle('active');

    if (settingsBtn.classList.contains('active') || settings.classList.contains('active')) {
        settings.classList.remove('active');
        settingsBtn.classList.remove('active');
    }
});

captionTracks.forEach((event) => {
    event.addEventListener('click', () => {
        removeActiveClass(captionTracks);
        event.classList.add('active');
        changeCaption(event);
        captionText.innerHTML = '';
    });
});

let textTrackList = mainVideo.textTracks;

function changeCaption(element) {
    let track = element.getAttribute('data-track');
    for (let i = 0; i < textTrackList.length; i++) {
        textTrackList[i].mode = 'disabled';
        if (textTrackList[i].language == track) {
            textTrackList[i].mode = 'showing';
        }
    }
}


let captionText = videoPlayer.querySelector('.caption-text');
for (let i = 0; i < textTrackList.length; i++) {
    textTrackList[i].addEventListener('cuechange', () => {
        if (textTrackList[i].mode == 'showing') {
            if (textTrackList[i].activeCues[0]) {
                let span = `<span><mark>${textTrackList[i].activeCues[0].text}</mark></span>`;
                captionText.innerHTML = span;
            } else {
                captionText.innerHTML = '';
            }
        }
    });
}

const settingsDivs = videoPlayer.querySelectorAll('#settings > div');
const settingsBack = videoPlayer.querySelectorAll('#settings > div .back-arrow');
const qualityUl = videoPlayer.querySelector('#settings > [data-label="quality"] > ul');
const qualitys = videoPlayer.querySelectorAll("source[size]");


qualitys.forEach((event) => {
    let qualityHtml = `<li data-quality="${event.getAttribute('size')}">${event.getAttribute('size')}p</li>`;
    qualityUl.insertAdjacentHTML('afterbegin', qualityHtml);
});

const qualityLi = videoPlayer.querySelectorAll('#settings > [data-label="quality"] > ul > li');
qualityLi.forEach((event) => {
    event.addEventListener('click', (e) => {
        let quality = event.getAttribute('data-quality');
        removeActiveClass(qualityLi);
        event.classList.add('active');
        qualitys.forEach((source) => {
            if (source.getAttribute('size') == quality) {
                let videoDuration = mainVideo.currentTime;
                let videoSrc = source.getAttribute('src');
                mainVideo.src = videoSrc;
                mainVideo.currentTime = videoDuration;
                playVideo();
            }
        });
    });
});


settingsBack.forEach((event) => {
    event.addEventListener('click', (e) => {
        let settingsLabel = e.target.getAttribute('data-label');
        for (let i = 0; i < settingsDivs.length; i++) {
            if(settingsDivs[i].getAttribute('data-label') == settingsLabel) {
                settingsDivs[i].removeAttribute('hidden');
            } else { 
                settingsDivs[i].setAttribute('hidden', '');
            }
        }
    });
});


settingsHome.forEach((event) => {
    event.addEventListener('click', (e) => {
        let settingsLabel = e.target.getAttribute('data-label');
        for (let i = 0; i < settingsDivs.length; i++) {
            if(settingsDivs[i].getAttribute('data-label') == settingsLabel) {
                settingsDivs[i].removeAttribute('hidden');
            } else { 
                settingsDivs[i].setAttribute('hidden', '');
            }
        }
    });
});

// create a generic function to remove settings
function removeActiveClass(element) {
    element.forEach(event => {
        event.classList.remove('active');
    });
}


window.addEventListener('unload', () => {
    let setDuration = localStorage.setItem('duration', `${mainVideo.currentTime}`);
    let setPath = localStorage.setItem('src', `${mainVideo.src}`);
});


window.addEventListener('load', () => {
    let getDuration = localStorage.getItem('duration');
    let getPath = localStorage.getItem('src');


    if (getPath) {
        mainVideo.src = getPath;
    }

    if (getDuration) {
        mainVideo.currentTime = getDuration;
    }

});


mainVideo.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});


videoPlayer.addEventListener('mouseenter', () => {
    controls.classList.add('active');
    detailsPanel.classList.add('active');
    if (tracks.length != 0) {
        captionText.classList.remove('active');
    }
});


videoPlayer.addEventListener('mouseleave', () => {
    if (videoPlayer.classList.contains('pause')) {
        if (settingsBtn.classList.contains('active') || captionsBtn.classList.contains('active')) {
            controls.classList.add('active');
            detailsPanel.classList.add('active');
        } else {
            controls.classList.remove('active');
            detailsPanel.classList.remove('active');
            if (tracks.length != 0) {
                captionText.classList.add('active');
            }
        }
    } else {
        controls.classList.add('active');
        detailsPanel.classList.add('active');
    }
});

if (videoPlayer.classList.contains('pause')) {
    if (settingsBtn.classList.contains('active') || captionsBtn.classList.contains('active')) {
        controls.classList.add('active');
        detailsPanel.classList.add('active');
    } else {
        controls.classList.remove('active');
        detailsPanel.classList.remove('active');
        if (tracks.length != 0) {
            captionText.classList.add('active');
        }
    }
} else {
    controls.classList.add('active');
    detailsPanel.classList.add('active');
}


videoPlayer.addEventListener('touchstart', () => {
    controls.classList.add('active');
    detailsPanel.classList.add('active');

    setTimeout(() => {
        controls.classList.remove('active');
        detailsPanel.classList.remove('active');
        if (tracks.length != 0) {
            captionText.classList.remove('active');
        }
    }, 8000);
});


videoPlayer.addEventListener('touchmove', () => {
    if (videoPlayer.classList.contains('pause')) {
        controls.classList.remove('active');
        detailsPanel.classList.remove('active');
        if (tracks.length != 0) {
            captionText.classList.add('active');
        }
    } else {
        controls.classList.add('active');
        detailsPanel.classList.add('active');
    }
});


var thumbnails = [];

var thumbnailWidth = 158;
var thumbnailHeight = 90;
var horizontalItemCount = 5;
var verticalItemCount = 5;

let previewVideo = document.createElement('video');
previewVideo.preload = 'metadata'
previewVideo.width = 500;
previewVideo.height = 300;
previewVideo.controls = true;
previewVideo.src = mainVideo.querySelector('source').src;

previewVideo.addEventListener('loadeddata', async function () {
    //
    previewVideo.pause();

    //
    var count = 1;

    //
    var id = 1;

    //
    var x = 0, y = 0;

    //
    var array = [];

    //
    var duration = parseInt(previewVideo.duration);

    //
    for (var i = 1; i <= duration; i++) {
        array.push(i);
    }

    //
    var canvas;

    //
    var i, j;

    for (i = 0, j = array.length; i < j; i += horizontalItemCount) {
        //
        for (var startIndex of array.slice(i, i + horizontalItemCount)) {
            //
            var backgroundPositionX = x * thumbnailWidth;

            //
            var backgroundPositionY = y * thumbnailHeight;

            //
            var item = thumbnails.find(x => x.id === id);

            if (!item) {
                // 

                //
                canvas = document.createElement('canvas');

                //
                canvas.width = thumbnailWidth * horizontalItemCount;
                canvas.height = thumbnailHeight * verticalItemCount;

                //
                thumbnails.push({
                    id: id,
                    canvas: canvas,
                    sec: [{
                        index: startIndex,
                        backgroundPositionX: -backgroundPositionX,
                        backgroundPositionY: -backgroundPositionY
                    }]
                });
            } else {
                //

                //
                canvas = item.canvas;

                //
                item.sec.push({
                    index: startIndex,
                    backgroundPositionX: -backgroundPositionX,
                    backgroundPositionY: -backgroundPositionY
                });
            }

            //
            var context = canvas.getContext('2d');

            //
            previewVideo.currentTime = startIndex;

            //
            await new Promise(function (resolve) {
                var event = function () {
                    //
                    context.drawImage(previewVideo, backgroundPositionX, backgroundPositionY,
                        thumbnailWidth, thumbnailHeight);

                    //
                    x++;

                    // removing duplicate events
                    previewVideo.removeEventListener('canplay', event);

                    // 
                    resolve();
                };

                // 
                previewVideo.addEventListener('canplay', event);
            });


            // 1 thumbnail is generated completely
            count++;
        }

        // reset x coordinate
        x = 0;

        // increase y coordinate
        y++;

        // checking for overflow
        if (count > horizontalItemCount * verticalItemCount) {
            //
            count = 1;

            //
            x = 0;

            //
            y = 0;

            //
            id++;
        }

    }
    
    // looping through thumbnail list to update thumbnail
    thumbnails.forEach(function (item) {
        // converting canvas to blob to get short url
        item.canvas.toBlob(blob => item.data = URL.createObjectURL(blob), 'image/jpeg');

        // deleting unused property
        delete item.canvas;
    });



    console.log('done...');
});