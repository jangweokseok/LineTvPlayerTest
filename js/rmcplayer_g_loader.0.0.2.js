/*
 * RMC Player Loader
 * Global
 */

if (window.rmc == undefined) {
	window.rmc = {"player":{}};
}

rmc.player.types = {
		"AUTO":"auto", "FLASH":"flash", "HTML5_PC":"html5_pc", "HTML5_MOBILE":"html5_mo"
}

rmc.player.getDefaultProperties = function getDefaultProperties() {
	var properties = {
			"id":null
			,"type":rmc.player.types.AUTO
			, "width":0
			, "height":0
			, "playerWidth":0
			, "playerHeight":0
			, "controls": {
				"visible":{
					"script":false
					, "resolutionSelector":true
					, "logo":false
					, "setting":false
					, "fullscreen":true
					, "expand":false
					, "subtitles":true
					, "scrap":false
				}
				, "clicked" : {
					"expand":false
					,"subtitles":false
				}
			}
			, "autoPlay":false
			, "isPullingDownResolution":false
			, "timeNoticeDisplayed":4
			, "initBufferTime":3
			, "playingBufferTime":5
			, "incBufferTime":0
			, "maxBufferTime":15
			, "isd":0
			, "showRelativeMovie":true
			, "defaultResolution":null
			, "video":{
				"id":null
				, "key":null
				, "outKeyMode":false
				, "protocol":"http"
			}
			, "error":{"isError":false, "message":null}
			, "ncs":null
			, "beginTime":0
			, "ad":{"advertiseInfo":null, "advertiseUrl":null, "adMeta":null, "adAPI":null}
			, "volume":0.5
			, "callback":null
			, "externalData":null
			, "jsCallable":false
			, "poster":{
				"url":null
				,"resizable":true
			}
			, "customSettings" : {
				"useCustom":false
				, "flash":{
					"wmode":"window"
				}
			}
		};
	return properties;
}


rmc.player.count = 0;

rmc.player.generateId = function generateId() {
	var tmpId = "rmcPlayer_";
	tmpId = tmpId + Math.round( Math.random() * 10000 );
	return tmpId;
}

rmc.player.create = function create(targetObj, regionCode, localeCode, properties) {
	var loadPlayer = function loadPlayer(playerEle, properties) {
		if (playerEle) {
			if (playerEle.player && playerEle.player.properties) {
				releasePlayer(playerEle);
			}
			playerEle.player = {};
			playerEle.player.properties = properties;
			
			if (!regionCode) {
				regionCode = "TH";
			} 
			
			if (!localeCode) {
				localeCode = "en_US";
			}
			
			playerEle.player.regionCode = regionCode;
			playerEle.player.localeCode = localeCode;
			
			if (playerEle.player.properties.type == rmc.player.types.FLASH) {
				rmc.player.flash.load(playerEle);
			}
		}
		return playerEle;
	}
	
	var init = function init() {
		if (!properties) {
			properties = rmc.player.getDefaultProperties();
		}
		if (properties.type == rmc.player.types.AUTO) {
			properties.type = rmc.player.types.FLASH;
		}
		
		var rootEle = null;
		if (typeof targetObj == "object") {
			rootEle = targetObj
		} else if (typeof targetObj == "string") {
			if (document.getElementById(targetObj)) {
				rootEle = document.getElementById(targetObj);
			}
		}
		
		if (rootEle == null) {
			document.write("<div id='rmcPlayerRoot_" + rmc.player.count + "'></div>");
			rootEle = document.getElementById('rmcPlayerRoot_" + rmc.player.count + "');
			rmc.player.count++;
		} 
		
		properties.id = rmc.player.generateId();
		
		return loadPlayer(rootEle, properties);
	}
	
	return init();
};

if (!rmc.player.playerMap) {
	rmc.player.playerMap = {};
	rmc.player.setPlayer = function setPlayer(id, playerEle) {
		rmc.player.playerMap[id] = playerEle;
	}
	rmc.player.deletePlayer = function deletePlayer(value) {
		if (typeof value == "object" && rmc.player.playerMap[playerEle.id]) {
			rmc.player.playerMap[playerEle.id].innerHTML = "";
			delete rmc.player.playerMap[playerEle.id];
		}
	}
}

if (!rmc.player.event) {
	rmc.player.event = {};
	rmc.player.event.onFlashEvent = function onFlashEvent(name, flashId, data) {
		if (rmc.player.playerMap[flashId] && rmc.player.playerMap[flashId].player && rmc.player.playerMap[flashId].player.properties.callback) {
			rmc.player.playerMap[flashId].player.properties.callback(name, data);
		}
	}
}

rmc.player.flash = {};
rmc.player.flash.load = function load(playerEle) {
	var env = rmc.player.env.flash;
	var regionCode = playerEle.player.regionCode;
	var localeCode = playerEle.player.localeCode.toUpperCase();
	var area = env.regionSet[regionCode];
	
	if (playerEle.player.properties.customRegion) {
		if (playerEle.player.properties.customRegion.api) {
			env.region.GLOBAL.api = playerEle.player.properties.customRegion.api;
			env.region.LOCAL.api = playerEle.player.properties.customRegion.api;
			env.region.ASIA.api = playerEle.player.properties.customRegion.api;
		}
		if (playerEle.player.properties.customRegion.module) {
			env.region.GLOBAL.module = playerEle.player.properties.customRegion.module;
			env.region.LOCAL.module = playerEle.player.properties.customRegion.module;
			env.region.ASIA.module = playerEle.player.properties.customRegion.module;
		}
		
	}
	
	var getPlayUrl = function getPlayUrl() {
		var tmpUrl = "";
		var paramArr = [];
		var prop = playerEle.player.properties;
		if (env.region[area].isGlobal == true) {
			tmpUrl = env.region[area].api + "?"
			paramArr.push("videoId=" + prop.video.id);
		} else {
			tmpUrl = env.region[area].api + "/" + prop.video.id + "?";
		}
		paramArr.push("key=" + prop.video.key);
		if (prop.video.protocol) {
			paramArr.push("ptc=" + prop.video.protocol);
		}
		if (prop.externalData) {
			paramArr.push("ext=" + prop.externalData);
		}
		paramArr.push("doct=xml");
		paramArr.push("devt=flash");
		paramArr.push("cpt=ttml");

		paramArr.push("cc=" + regionCode);
		paramArr.push("lc=" + localeCode);
		
		return tmpUrl + paramArr.join("&");
	};
	var generateFlashParam = function generateFlashParam() {
		var param = {};
		var prop = playerEle.player.properties;
		param.lang = env.langSet[localeCode];
		/*param.vid = prop.video.id;
		if (prop.video.outKeyMode == false) {
			param.inKey = prop.video.key;
		} else {
			param.outKey = prop.video.key;
		}*/

		param.api = prop.debugApi || getPlayUrl();
		if (prop.error.isError == true) {
			param.ermsg = prop.error.message;
			return param;
		}
		if (prop.nsc) {
			param.nsc = prop.nsc;
		}
		param.__flashID = prop.id;
		param.isAutoPlay = prop.autoPlay;
		param.timeNoticeDisplayed = prop.timeNoticeDisplayed;
		param.initBufferTime = prop.initBufferTime;
		param.playingBufferTime = prop.playingBufferTime;
		param.incBufferTime = prop.incBufferTime;
		param.maxBufferTime = prop.maxBufferTime;
		param.isd = prop.isd;
		param.width = prop.playerWidth;
		param.height = prop.playerHeight;		
		if (prop.beginTime > 0) {
			param.beginTime = prop.beginTime;
		}
		if (prop.ad.advertiseUrl != null) {
			param.advertiseInfo = prop.ad.advertiseInfo;
			param.advertiseUrl = prop.ad.advertiseUrl;
		} else if (prop.ad.adMeta != null) {
			param.adMeta = prop.ad.adMeta;
			param.adAPI = prop.ad.adAPI;
		}
		
		if (prop.defaultResolution != null) {
			param.defaultResolution = prop.defaultResolution
		}

		param.countryCode = prop.countryCode;

		param.hasRelativeMovie = prop.showRelatieMovie;
		
		
		param.volume = prop.volume;
		param.callbackHandler = "onFlashEvent";
		//param.jsCallable = prop.jsCallable;
		if (JSON) {
			param.controls = JSON.stringify(prop.controls);
		}
		
		if (prop.poster.url != null) {
			param.coverImageURL = prop.poster.url;
			param.isResizableCoverImage = prop.poster.resizable;
		}

		param.debugIsWebTestMode = prop.debugIsWebTestMode;
		param.debugVID = prop.debugVID;
		param.debugCaptionFont = prop.debugCaptionFont;
		param.debugIsRealID = prop.debugIsRealID;
		param.debugIsProtocolPD = prop.debugIsProtocolPD;
		param.debugUseHardwareDecoder = prop.debugUseHardwareDecoder;
		param.debugCaptionList = prop.debugCaptionList;

		var flashParam = {};
		flashParam.flashVars = param;
		
		if (prop.customSettings.useCustom == true) {
			for (var name in prop.customSettings.flash){
				flashParam[name] = prop.customSettings.flash[name];
			}
		}
		
		return flashParam;
	};
	
	var playerModuleURL = env.region[area].module;
	var flashParam = generateFlashParam();
	var playerTag = rmc.player.FlashObject.generateTag(playerModuleURL, playerEle.player.properties.id, playerEle.player.properties.width, playerEle.player.properties.height, flashParam, null, rmc.player.FlashObject.getPlayerVersion());
	
	rmc.player.setPlayer(playerEle.player.properties.id, playerEle);
	playerEle.innerHTML = playerTag;
};


(function(W) {
	var sClassPrefix = 'F' + new Date().getTime()
			+ parseInt(Math.random() * 1000000), doc = W['document'], navi = W['navigator'], agent = navi.userAgent
			.toLowerCase(), bIE = agent.indexOf('msie') > -1
			|| agent.indexOf('trident') > -1, bFF = agent.indexOf('firefox') > -1, bChrome = agent
			.indexOf('chrome') > -1, FlashObject = {};
	var bind = function(oElement, sEvent, fHandler) {
		if (typeof oElement.attachEvent != 'undefined') {
			oElement.attachEvent('on' + sEvent, fHandler);
		} else {
			oElement.addEventListener(sEvent, fHandler, true);
		}
	}, wheelHandler = function(e) {
		e = e || window.event;
		var oEl = e.target || e.srcElement, nDelta = e.wheelDelta
				/ (bChrome ? 360 : 120), nX, nY, sMethod = RegExp.$2;
		if (!(new RegExp('(^|\b)' + sClassPrefix + '_([a-z0-9_$]+)(\b|$)', 'i')
				.test(oEl.className)))
			return;
		if (!nDelta)
			nDelta = -e.detail / 3;
		nX = 'layerX' in e ? e.layerX : e.offsetX;
		nY = 'layerY' in e ? e.layerY : e.offsetY;
		try {
			if (!oEl[sMethod](nDelta, nX, nY)) {
				if (e.preventDefault)
					e.preventDefault();
				else
					e.returnValue = false;
			}
		} catch (e) {
		}
	}, unloadHandler = function() {
		var i, o, k;
		obj = doc.getElementsByTagName('OBJECT');
		for (i = 0; o = obj[i]; i++) {
			for (k in o) {
				if (typeof o[k] == 'function') {
					try {
						o[k] = null;
					} catch (e) {
					}
				}
			}
		}
	};
	FlashObject.showAt = function(sDiv, sTag) {
		doc.getElementById(sDiv).innerHTML = sTag;
	};
	FlashObject.show = function(sURL, sID, nWidth, nHeight, oParam, sAlign,
			sFPVersion) {
		doc.write(FlashObject.generateTag(sURL, sID, nWidth, nHeight, oParam,
				sAlign, sFPVersion));
	};
	FlashObject.generateTag = function(sURL, sID, nWidth, nHeight, oParam,
			sAlign, sFPVersion) {
		nWidth = nWidth || '100%';
		nHeight = nHeight || '100%';
		sFPVersion = sFPVersion || '9,0,0,0';
		sAlign = sAlign || 'middle';
		var oOptions = FlashObject.getDefaultOption(), sClsID = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000', sCodeBase = 'http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version='
				+ sFPVersion, sStyle = 'position:relative !important;', sReservedName = " className style __flashID codebase classid class width height name src align id type object embed movie forwardInstall requireVersion ", sClassName = sClassPrefix, embedCode = [], k, v;
		
		if (oParam) {
			if (oParam.flashVars) {
				if (typeof oParam.flashVars == 'object') {
					var oObj = oParam.flashVars, s = '';
					for (k in oObj) {
						if (s != '') {
							s += '&';
						}
						v = oObj[k];
						switch (typeof v) {
						case 'string':
							s += k + '=' + encodeURIComponent(v);
							break;
						case 'number':
							s += k + '=' + encodeURIComponent(v.toString());
							break;
						case 'boolean':
							s += k + '=' + (v ? 'true' : 'false');
							break;
						}
					}
					oParam.flashVars = s;
				}
				oParam.flashVars += '&';
			} else {
				oParam.flashVars = '';
			}
			oParam.flashVars += '__flashID=' + sID;
			sStyle = oParam.style || sStyle;
			sClassName = oParam.className
					|| (sClassName + '_' + oParam.wheelHandler);
			for (k in oParam) {
				if ((new RegExp('\\b' + k + '\\b', 'i').test(sReservedName)))
					continue;
				oOptions[k] = oParam[k];
			}
		}
		if (bIE) {
			embedCode.push('<object classid="' + sClsID + '" codebase="'
					+ sCodeBase + '" style="' + sStyle + '" width="' + nWidth
					+ '" height="' + nHeight + '" id="' + sID + '" align="'
					+ sAlign + '" type="application/x-shockwave-flash">');
			embedCode.push('<param name="movie" value="' + sURL + '" />');
			for (k in oOptions) {
				embedCode.push('<param name="' + k + '" value="' + oOptions[k]
						+ '" />');
			}
			embedCode.push('</object>');
		} else {
			embedCode.push('<embed width="' + nWidth + '" height="' + nHeight
					+ '" name="' + sID + '" class="' + sClassName + '" style="'
					+ sStyle + '" src="' + sURL + '" align="' + sAlign + '" ');
			embedCode.push('id="' + sID + '" ');
			for (k in oOptions) {
				embedCode.push(k + '="' + oOptions[k] + '" ');
			}
			embedCode.push('type="application/x-shockwave-flash" />');
		}
		return embedCode.join('');
	};
	FlashObject.getDefaultOption = function() {
		return {
			quality : "high",
			bgColor : "#FFFFFF",
			allowScriptAccess : "always",
			wmode : "window",
			menu : "false",
			allowFullScreen : "true"
		};
	};
	FlashObject.find = function(sID, oDoc) {
		oDoc = oDoc || doc;
		try {
			return oDoc[sID] || oDoc.all[sID];
		} catch (e) {
			return null;
		}
	};
	FlashObject.getPlayerVersion = function() {
		var flashVer, plug = navi.plugins;
		if (bIE) {
			try {
				flashVer = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
						.GetVariable('$version');
				flashVer = flashVer.replace('Debugger ', '').substr(4).split(
						',');
				return {
					major : flashVer[0],
					minor : flashVer[1],
					revision : flashVer[2]
				};
			} catch (e) {
			}
		} else if (flashVer = plug['Shockwave Flash 2.0']
				|| plug['Shockwave Flash']) {
			flashVer = flashVer.description.replace('Debugger ', '');
			flashVer = flashVer.split(' ')[2].split('.');
			return {
				major : flashVer[0],
				minor : flashVer[1],
				revision : flashVer[2]
			};
		} else if (agent.indexOf('webtv') > -1) {
			flashVer = agent.indexOf('webtv/2.6') > -1 ? 4 : agent
					.indexOf('webtv/2.5') > -1 ? 3 : 2;
			return {
				major : flashVer,
				minor : 0,
				revision : 0
			};
		}
	};
	FlashObject.setWidth = function(sID, value) {
		FlashObject.find(sID).width = value;
	};
	FlashObject.setHeight = function(sID, value) {
		FlashObject.find(sID).height = value;
	};
	FlashObject.setSize = function(sID, nWidth, nHeight) {
		FlashObject.setWidth(sID, nWidth);
		FlashObject.setHeight(sID, nHeight);
	};
	FlashObject.getPositionObj = function(sID) {
		var target, absPosi = {
			left : 0,
			top : 0
		}, scrollPosi = {
			scrollX : 0,
			scrollY : 0
		}, nInnerWidth, bSafari = agent.indexOf('safari') > -1;
		if (!(target = FlashObject.find(sID))) {
			return null;
		}
		if (bSafari) {
			var oParent, oOffsetParent;
			if (target.parentNode.tagName.toLowerCase() == 'object') {
				target = target.parentNode;
			}
			for (oParent = target, oOffsetParent = oParent.offsetParent; oParent = oParent.parentNode;) {
				if (oParent.offsetParent) {
					absPosi.left -= oParent.scrollLeft;
					absPosi.top -= oParent.scrollTop;
				}
				if (oParent == oOffsetParent) {
					absPosi.left += target.offsetLeft + oParent.clientLeft;
					absPosi.top += target.offsetTop + oParent.clientTop;
					if (!oParent.offsetParent) {
						absPosi.left += oParent.offsetLeft;
						absPosi.top += oParent.offsetTop;
					}
					oOffsetParent = oParent.offsetParent;
					target = oParent;
				}
			}
		} else {
			var o;
			for (o = target; o; o = o.offsetParent) {
				absPosi.left += o.offsetLeft;
				absPosi.top += o.offsetTop;
			}
			for (o = target.parentNode; o; o = o.parentNode) {
				if (o.tagName == 'BODY')
					break;
				if (o.tagName == 'TR') {
					absPosi.top += 2;
				}
				absPosi.left -= o.scrollLeft;
				absPosi.top -= o.scrollTop;
			}
		}
		if (bIE) {
			scrollPosi.scrollX = doc.documentElement.scrollLeft
					|| doc.body.scrollLeft;
			scrollPosi.scrollY = doc.documentElement.scrollTop
					|| doc.body.scrollTop;
			nInnerWidth = doc.documentElement.clientWidth
					|| doc.body.clientWidth;
		} else {
			scrollPosi.scrollX = window.pageXOffset;
			scrollPosi.scrollY = window.pageYOffset;
			nInnerWidth = window.innerWidth;
		}
		return {
			absoluteX : absPosi.left,
			absoluteY : absPosi.top,
			scrolledX : absPosi.left - scrollPosi.scrollX,
			scrolledY : absPosi.top - scrollPosi.scrollY,
			browserWidth : nInnerWidth
		};
	};
	FlashObject.getSSCLogParam = function() {
		var rv = [];
		if (window['g_ssc']) {
			rv.push('ssc=' + g_ssc);
		} else {
			rv.push('ssc=decide.me');
		}
		if (window['g_pid']) {
			rv.push("&p=" + g_pid);
		}
		if (window['g_query']) {
			rv.push("&q=" + encodeURIComponent(g_query));
		}
		if (window['g_sid']) {
			rv.push("&s=" + g_sid);
		}
		return rv.join('');
	};
	bind(W, 'unload', unloadHandler);
	bind(doc, !bFF ? 'mousewheel' : 'DOMMouseScroll', wheelHandler);
	rmc.player.FlashObject = FlashObject;
})(window);/*
 * real env
 */

rmc.player.env = {
	flash : {
		region: {
			GLOBAL:{
				api:"http://global-nvapis.line.me/linetv/rmcnmv/vod_play_videoInfo.json"
				, module:"swf/LineTvVODPlayer.swf"
				,isGlobal:true
			}
			, LOCAL:{
				api:"http://play.rmcnmv.naver.com/vod/play"
				, module:"swf/LineTvVODPlayer.swf"
				,isGlobal:false
			}
			, ASIA:{
				api:"http://global-nvapis.line.me/linetv/rmcnmv/vod_play_videoInfo.json"
				, module:"swf/LineTvVODPlayer.swf"
				,isGlobal:true
			}
		}
		, regionSet:{
			US:"GLOBAL"
			, TH:"ASIA"
			, TW:"ASIA"
			, KR:"LOCAL"
		}
		, langSet : {
			"EN_US":"eng"
			, "TH_TH":"tha"
			, "ZH_TW":"twn"
			, "KO_KR":"kor"
		}
	}
};
