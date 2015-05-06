
var controllerView, controllerCanvas, stage, exportRoot;

function handleFileLoad(evt) {
    if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
}

function handleComplete() {
    exportRoot = new lib.test();

    stage = new createjs.Stage(canvas);

    stage.addChild(exportRoot);
    stage.update();
    stage.enableMouseOver();

    createjs.Ticker.setFPS(lib.properties.fps);
    createjs.Ticker.addEventListener("tick", stage);

    initMain();
}


function initLoadResouces(callComplete){

    var loader = new createjs.LoadQueue(true);
    loader.addEventListener("fileload", function (evt){
        if (evt.item.type == "image"){
            images[evt.item.id] = evt.result;
        }
    });

    loader.addEventListener("complete", callComplete);
    loader.loadManifest(lib.properties.manifest);
}

function HTML5Player(canvas, video, controllerCanvas, prop){

    const STATE_AD_PREV = "1";
    const STATE_MOVIE_PLAY = "2";
    const STATE_AD_NEXT = "3";

    var playerState = STATE_AD_PREV,
        oPlayInfo = new PlayInfo(prop),
        adInfo = new AdInfo(prop.ad),
        context = canvas.getContext('2d');

    initLoadResouces(function (){

        stage = new createjs.Stage(controllerCanvas);
        stage.update();
        stage.enableMouseOver();

        createjs.Ticker.setFPS(lib.properties.fps);
        createjs.Ticker.addEventListener("tick", stage);

        controllerView = new Controller.View();
        controllerView.x = 0;
        controllerView.y = 610;
        controllerView.addEventListener("click", function(e){

            switch(e.target.name)
            {
                case "PLAY_BAR":
                    rmcPlayer.timeSeek( video.duration * e.localX / e.target.getBounds().width);
                    break;
                case "selectedResolution":
                    $('#video').attr('src', e.target.parent.vo.sUrl);
                    break;
            }
        }, true);

        var bg = new createjs.Shape();
        bg.graphics.beginFill("#CCCCCC").drawRect(0, 0, 1000, 600);
        bg.alpha = 0;

        stage.addChild(bg, controllerView);
        oPlayInfo.loadInfo();
    });





    //-----------------------------------------------
    // Video 객체 이벤트
    //-----------------------------------------------
    video.addEventListener('loadedmetadata', function(){

        var duration = video.duration.toFixed(1);
        var videoWidth = video.videoWidth;
        var videoHeight = video.videoHeight;
        this.play();

        video.currentTime = $currentTime;
        window.requestNextAnimationFrame(animate);
        controllerView.setDuration(video.duration);
    });

    video.addEventListener('progress', function() {

        var percent = null;
        // FF4+, Chrome
        if (video && video.buffered && video.buffered.length > 0 && video.buffered.end && video.duration) {
            percent = video.buffered.end(0) / video.duration;
        }
        // Some browsers (e.g., FF3.6 and Safari 5) cannot calculate target.bufferered.end()
        // to be anything other than 0. If the byte count is available we use this instead.
        // Browsers that support the else if do not seem to have the bufferedBytes value and
        // should skip to there. Tested in Safari 5, Webkit head, FF3.6, Chrome 6, IE 7/8.
        else if (video && video.bytesTotal != undefined && video.bytesTotal > 0 && video.bufferedBytes != undefined) {
            percent = video.bufferedBytes / video.bytesTotal;
        }

        if (percent !== null)
            percent = Math.min(1, Math.max(0, percent));

        debugVideoPlayTime(video.currentTime);
        controllerView.updatePlayBar(video.currentTime/video.duration);
        controllerView.updateLoadedBar(percent);
    }, false);

    video.addEventListener('ended', function(data){
        console.log("ended", playerState);

        switch (playerState)
        {
            case STATE_AD_PREV:
                playerState = STATE_MOVIE_PLAY;
                $('#video').attr('src', oPlayInfo.videos[4].source);
                break;
            case STATE_MOVIE_PLAY:
                playerState = STATE_AD_NEXT;
                adInfo.check(); // 후 광고 체크
                break;
            case STATE_AD_NEXT:
                // 관련 영상 표시
                break;
        }

    }, false);

    function animate(){
        var ratio = Math.min(canvas.width/video.videoWidth, canvas.height/video.videoHeight);
        var showWidth = Math.floor(video.videoWidth * ratio);
        var showHeight = Math.floor(video.videoHeight * ratio);

        if(!video.ended){
            context.drawImage(video, (canvas.width-showWidth)/2, (canvas.height-showHeight)/2, showWidth, showHeight);
            window.requestNextAnimationFrame(animate);
        }

        controllerView.updateCurrentTime(video.currentTime);
    }

    return {

        playVideo: function () {
            video.play();
        },

        pauseVideo: function () {
            video.pause();
        },

        closeVideo: function () {
            video.currentTime = video.duration - 0.01;
        },

        adSkip: function () {
            video.currentTime = video.duration - 0.01;
        },

        timeSeek: function (time, isRelatively) {

            if (isRelatively === true)
                video.currentTime += time;
            else
                video.currentTime = time;
        },

        ratioSeek: function (ratio) {
            video.currentTime = video.duration * ratio / 100;
        },

        toggleMute: function () {
            video.muted = !video.muted;
            return video.muted;
        },

        togglePause: function () {
            video.paused ? video.play() : video.pause();
            return video.paused;
        },

        fullscreen: function () {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.mozRequestFullScreen) {
                video.mozRequestFullScreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
        },

        getVideoTimes: function () {
            return [video.currentTime, video.duration];
        }
    };
}
