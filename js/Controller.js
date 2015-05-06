
var Controller = {};

(function (C, cjs) {

    /**
     *
     * @constructor
     */
    (C.ControlBtn = function () {
        lib.ControlBtn.apply(this, arguments);
        this.gotoAndStop(0);
    }).prototype = new lib.ControlBtn();

    C.ControlBtn.prototype.setPlay = function () {
        this.gotoAndStop(0);
    };
    C.ControlBtn.prototype.setPause = function () {
        this.gotoAndStop(1);
    };
    C.ControlBtn.prototype.setReplay = function () {
        this.gotoAndStop(2);
    };
    C.ControlBtn.prototype.setStop = function () {
        this.gotoAndStop(3);
    };


    /**
     *
     * @constructor
     */
    (C.PlayBar = function (w) {

        const MAX_WIDTH = w;
        //cjs.Container.apply(this, arguments);

        this.cursor = "pointer";
        this.clickPosition = 0;

        this.bgBar = new cjs.Shape();
        this.bgBar.name = "PLAY_BAR";
        this.bgBar.graphics.beginFill('#444444').drawRect(0, 0, MAX_WIDTH, 3);
        this.bgBar.setBounds(0, 0, MAX_WIDTH, 10);
        this.addChild(this.bgBar);

        this.loadedBar = new cjs.Shape();
        this.loadedBar.mouseEnabled = false;
        this.loadedBar.graphics.beginFill('#707070').drawRect(0, 0, MAX_WIDTH, 3);
        this.loadedBar.scaleX = 0.3;
        this.addChild(this.loadedBar);

        this.progressBar = new cjs.Shape();
        this.progressBar.mouseEnabled = false;
        this.progressBar.graphics.beginFill('#13DA62').drawRect(0, 0, MAX_WIDTH, 3);
        this.progressBar.scaleX = 0.2;
        this.addChild(this.progressBar);

        var that = this;
        this.bgBar.addEventListener("mouseover", function (e) {
            cjs.Tween.get(that, {}).to({scaleY:2, y:-3}, 200);
        });

        this.bgBar.addEventListener("mouseout", function (e) {
            cjs.Tween.get(that, {}).to({scaleY:1, y:0}, 200);
        });
    }).prototype = new cjs.Container();

    C.PlayBar.prototype.updateLoadedBar = function (ratio) {
        this.loadedBar.scaleX = ratio;
    };

    C.PlayBar.prototype.updateProgressBar = function (ratio) {
        this.progressBar.scaleX = ratio;
    };

    /**
     *
     */
    (C.CaptionControlView = function () {
        this.initialize();

        this.list = null;

        this.currentTxt = new cjs.Text("자막", "14px Arial", "#ffffff");
        this.addChild(this.currentTxt);

        var that = this;
        this.isShow = false;
        this.toggleBtn = new lib.McArraw();
        this.toggleBtn.gotoAndStop(1);
        this.toggleBtn.x = 60;
        this.toggleBtn.addEventListener("click", function (e) {
            that.toggleView();
        })

        this.addChild(this.toggleBtn);

    }).prototype = new cjs.Container();

    C.CaptionControlView.prototype.setList = function (arr) {

        var that = this;

        var shMask = new cjs.Shape();
        shMask.graphics.beginFill("#00FF00").drawRect(-100, -200, 200, 200);


        this.list = new cjs.Container();
        this.list.x = -100;


        this.settingPanel = new lib.McCaptionOptionView();
        this.settingPanel.y = 10;


        var shBG = new cjs.Shape();
        shBG.graphics.beginFill("#000000").drawRect(0, 0, 150, 210);
        shBG.alpha = 0.9;

        this.list.addChild(shBG);


        this.list.addChild(this.settingPanel);
        this.list.mask = shMask;
        this.addChild(this.list);

        this.settingPanel.insTextSizeUp.addEventListener("click", function (e) {
            console.log("1");
        });
        this.settingPanel.insTextSizeDown.addEventListener("click", function (e) {
            console.log("2");
        });

        this.settingPanel.insCaptionOnOff.gotoAndStop(1);
        this.settingPanel.insCaptionOnOff.addEventListener("click", function (e) {
            console.log("3");
        });
        this.settingPanel.insBackgroundOnOff.addEventListener("click", function (e) {
            console.log("4");
        });

        var arr = [
            new CaptionVO("자막1"),
            new CaptionVO("자막2"),
            new CaptionVO("자막3"),
            new CaptionVO("자막4")
        ];

        for (var i = 0; i < arr.length; i++) {
            var item = new C.CaptionItem(arr[i]);
            item.x = 100;
            item.y = 10 + (this.settingPanel.getBounds().height + i * 20);
            (function (m) {
                m.addEventListener("click", function (e) {
                    console.log("click2 : " + m.vo.sLabel);
                    that.currentTxt.text = m.vo.sLabel;
                    that.toggleView();
                });
            }(item));
            this.list.addChild(item);
        }
    };


    C.CaptionControlView.prototype.toggleView = function () {

        this.isShow = !this.isShow;

        if (this.isShow === true) {
            this.toggleBtn.gotoAndStop(2);
            this.showList();
        } else {
            this.toggleBtn.gotoAndStop(1);
            this.hideList();
        }
    };

    C.CaptionControlView.prototype.showList = function () {

        console.log(this.list.getBounds().height);
        cjs.Tween.get(this.list, {}).to({y: -this.list.getBounds().height-20}, 200);
    };

    C.CaptionControlView.prototype.hideList = function () {
        cjs.Tween.get(this.list, {}).to({y: 0}, 200);
    };


    var CaptionVO = function (sLabel, sUrl) {
        this.sLabel = sLabel;
        this.sUrl = sUrl || "";
    };

    /**
     *
     * @param {CaptionVO} vo
     * @constructor
     */
    (C.CaptionItem = function (vo) {
        this.initialize();
        this.vo = vo;
        this.txt;
        this.init();

    }).prototype = new cjs.Container();

    C.CaptionItem.prototype.init = function () {

        var that = this;
        this.txt = new cjs.Text(this.vo.sLabel, "14px Arial", "#ffffff");
        this.txt.x = 0;
        this.addChild(this.txt);

        this.addEventListener("mouseover", function (e) {
            console.log("over : ");
            that.txt.color = "#ff0000";
        });
        this.addEventListener("mouseout", function (e) {
            console.log("out : ");
            that.txt.color = "#ffffff";
        });
        this.addEventListener("click", function (e) {
            //console.log("click : "+that.vo.nHeight);
        });

        var bounds = this.getBounds();

        this.shape = new cjs.Shape();
        this.shape.graphics.beginFill("#000000").drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
        this.shape.alpha = 0.2;
        //this.shape.setTransform(10, 10);
        this.addChild(this.shape);

        console.log();
    };


    /**
     * @class
     * @extends cjs.Container
     * @constructor
     */
    (C.ResolutionListView = function () {
        this.initialize();
        this.list = null;

        this.currentTxt = new cjs.Text("해상도", "14px Arial", "#ffffff");
        this.addChild(this.currentTxt);

        this.shMask = new cjs.Shape();
        this.shMask.graphics.beginFill("#00FF00").drawRect(0, -150, 100, 150);
        //this.addChild(this.shMask);

        var that = this;
        this.isShow = false;

        this.toggleBtn = new lib.McArraw();
        this.toggleBtn.gotoAndStop(1);
        this.toggleBtn.x = 60;
        this.toggleBtn.addEventListener("click", function (e) {
            console.log("a");
            that.toggleView();
        });
        this.addChild(this.toggleBtn);
    }).prototype = new cjs.Container();

    C.ResolutionListView.prototype.setList = function (arr) {

        var that = this;
        this.list = new cjs.Container();
        this.list.mask = this.shMask;
        this.addChild(this.list);

        var shBG = new cjs.Shape();
        shBG.graphics.beginFill("#000000").drawRect(0, 0, 80, 130);
        shBG.alpha = 0.9;

        this.list.addChild(shBG);


        for (var i = 0; i < arr.length; i++) {
            var item = new C.ResolutionItem(arr[i]);
            item.x = 10;
            item.y = 12 + (i * 20);
            (function (m) {
                m.addEventListener("click", function (e) {
                    console.log("click2 : " + m.vo.sLabel);
                    that.currentTxt.text = m.vo.sLabel;
                    that.toggleView();

                    m.dispatchEvent(new cjs.Event("selectedResolution", true));
                });
            }(item));
            this.list.addChild(item);
        }
    };

    C.ResolutionListView.prototype.toggleView = function () {

        this.isShow = !this.isShow;

        if (this.isShow === true) {
            this.toggleBtn.gotoAndStop(2);
            this.showList();
        } else {
            this.toggleBtn.gotoAndStop(1);
            this.hideList();
        }
    };

    C.ResolutionListView.prototype.showList = function () {

        console.log(this.list.getBounds().height);
        cjs.Tween.get(this.list, {}).to({y: -this.list.getBounds().height-20}, 200);
    };

    C.ResolutionListView.prototype.hideList = function () {
        cjs.Tween.get(this.list, {}).to({y: 0}, 200);
    };


    /**
     *
     * @param {ResolutionVO} resolutionVO
     * @constructor
     */
    (C.ResolutionItem = function (resolutionVO) {
        this.initialize();
        this.vo = resolutionVO;
        this.txt;
        this.init();

    }).prototype = new cjs.Container();

    C.ResolutionItem.prototype.init = function () {

        var that = this;
        this.txt = new cjs.Text(this.vo.sLabel, "14px Arial", "#ffffff");
        this.txt.x = 0;
        this.addChild(this.txt);

        if (this.vo.isHD) {
            var hdIcon = new lib.HDIcon();
            hdIcon.x = 50;
            hdIcon.y = 5;
            this.addChild(hdIcon);
        }

        this.addEventListener("mouseover", function (e) {
            that.txt.color = "#13da62";
        });
        this.addEventListener("mouseout", function (e) {
            that.txt.color = "#ffffff";
        });

        //var bounds = this.getBounds();
        //this.shape = new cjs.Shape();
        //this.shape.name = "selectedResolution";
        //this.shape.graphics.beginFill("#000000").drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
        //this.shape.alpha = 0.2;
        this.addChild(this.shape);
    };


    var ResolutionVO = function (nHeight, sUrl) {
        this.nHeight = nHeight;
        this.sLabel = nHeight + "p";
        this.sUrl = sUrl || "";
        this.isHD = nHeight >= 720;
    };


    /**
     *
     * @constructor
     */
    C.VolumeBtn = function () {
        lib.VoluemBtn.apply(this, arguments);
        this.setSpeaker();
    };

    cjs.extend(C.VolumeBtn, lib.VoluemBtn);

    C.VolumeBtn.prototype.setMute = function () {
        this.gotoAndStop(1);
    };

    C.VolumeBtn.prototype.setSpeaker = function () {
        this.gotoAndStop(0);
    };


    (C.View = function (w) {

        this.w = w || 1148;
        this.h = 40;
        this.initialize();

        var shBG = new cjs.Shape();
        shBG.graphics.beginFill("#000000").drawRect(0, 0, this.w, 40);
        shBG.alpha = 0.9;

        var ctrBtn = new C.ControlBtn();
        ctrBtn.x = 10;
        ctrBtn.y = 13;
        ctrBtn.addEventListener("click", function (e) {
            rmcPlayer.togglePause() ? ctrBtn.setPause() : ctrBtn.setPlay();
        });

        var volumeBtn = new C.VolumeBtn();
        volumeBtn.x = 50;
        volumeBtn.y = 13;
        volumeBtn.addEventListener("click", function (e) {
            rmcPlayer.toggleMute() ? volumeBtn.setMute() : volumeBtn.setSpeaker();
        });

        this.currentTimeTxt = new cjs.Text("00:00:00", "14px Arial", "#13da62");
        this.currentTimeTxt.x = 100;
        this.currentTimeTxt.y = 13;

        this.durationTimeTxt = new cjs.Text("00:00:00", "14px Arial", "#ffffff");
        this.durationTimeTxt.x = 150;
        this.durationTimeTxt.y = 13;

        this.resolutionListView = new C.ResolutionListView();
        this.resolutionListView.x = this.w - 300;
        this.resolutionListView.y = 13;

        var captionOptionView = new C.CaptionControlView();
        captionOptionView.x = this.w - 200;
        captionOptionView.y = 13;
        captionOptionView.setList();

        var expandBtn = new lib.ExpandBtn();
        expandBtn.x = this.w - 100;
        expandBtn.y = 13;
        new cjs.ButtonHelper(expandBtn, 0, 1, 2, false, new lib.ExpandBtn(), 3);
        expandBtn.addEventListener("click", function (e) {
            console.log("click : expandBtn");
            expandPlayer();
        });

        var fullScreenBtn = new lib.FullScreenBtn();
        fullScreenBtn.x = this.w - 50;
        fullScreenBtn.y = 13;
        new cjs.ButtonHelper(fullScreenBtn, 0, 1, 2, false, new lib.FullScreenBtn(), 3);
        fullScreenBtn.addEventListener("click", function (e) {
            console.log("click : fullScreenBtn");
            rmcPlayer.fullscreen();
        });

        this.playBar = new C.PlayBar(this.w);
        this.playBar.x = 0;
        this.playBar.y = 0;

        this.addChild(shBG, this.playBar, this.currentTimeTxt, this.durationTimeTxt, ctrBtn, volumeBtn, this.resolutionListView, captionOptionView, expandBtn, fullScreenBtn);

    }).prototype = new cjs.Container();

    C.View.prototype.showAni = function(){

        //this.alpha = 1;


        //cjs.Tween.get(this, {}).to({y: 0}, 200);
    };

    C.View.prototype.closeAni = function(){

        //this.alpha = 0;
        //cjs.Tween.get(this, {}).to({y: 200}, 200);
    };

    C.View.prototype.updateCurrentTime = function(time){
       this.currentTimeTxt.text = formatTimeTypeHour(time);
    };

    C.View.prototype.updatePlayBar = function(ratio){
        this.playBar.updateProgressBar(ratio);
    };

    C.View.prototype.updateLoadedBar = function(ratio){
        this.playBar.updateLoadedBar(ratio);
    }

    C.View.prototype.setDuration = function(time){
        this.durationTimeTxt.text = formatTimeTypeHour(time);
    };

    C.View.prototype.setResolutionList = function(arrList){

        var arr = [];
        for(var i=0; i<arrList.length; i++){

            arr.push(new ResolutionVO(arrList[i].height, arrList[i].source));
        }

        this.resolutionListView.setList(arr);
    };



})(Controller, createjs);


function formatTimeTypeHour( value )
{
    var time = Math.floor( value );
    var hour = Math.floor( time / 3600 );
    var min = Math.floor( ( time - hour*3600 ) / 60 );
    var sec = time % 60;

    var h = "";
    var m = "";
    var s = "";

    if( hour == 0 )
        h = "";
    else  if ( hour < 10 )
        h += "0" + hour + ":";
    else
        h += "" + hour + ":";

    if ( min < 10 )
        m += "0" + min;
    else
        m += "" + min;
    if ( sec < 10 )
        s += "0" + sec;
    else
        s += "" + sec;

    return h + m + ":" + s;
}




