
var rmcPlayer,
    $videoIndex,
    $currentTime,
    $captionList0,
    $captionList1,
    $captionList2 ,
    $captionList3,
    $protocol,
    $initBufferTime,
    $playingBufferTime,
    $incBufferTime,
    $maxBufferTime,
    $pLang,
    $countryCode,
    $region,
    $ad_before,
    $ad_after,
    $ad_before_replay,
    $ad_after_replay,
    $auto_play,
    $video_id,
    $video_key,
    $playerKind,
    $useHardwareDecoder,
    $defaultResolution,
    $captionFont,
    $ad_url;

const COOKIE_NAME_RESOLUTION = 'LTV_DefaultResolution';
const COOKIE_NAME_EXPAND = "LTV_Expand";
const COOKIE_NAME_PLAY_TIME = "playTime";
const logParam = ["sid", "cc", "pv", "cc", "os", "stp", "ec", "du", "it", "stp", "u", "ctype", "prtc", "ct", "adli", "ql"];
const arrCheckList = ['auto_play', 'protocol', 'useHardwareDecoder', 'ad_before', 'ad_after', 'ad_before_replay', 'ad_after_replay', 'auto_play', 'captionList0', 'captionList1', 'captionList2', 'captionList3'];
const VIDEO_LIST = [new VideoVO("영상 (리얼서버-아웃키보유)", "2sec movie", "E2180B899C5773774FAF8BCD56F24A4E0B38", "V1212771475dc350af6d1e7e3a2ef2cdf8a66b65a76a7dfdd4d60e7e3a2ef2cdf8a66", "TH"),
    new VideoVO("영상 (임시-아웃키보유)", "5Hour movie", "BB7D53DFE2D2E882DE8B0FC3B833223888E9", "V128614a5e021d8609f832e9e13a379dd27c954f417528a9da5162e9e13a379dd27c9", "TH"),
    new VideoVO("영상 (임시-아웃키보유)", "Mens.Manual.2012", "3F781DC1B1BBB6C7633F20B7933A170CBA14", "V122a25033ff67d1572a912299b7d221a6b6acf85280a2995bd9b12299b7d221a6b6a", "TH"),
    new VideoVO("영상 (개발서버)", "input devID", "개발용 video ID를 입력하세요.", "", "KR", false),
    new VideoVO("영상 (개발서버)", "KPOP-릴리", "2E160DD135A9BEC1B44BC10964006B52B35C", "", "KR"),
    new VideoVO("영상 (개발서버)", "EXID updown", "60E53C1355FDEA6EC4CFA291A21DA430D5D2", "", "KR"),
    new VideoVO("영상 (개발서버)", "애니(자막있음)", "ADE295ED6C5D5C91ED5AC5D5DDB74ED9663A", "", "KR"),
    new VideoVO("영상 (리얼서버)", "input realID", "리얼용 video ID를 입력하세요.", "", "TH", false),
    new VideoVO("영상 (리얼서버)", "AOA뮤비", "B44EF1C5762C6D1022A7285572F2E8ADBC70", "", "TH"),
    //new VideoVO("영상 (리얼서버)", "Music Bank EP743", "211122C4CD4E10BE9CC8DED0B06BBC892E14", "", "TH"),
    //new VideoVO("영상 (리얼서버)", "Music Bank EP745", "E551CB730F9D0E4FFE17B316B8DB48EAD56B", "", "TH"),
    //new VideoVO("영상 (리얼서버)", "Music Bank EP746", "FF2C190B6E9FA429BC4E01D2991DD77D6E08", "", "TH"),
    //new VideoVO("영상 (리얼서버)", "Music Bank EP747", "02E02980F0A152B62117BBC72B7A66561CB9", "", "TH"),
    //new VideoVO("영상 (리얼서버)", "Music Bank EP748", "9EE63AF29887CCE934D2343B1734C0A7D68A", "", "TH"),
    //new VideoVO("영상 (리얼서버)", "Music Bank EP751", "10F1BD7CA5EE591C7925D43DC0665C57A1B9", "", "TH"),
    new VideoVO("영상 (리얼서버)", "Music Bank EP752", "9FE7A771B46D3A5621B0986FA578D6689ECF", "", "TH"),
    new VideoVO("영상 (리얼서버)", "Music Bank EP753", "139B4FBBBDD0AFF72CB2ACB9DC3074B7360C", "", "TH"),
    new VideoVO("영상 (리얼서버)", "Dream High EP08(테스트 자막지원)", "FB89B847CBBF0347398F9D6A553FBF3DD2BF", "", "TH"),
    new VideoVO("영상 (리얼서버)", "좌우사이즈이상한영상", "EE6007CAB65D155B2F0DA85F0A2F85AC73A5", "", "TH"),
    new VideoVO("영상 (리얼서버)", "요가 영상1", "3FB077E04A3936D7DDDCC3BFF7A3F1224A19", "", "TH"),
    new VideoVO("영상 (리얼서버)", "요가 영상2", "EE66DC69E9C87331C30D81E760F310062BC7", "", "TH"),
    new VideoVO("영상 (리얼서버)", "4K(대한민국1 - 일그러짐 현상)", "5BE69D48E10D2AEA605F343B1734C0A7D68A", "", "TH"),
    new VideoVO("영상 (리얼서버)", "4K(대한민국1)", "0FFE9364808D0F2577D271356ECCCE0CA94E", "", "TH"),
    new VideoVO("영상 (리얼서버)", "4K(대한민국1 - 720p은 유튜브 4k로 재생)", "0B8AB240F87AD0DC0AA1432639D638A3E7E2", "", "TH"),
    new VideoVO("영상 (리얼서버)", "4K(대한민국1 - 수요일QA", "B63B915F60EC8DE0F0C53D6E9C3671B7CFB9", "", "TH"),
    new VideoVO("영상 (리얼서버)", "4K(대한민국2)", "F07FF86FF99DE0442CB00648EBBBCAAE322F", "", "TH"),
    new VideoVO("영상 (리얼서버)", "4K(대한민국3)", "70AE4880486400C3F22B7D8B51013E778638", "", "TH"),
    new VideoVO("영상 (리얼서버)", "4K(결혼파티)", "3B418EED57D39752980C08BA95D58F5A04AF", "", "TH"),
    new VideoVO("영상 (리얼서버)", "4K(클럽파티)", "7D4C860C2399922D3DF7BED0FBF319748FDB", "", "TH"),
    new VideoVO("영상 (리얼서버)", "4K(공원촬영)", "94D4EFCB27FF5A584163E64E1E275AAC4E4B", "", "TH"),
    new VideoVO("영상 (리얼서버)", "4K(훌라우프댄스)", "1C43E05B5E536C46115DF221979F044124D5", "", "TH"),
    new VideoVO("영상 (리얼서버)", "4K(해변)", "659B83A9CE8C551F1714ACB9DC3074B7360C", "", "TH"),
    new VideoVO("영상 (리얼서버)", "4K(자연)", "22455C92DF01BF0CD6DD557196902CBE5C08", "", "TH"),
    new VideoVO("영상 (리얼서버)", "4K(뉴욕)", "6AE9AF98F9FF88346FD162EE1B296CDDB4EC", "", "TH"),
    new VideoVO("영상 (리얼서버)", "4K(요리)", "B4868F4F5CF8BCBEB4C8E300A9B7110B6DD1", "", "TH"),
];

function init(){
    $defaultResolution = getParameter('defaultResolution') || 480;
    $videoIndex = getParameter('videoIndex') || 11;
    $currentTime = getParameter('currentTime') || 0;
    $captionList0 = getParameter('captionList0') || "false";
    $captionList1 = getParameter('captionList1') || "false";
    $captionList2 = getParameter('captionList2') || "false";
    $captionList3 = getParameter('captionList3') || "false";
    $protocol = getParameter('protocol') || "false";
    $initBufferTime = getParameter('initBufferTime') || 3;
    $playingBufferTime = getParameter('playingBufferTime') || 5;
    $incBufferTime = getParameter('incBufferTime') || 2;
    $maxBufferTime = getParameter('maxBufferTime') || 15;
    $pLang = getParameter('pLang') || "KO_KR";
    $countryCode = getParameter('countryCode') || "EMPTY";
    $region = getParameter('region') || "TH";
    $ad_before = getParameter('ad_before') || "false";
    $ad_after = getParameter('ad_after') || "false";
    $ad_before_replay = getParameter('ad_before_replay') || "false";
    $ad_after_replay = getParameter('ad_after_replay') || "false";
    $auto_play = getParameter('auto_play') || "true";
    $video_id = getParameter('video_id') || VIDEO_LIST[$videoIndex].id;
    $video_key = getParameter('video_key') || "";
    $playerKind = getParameter('playerKind') || 0;
    $useHardwareDecoder = getParameter('useHardwareDecoder') || "false";
    $ad_url = getParameter('ad_url') ? unescape(getParameter('ad_url')) : "http://ad-cpv-sg.line.me/adshow?unit=1187C&cp=594&st=643&chl=fncenter&cat=ARTIS&cl=225055&svc=linetv&cc=N&ctry=TH";
    $captionFont = getParameter('captionFont') ? unescape(getParameter('captionFont')) : "";

    if ($region == "KR")
        rmc.player.env.flash.region.ASIA.api = "http://dev-global-nvapis.line.me/linetv/rmcnmv/vod_play_videoInfo.json";

    var cookiePlayTime = $.cookie(COOKIE_NAME_PLAY_TIME);

    if (Boolean(cookiePlayTime)) {
        var arrCookiePlayTime = cookiePlayTime.split(',');
        for (var i = 0; i < VIDEO_LIST.length; i++) {
            var vo = VideoVO(VIDEO_LIST[i]);
            vo.startPlayTime = arrCookiePlayTime[i];
        }
    }

    /***********************************************
     * 키보드 이벤트
     ************************************************/

    $("#video_id").keyup(function(e){
        if (e.which ===  13)
            reflashBtn();
    })

    $("#timeSeekNum").keyup(function(e){
        if (e.which ===  13) {
            controlBtn('timeSeek');
        }
    })
    $("#ratioSeekNum").keyup(function(e){
        if (e.which ===  13)
            controlBtn('ratioSeek');
    })

    /***********************************************
     * 초기 화면 세팅
     ************************************************/

    // [질문] document.getElementById("player") 를 jQuery로 어떻게 변경하는가?
    // 플레이어 표시

    if ($playerKind == 0) {
        var playerObj = rmc.player.create(document.getElementById("player"), "TH", $pLang, getPlayerProperties());
        rmcPlayer = rmc.player.FlashObject.find(playerObj.player.properties.id);
    }else{

        var str = "<video id='video' controls='' width='0px' height='0px'><source src='' type='video/mp4'/></video>";
        str += "<canvas id='canvas' width='1148px' height='646px' style='position: absolute; left: 70; top: 80; z-index: 0;'>Canvas not supported</canvas>";
        str += "<canvas id='controller' width='1148px' height='646px' style='position: absolute; left: 70; top: 80; z-index: 1;'>Canvas not supported</canvas>";

        $("#player").html(str);

        rmcPlayer = new HTML5Player(document.getElementById('canvas'), document.getElementById('video'), document.getElementById('controller'), getPlayerProperties());
    }

    // 시네마 모드 플레이어 표시 유무
    if ($.cookie(COOKIE_NAME_EXPAND) == "true")
        $('#clip_end').addClass('cinema');

    // 우측 영상 목록 표시
    $("#videoList").append(getVideoListInnerHTMLText());

    // 라디오 선택 항목
    $("[name=video_id_list][value="+$videoIndex+"]").attr('checked', true);
    $("[name=pLang][value="+$pLang+"]").attr('checked', true);
    $("[name=countryCode][value="+$countryCode+"]").attr('checked', true);
    $("[name=defaultResolution][value="+$defaultResolution+"]").attr('checked', true);
    $("[name=playerKind]").eq($playerKind).attr('checked', true);

    // 체크 항목
    $("[name=video_id]").attr('value', $video_id);
    $("[name=video_key]").attr('value', $video_key);
    $("[name=initBufferTime]").attr('value', $initBufferTime);
    $("[name=playingBufferTime]").attr('value', $playingBufferTime);
    $("[name=incBufferTime]").attr('value', $incBufferTime);
    $("[name=maxBufferTime]").attr('value', $maxBufferTime);
    $("[name=ad_url]").attr('value', $ad_url);
    $("[name=captionFont]").attr('value', $captionFont);

    // 체크 메뉴 표시
    var arrCheckVar = [$auto_play, $protocol, $useHardwareDecoder, $ad_before, $ad_after, $ad_before_replay, $ad_after_replay, $auto_play, $captionList0, $captionList1, $captionList2, $captionList3];
    for(var i=0; i<arrCheckList.length; i++)
        $("[name=" + arrCheckList[i] + "]").attr("checked", arrCheckVar[i] == 'true');
}

/*************************************************
 * SWF Player --> JS 호출함수
 **************************************************/

function reloadPage() {
    document.location.reload();
}

function playRelationVideo(clipNo) {
    location.href = 'http://tv.line.me/v/' + clipNo;
}

function setDefaultResolution(resolution) {
    $.cookie(COOKIE_NAME_RESOLUTION, resolution);
}

function clickAdvertisement(clickPath) {
    window.open(clickPath, '_blank');
}

function expandPlayer(isExpand) {
    $.cookie(COOKIE_NAME_EXPAND, isExpand);
    $("#clip_end").toggleClass('cinema');
}

function licensePopup() {}

function onFlashEvent(event) {}

function debugLogViewer(log)
{
    var htmlText = "";
    var obj = $.parseJSON(log)[0];

    for( var i=0; i < logParam.length; i++)
    {
        var strParam = logParam[i];
        var paramInfo = obj[strParam];

        if (paramInfo)
        {
            if (strParam == "adli" || strParam == "ql") {
                for (var j = 0; j < paramInfo.length; j++) {
                    var gql = paramInfo[j];

                    if (strParam == "ql") {
                        htmlText += "<br>"
                        htmlText += "응답시간(" + (gql.qit / 1000).toFixed(1) + "초), ";
                        htmlText += "버퍼횟수(" + gql.bc + "), ";
                        htmlText += "누적버퍼(" + (gql.bt / 1000).toFixed(1) + "초), ";
                        htmlText += "시청시간(" + (gql.wt) / 1000 + "초), ";
                        htmlText += "화질(" + gql.q + "), ";
                        htmlText += "시킹지점(" + gql.sp + ")";

                    } else if (strParam == "adli") {
                        htmlText += "<br>광고 전/후(" + gql.adt + "), 스킵(" + gql.ads + "), 이탈(" + gql.adl + ")";
                    }
                }
            } else {
                htmlText += strParam + "(" + paramInfo + "), ";
            }
        }
    }

    $("#logViewer").html(htmlText);
}

function debugVideoState(state){
    $('#playStateInfo').attr("value", state);

    if (state === "play" && $currentTime > 0)
        rmcPlayer.timeSeek($currentTime);
}

function debugPlayerInfo(strInfo){
    $('#playerInfo').attr("value", strInfo);
}


function debugVideoPlayTime(time){
    $('#playTimeInfo').attr("value", time.toFixed(2));
}

/*************************************************
 * 화면 UI 구성
 **************************************************/

function getVideoListInnerHTMLText() {

    var htmlText = "";
    var kindName = "";

    for(var i=0; i<VIDEO_LIST.length; i++){
        if (VIDEO_LIST[i].kind != kindName)
        {
            kindName = VIDEO_LIST[i].kind;
            htmlText += '<br><strong>'+kindName+'</strong><br>';
        }
        htmlText += '<label><input onchange="onChangeVID(this);" type="radio" name="video_id_list" value="' + i + '" >' + VIDEO_LIST[i].title + '</label>';
        htmlText += '<br>';

    }
    return htmlText;

}

/*************************************************
 * 이벤트
 **************************************************/

// 영상 목록 클릭했을때
function onChangeVID(input){

    var vo = VIDEO_LIST[input.value];

    $videoIndex = input.value;
    $region = vo.region;
    $video_id = vo.id;
    $video_key = vo.key;

    $('#video_id').attr("value", $video_id);
    $('#video_key').attr("value", $video_key);

    if (vo.isReflash)
        reflashBtn();
}

// 영상 컨트롤 버튼 클릭했을때
function controlBtn(value){

    var state = $('#playStateInfo').attr("value");

    switch(value)
    {
        case "play": rmcPlayer.playVideo(); break;
        case "pause": rmcPlayer.pauseVideo(); break;
        case "close": rmcPlayer.closeVideo(); break;
        case "ADskip": rmcPlayer.adSkip(); break;
        case "time-100": rmcPlayer.timeSeek(-100, true); break;
        case "time+100": rmcPlayer.timeSeek(100, true); break;
        case "timeSeek":
            $currentTime = $('#timeSeekNum').prop("value");

            if (state === "play") {
                rmcPlayer.timeSeek($currentTime);
            }else {
                rmcPlayer.playVideo(); // 이후 재생되면 debugVideoState함수를 통해 currentTime위치로 시킹됨
            }

            break;
        case "ratioSeek":
            rmcPlayer.ratioSeek($('#ratioSeekNum').prop("value")); break;
        case "toggleMute": rmcPlayer.toggleMute(); break;
        case "togglePause": rmcPlayer.togglePause(); break;
        case "fullscreen": rmcPlayer.fullscreen(); break;
        case "time":
            var arrTime = rmcPlayer.getVideoTimes();
            $('#timeInfo').attr("value", arrTime[0].toFixed(1) +" / "+arrTime[1].toFixed(1));
            break;
    }
}

// 각종 설정 클릭했을때
function onChangeInfo(obj){

    switch(obj.name)
    {
        case "auto_play":  $auto_play = obj.checked; break;
        case "ad_before": $ad_before = obj.checked; break;
        case "ad_after": $ad_after = obj.checked; break;
        case "ad_before_replay": $ad_before_replay = obj.checked; break;
        case "ad_after_replay": $ad_after_replay = obj.checked; break;
        case "pLang": $pLang = obj.value; break;
        case "countryCode": $countryCode = obj.value; break;
        case "initBufferTime": $initBufferTime = obj.value; break;
        case "playingBufferTime": $playingBufferTime = obj.value; break;
        case "incBufferTime": $incBufferTime = obj.value; break;
        case "maxBufferTime": $maxBufferTime = obj.value; break;
        case "defaultResolution": $defaultResolution = obj.value; break;
        case "ad_url": $ad_url = obj.value; break;
        case "protocol": $protocol = obj.checked; break;
        case "playerKind": $playerKind = obj.value; break;
        case "useHardwareDecoder": $useHardwareDecoder = obj.checked; break;
        case "captionList0": $captionList0 = obj.checked; break;
        case "captionList1": $captionList1 = obj.checked; break;
        case "captionList2": $captionList2 = obj.checked; break;
        case "captionList3": $captionList3 = obj.checked; break;

    }
}

/*************************************************
 * 기타
 **************************************************/

function reflashBtn(isCurrentPlayTime){

    $currentTime = isCurrentPlayTime ? rmcPlayer.getVideoTimes()[0].toFixed(0) : 0;

    var param = "?pLang=" + $pLang+
        "&region=" + $region+
        "&countryCode=" + $countryCode+
        "&ad_before=" + $ad_before+
        "&ad_after=" + $ad_after+
        "&ad_before_replay=" + $ad_before_replay+
        "&ad_after_replay=" + $ad_after_replay+
        "&auto_play=" + $auto_play+
        "&video_id=" + $("[name=video_id]").prop("value")+
        "&video_key=" + $("[name=video_key]").prop("value")+
        "&initBufferTime=" + $initBufferTime+
        "&playingBufferTime=" + $playingBufferTime+
        "&incBufferTime=" + $incBufferTime+
        "&maxBufferTime=" + $maxBufferTime+
        "&protocol=" + $protocol+
        "&captionList0=" + $captionList0+
        "&captionList1=" + $captionList1+
        "&captionList2=" + $captionList2+
        "&captionList3=" + $captionList3+
        "&videoIndex=" + $videoIndex+
        "&currentTime=" + $currentTime+
        "&defaultResolution=" + $defaultResolution+
        "&playerKind=" + $playerKind+
        "&useHardwareDecoder=" + $useHardwareDecoder+
        "&captionFont=" + $("[name=captionFont]").prop("value")+
        "&ad_url=" + escape($ad_url);

    $(location).attr('href', "lineTvTest.html"+param);
}

// 영상 객체
function VideoVO(kind, title, id, key, region, isReflash){
    this.kind = kind;
    this.title = title;
    this.id = id;
    this.key = key;
    this.region = region;
    this.isReflash = isReflash || true;
    this.startPlayTime = 0;
}

function getPlayerProperties() {
    var prop = rmc.player.getDefaultProperties();

    if ($video_key == "") {
        prop.debugVID = $video_id;
        prop.debugIsRealID = $region == "TH";
    }

    prop.debugIsWebTestMode = true;
    prop.debugIsProtocolPD = $protocol;
    prop.debugUseHardwareDecoder = $useHardwareDecoder;
    prop.debugCaptionFont = $captionFont;
    prop.debugCaptionList = $captionList0 + "/" + $captionList1 + "/" + $captionList2 + "/" + $captionList3;
    prop.initBufferTime = $initBufferTime;
    prop.countryCode = $countryCode;
    prop.playingBufferTime = $playingBufferTime;
    prop.incBufferTime = $incBufferTime;
    prop.maxBufferTime = $maxBufferTime;
    prop.video = {id: $video_id, key: $video_key};
    prop.autoPlay = $auto_play;
    prop.showRelatieMovie = true;
    prop.callback = onFlashEvent;
    prop.poster = {url: "", resizable: true};
    prop.nsc = 'test.linetv.all';
    prop.defaultResolution = $.cookie(COOKIE_NAME_RESOLUTION) || $defaultResolution;
    prop.controls = {
        visible: {subtitles: true, expand: true},
        clicked: {subtitles: true, expand: ($.cookie(COOKIE_NAME_EXPAND) == "true")}
    };
    prop.customSettings = {useCustom: true, flash: {wmode: "opaque"}};
    prop.ad = {
        advertiseInfo: '[{"type":"pre","exposure":' + $ad_before + ',"replayExposure":' + $ad_before_replay + '},{"type":"post","exposure":' + $ad_after + ',"replayExposure":' + $ad_after_replay + '}]',
        advertiseUrl: $ad_url
    };

    return prop;
}

function getParameter(param) {
    var returnValue;
    var url = location.href;
    var parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');
    for (var i = 0; i < parameters.length; i++) {
        var varName = parameters[i].split('=')[0];
        if (varName.toUpperCase() == param.toUpperCase()) {
            returnValue = parameters[i].split('=')[1];
            returnValue = decodeURIComponent(returnValue);

            if (Boolean(returnValue) && returnValue !== "undefined")
                return returnValue;
            else
                return null;
        }
    }
}
