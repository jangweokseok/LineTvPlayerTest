var AdInfo = function(ad) {
    var ex = $.parseJSON(ad.advertiseInfo);
    var arrExposure = [ex[0].exposure, ex[1].exposure, ex[0].replayExposure, ex[1].replayExposure];

    return {
        isPlay: arrExposure[0],
        infoUrl: ad.advertiseUrl,
        movieUrl: '',

        check: function() {
            if (this.isPlay === true) {
                this.loadInfo();
                return true;
            }else{
                return false;
            }
        },

        loadInfo: function() {
            var root = this;
            $.ajax({
                url:this.infoUrl,
                success:function(data){
                    root.parse(data);
                    $('#video').attr('src', root.movieUrl);
                }
            });
        },

        parse: function(xml) {
            var xmlDoc = $.parseXML(xml),
                $xml = $( xmlDoc );
            this.movieUrl = $xml.find("MediaFile[height=720]").text();
        }
    };
};
