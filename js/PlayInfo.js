var PlayInfo = function(prop) {
    this.coverURL = '';
    this.relationVideoURL = '';
    this.thumbnails = [];
    this.videos = [];
    this.streams = '';
    this.prop = prop;
    this.parseConfig();
    this.parseCookie();
};

PlayInfo.prototype = {

    /**
     * ÄíÅ°ÀÇ Á¤º¸¸¦ ²¨³» ÆÄ½Ì
     * @param res
     */
    parseCookie: function (res) {
        res = res || {};
    },

    parseConfig: function () {
    },

    loadInfo: function() {
        var root = this;

        if (this.prop.video.key === "") {
            this.loadCreateKey();
        }else
        {
            $.ajax({
                url:"http://"+(root.prop.debugIsRealID ? "":"dev-")+"global-nvapis.line.me/linetv/rmcnmv/vod_play_videoInfo.json?doct=json&devt=flash&cpt=ttml&cc=TH&lc=EN_US&videoId="+root.prop.video.id+"&key="+root.prop.video.key,
                success:function(data){
                    console.log(data);
                    root.parse(data);
                    $('#video').attr('src', root.videos[root.videos.length-1].source);
                    //$('#video').attr('type', "vnd.apple.mpegURL");
                    //$('#video').attr('src', root.streams.url);

                    console.log(root.streams);
                }
            });
        }
    },

    loadCreateKey: function() {
        var root = this;
        $.ajax({
            url: "http://serviceapi.rmcnmv.naver.com/flash/createInKey.nhn?vid=" + root.prop.video.id,
            success: function (data) {
                root.prop.video.key = $(data).find('Key').text();
                root.loadInfo();

            }
        });
    },

    parse: function (res) {
        this.coverURL = res.meta.cover.source;
        this.relationVideoURL = res.meta.relationVideo.source;
        this.thumbnails = res.thumbnails; // array, source, time
        this.videos = res.videos.list; // array, duration, height, source, width

        controllerView.setResolutionList(this.videos);
    }
};

