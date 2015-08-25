

var officePhone = '01777 719 808';

var host;

// "http://fastlane.tlsltd.org/"
//host = "http://192.168.172.1/"
//host = "http://localhost/"

host = "http://fastlane.dorsetcreative.co.uk/"; 


log('host: '+host +';  isMobile: '+isMobile);

var url = {
    login               : host+'index.php?mbl=1&r=site/login',
    logout              : host+'index.php?mbl=1&r=site/logout',
    forgottenPassword   : host+'index.php?mbl=1&r=user/forgottenPassword',
    allOfUser           : host+'index.php?mbl=1&r=ajax/allOfUser',
            
    userProfile         : host+'index.php?mbl=1&r=users/profile',
    editProfile         : host+'index.php?mbl=1&r=profileChange/create',     // &id=userId
    addLicense          : host+'index.php?mbl=1&r=skill/AddLicense',         // &skillMappingId=4&contractorId=userId,
    licenseImage        : host+'images/qual-pics/',                    // contractor1/thumb_1380711564alexis-img2.png',
    addSkill            : host+'index.php?mbl=1&r=skill/add',                // &contractor_id=userId
    allSkills           : host+'index.php?mbl=1&r=ajax/allSkills',
    changeAvatar        : host+'index.php?mbl=1&r=ajax/changeAvatar',        // &id=userId
    deleteAvatar        : host+'index.php?mbl=1&r=ajax/deleteAvatar',        // &id=userId
    avatarImage         : host+'images/avatar-pics/',                  // user.username/thumb_1380711564.jpg',
            
    availableJobs       : host+'index.php?mbl=1&r=job/AvailableJobs&ajax=1',
    myJobs              : host+'index.php?mbl=1&r=job/myJobs&ajax=1',
    myCourses           : host+'index.php?mbl=1&r=course/myCourses&ajax=1',
    
    allAreas            : host+'index.php?mbl=1&r=ajax/allAreas',
    allAdditionalPayTytes : host+'index.php?mbl=1&r=ajax/allAdditionalPayTypes',
            
    crateHoliday        : host+'index.php?mbl=1&r=contractorHoliday/create',
    deleteHoliday       : host+'index.php?mbl=1&r=contractorHoliday/delete',  // &id=4
            
    
    allTimesheets       : host+'index.php?mbl=1&r=timesheet/allContractorTimesheets&ajax=1',
    submitTimesheet     : host+'index.php?mbl=1&r=timesheet/contractorSubmitNew', //  &date=21-10-2013
    requests            : host+'index.php?mbl=1&r=requests/index',
    training            : host+'index.php?mbl=1&r=event/index',
    help                : host+'index.php?mbl=1&r=site/contact',
    
    notifications          : host+'index.php?mbl=1&r=ajax/getNotifications',
    removeNotification     : host+'index.php?mbl=1&r=ajax/removeNotification', // + parameter id
    removeAllNotifications : host+'index.php?mbl=1&r=ajax/removeAllNotifications',
    
    registerForPush        : host+'index.php?mbl=1&r=ajax/registerForPushNotifications'
};

var store = (window.localStorage)  ?  window.localStorage : cookie;


function langInitialize(lang){
    var langObj = null;
    if(lang === 'en'){
        langObj = langEn;
    }else if(lang === 'ru'){
        langObj = langRu;
        for(var i in langEn){
            if(typeof(langRu[i]) === 'undefined'){
                langRu[i] = langEn[i];
            }
        }
    }
    
    return langObj;
}


function logout(){
    $.cookie("name", null);
    loadContent('login');
}


function initializeGoogleMap(){
    log('google maps initialized success');
}
function googleMapLoadScript() {
    setTimeout(function(){
        $.getScript('http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&'+
            'callback=initializeGoogleMap');
    
//    var script = document.createElement('script');
//    script.type = 'text/javascript';
//    script.src = 'http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&'+
//            'callback=initializeGoogleMap';
//    document.body.appendChild(script);
    }, 500);  
}




function loadContent(page){
    if(page === 'contractor'){
        $( "#body" ).load( "contractor.html #inner" , function(){ 
            initContractor(); 
        });
    }
    if(page === 'login'){
        $( "#body" ).load( "index.html #inner" , function(){ 
            initIndex(); 
        });
    }
}

function checkRights(){
    
    var hasError = false;
    var errMsg = '';
    var redirect = '';
    
    var roleId = user.roleId;
//        if(roleId == 1){
//            redirect = 'client.html';
//        }else
    if (roleId == 2) {
        redirect = 'contractor';

    } else {
        user = null;
        hasError = true;
        errMsg = eMsg.wrongRole;
        redirect = 'login.html?msg=' + errMsg;
    }
    return {hasError: hasError, errMsg: errMsg, redirect: redirect};
    
}



function exitFromApp()
{
    if (navigator.app && navigator.app.exitApp) {
        navigator.app.exitApp();
    } else if (navigator.device && navigator.device.exitApp) {
        navigator.device.exitApp();
    }
     //navigator.app.exitApp();
}


// params for blockUI

var blockCss = {
	top:  ($(window).height() - 19) /2 + 'px',
	left: '50%',
        marginLeft: '-5.5em',
	width: '11em',
	height:'1em',
	border:	'none',
	backgroundColor: 'transparent',
	cursor:	'wait',
	opacity: 1
};

var blockOverlayCss = {
	 backgroundColor: 'rgba(50, 50, 50, 0.85)',
	 opacity: '1',
	 cursor: 'wait'
};
var blockMessage = '<img style="height: 1em; width:11em" src="img/ajax-loader.gif" /> \n <br/> \n '+
        '<span id="block-text" class="block-text"></span>';

var blockParams = {
	message: blockMessage,
	css: blockCss,
	overlayCSS: blockOverlayCss
};



function checkConnection() {
    try{
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

        if(networkState === Connection.NONE){
            showMessage(aMsg.notConnectedToNet);
            return false;
        }
        return true;
        
        //log("networkState: "+networkState+'\nConnection type: ' + states[networkState]);
    }catch(error){
        log(error);
        return false;
    }
}




function showErrorMessage(msg, title){
    if( ! title ){
        title = aMsg.error;
    }
    var returnedMsg = '';
    if( isArray(msg) ) {
        for(var i in msg){
            returnedMsg += msg[i]+'\n';
        }
        showMessage(returnedMsg, aMsg.error);
        return;
    } else { 
        if(typeof msg === 'object'){
            for(var i in msg){
                returnedMsg += msg[i]+'\n';
            }
            //returnedMsg = dump(msg); 
            showMessage(returnedMsg, aMsg.error);
            return;
        }else{
            showMessage(msg, aMsg.error);
        }
    }
}

function showMessage(message, title){
    if( ! title ){
        title = aMsg.warning;
    }
    
    if(navigator.notification){
        navigator.notification.alert(message, /*alertCallback*/ null, title);
    }else{
        if(title !== 'undefined'  &&  title === 'error' ){
            message = title+ '\n'+message;
        }
        alert(message);
    }
}
            

function getJobTimeFromChar(char){
    var returned = null;
    switch(char){
        case 'D': returned = aMsg.day; break;
        case 'N': returned = aMsg.night; break;
        case 'B': returned = aMsg.both; break;
        case 'X': returned = aMsg.none; break;
    }
    return returned;
}


function dump(arr,level) {
    var dumped_text = "";
    if(!level) level = 2;

    var level_padding = "";
    for(var j=0;j<level+1;j++) level_padding += "   ";

    if(typeof(arr) === 'object') {
        for(var item in arr) {
            var value = arr[item];

            if(typeof(value) === 'object') {
                dumped_text += level_padding + "'" + item + "' : {\n";
                dumped_text += dump(value,level+1);
                dumped_text += level_padding +"'}\n";
            } else {
                dumped_text += level_padding + "'" + item + "' => \"" + ((typeof(value)=='function')? ' function' : value) + "\"\n";
            }
        }
    } else {
        dumped_text = ""+arr+":"+typeof(arr)+"\n";
    }
    return dumped_text;
}


String.format = function() {
  var s = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {       
    var reg = new RegExp("\\{" + i + "\\}", "gm");             
    s = s.replace(reg, arguments[i + 1]);
  }

  return s;
};

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

String.prototype.formatObj = function(params) {
    var formatted = this;
    
    for (var i in params) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, params[i]);
    }
    return formatted;
};

Date.isEqualDMY = function(date1, date2){
    if( date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getYear() === date2.getYear() )
    {
        return true;
    }
    return false;
}

Date.prototype.parseYiiDate = function(dateStr){
    //var normDate = Date.parse(dateStr);
//        normDate.setTime();
//        
    return Date.parseYiiDate(dateStr);
}

Date.parseYiiDate = function(dateStr){
    if(dateStr == null || dateStr ==''){
        return null;
    }
    var timeMillis = Date.parse(dateStr);
    var normDate = new Date(timeMillis);
    normDate.setMinutes(0);
    normDate.setHours(0);
    normDate.setSeconds(0);
    return normDate;
}

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};



function correctiveScale(){
    //setTimeout(function(){
    var width = $(window).width();
    var height = $(window).height();
    log('Width: '+width+'  Height: '+height);
    
    var min = Math.min(width, height);
    
    var scale = min/275;
    if(height <= 480){ scale = 1.04; }
    //alert('width:'+width+'  height:'+ height +'\n ppi:'/*+ppi*/+'\n min:'+min+'\n scale:'+scale)
    $('body').css('font-size', scale+"em");
    
    var htmlDom = $('html');
    
    htmlDom.css({/*width: htmlDom.width()+'px',*/ height: htmlDom.height()+'px'});
    //htmlDom.css({'min-width': min+'px', 'min-height': min+'px'});
    
    //}, 0);
    
    
}

var scrollParams = {
    autoHideScrollbar: true,
    autoDraggerLength: true,
    scrollInertia: 100,
    contentTouchScroll: true,
    advanced:{
       updateOnContentResize: true,
       updateOnBrowserResize: true,
       autoScrollOnFocus: false
   }
};

function addScrolls(){
    $(".scroller").mCustomScrollbar(scrollParams);
}


var openedDialog = null;
function openInfoDialog(tabIdString){
    openedDialog = $('#'+tabIdString+' .info-bar');
    openedDialog.click(function(){closeInfoDialog()});
    openedDialog.show(200);
}

function closeInfoDialog(){
    if(openedDialog!==null){
        openedDialog.hide(200);
        openedDialog = null;
    }
}


function isTouchDevice(){ 
    try{ 
        document.createEvent("TouchEvent"); 
        return true; 
    }catch(e){ 
        return false; 
    } 
} 


function touchScroll(id){ 
    if(isTouchDevice()){ //проверка на тач-девайс 
        var elt=document.getElementById(id); 
        var scrollStartPos=0; 
 
        elt.addEventListener("touchstart", function(event) { 
            scrollStartPos=this.scrollTop+event.touches[0].pageY; 
            event.preventDefault(); 
        },false); 
 
        elt.addEventListener("touchmove", function(event) { 
            this.scrollTop=scrollStartPos-event.touches[0].pageY; 
            event.preventDefault(); 
        },false); 
    }
}




function getDataArrayFromForm(formJqEl){
    var formInputsValuesArr = {};
    $.each(formJqEl.serializeArray(), function(i, field) {
        formInputsValuesArr[field.name] = field.value;
    });
    return formInputsValuesArr;
}



function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

function isArray(object){
    return (Object.prototype.toString.call( object ) === '[object Array]');
}





function returnedDataForCalendar(date){
    for(var i in user.contractorHolidays){
        var holiday = user.contractorHolidays[i];
        var holidayDate = holiday.holidayDate;
        var normDate = Date.parseYiiDate(holidayDate);
        if( Date.isEqualDMY(date, normDate) ){
            if(holiday.holidayStatus == '1'){ // approved
                return {
                    disabled: false,
                    className: 'orange-cell'
                };
            }else{
                return {
                    disabled: false,
                    className: 'red-cell'
                };
            }
        }
    }

    for(var i in user.jobs){
        var jobDate = user.jobs[i].date;
        var normDate = new Date();
        normDate.setTime(Date.parse(jobDate));
        if( date.getDate() === normDate.getDate() &&
            date.getMonth() === normDate.getMonth() &&
            date.getYear() === normDate.getYear() ){
            return {
                disabled: true,
                className: 'blue-cell'
            };
        }
    }
    return {
                disabled: false, //(date.valueOf() < now.valueOf()),
                className: '' // date.valueOf() == now2.valueOf() ? 'datepickerSpecial' : false
           };
}


function callToOffice(number){
    window.location.href='tel:'+number;
}


function openSiteInDefaultBrowser(url){
    log('open external url: '+url);
    if(isIos){
        window.open(url , '_system');
    }else{
        navigator.app.loadUrl(url, { openExternal:true });
    }
    
    //var ref = window.open(url, '_blank', 'location=yes');
    return false;
}

function hideKeyboard() {
    document.activeElement.blur();
    $('input, textarea').blur();
    
  }
  
  
  function resizeThisImage(img){
      if(img.naturalWidth > img.naturalHeight){
          img.style.width = '100%';
      }else{
          img.style.height = '100%';
      }
  }
  
  
  
function validateNumber(evt){
	var theEvent = evt || window.event;
	var keyCode = theEvent.keyCode || theEvent.which;
	var target = evt.target;
	var curValStr = target.value;
	if( keyCode === 13 ){
		evt.target.blur();
	}
	if( keyCode===13         // enter
//		|| keyCode === 8     // backspace
//		|| keyCode === 37    // arrow left
//		|| keyCode === 39    // arrow right
//		|| keyCode === 38    // arrow up
//		|| keyCode === 40    // arrow down
	){
		return;
	}
	var key = String.fromCharCode( keyCode );
        var admissibleSymbols = '0.123456789';
        var enteredWrongKey = (admissibleSymbols.indexOf(key)===-1 ) ? true : false;
        var newStr = ''+curValStr+key;
	if( enteredWrongKey || isNaN(newStr) || parseFloat(newStr)>24 ) {
		theEvent.returnValue = false;
		if(theEvent.preventDefault) theEvent.preventDefault();
		return false;
	}
}


function log(msg){
    console.log( '::TLS:: '+msg );
}