

function setCenterButton(buttonOneJqEl, buttonTwoJqEl) {
    var delay = 200;
    var buttonsRemoved = false;
    var existedButtons = $('#center-button-container').children();
    if (existedButtons.length > 0) {
        existedButtons.hide(delay, function() {
            if(buttonsRemoved){return;}
            if (buttonOneJqEl || buttonTwoJqEl) {
                existedButtons.remove();
                buttonsRemoved = true;
            }
            if( buttonOneJqEl) {
                buttonOneJqEl.clone(true).hide().appendTo('#center-button-container').show(delay);
            }
            if( buttonTwoJqEl) {
                buttonTwoJqEl.clone(true).hide().appendTo('#center-button-container').show(delay);
            }
        });
    } else {
        if (buttonOneJqEl) {
            buttonOneJqEl.clone(true).hide().appendTo('#center-button-container').show(delay);
        }
        if( buttonTwoJqEl) {
            buttonTwoJqEl.clone(true).hide().appendTo('#center-button-container').show(delay);
        }
    }
}


function initApp(){
    if(!isMobile){
        correctiveScale();
    }
    
    initIndex();
    googleMapLoadScript();
}

function initIndex() {
    addScrolls();
    
    showLoginTab();
    
    readSavedLoginData();

    

    $('#forgot-password-button').click(function() {
        showForgotPasswordTab();
    });


    $('#reset-password-button').click(function() {
        handleResetPasswordForm();
        return false;
    });


    $('#login-form').attr('action', url.login);
    
    $('#login-form').yiiactiveform({
        'validateOnSubmit': false,
        'validateOnChange': true,
        'validateOnType': false,
        //'clientValidation': true,
        'attributes': [
            {
                'id': 'LoginForm_email',
                'inputID': 'LoginForm_email',
                'errorID': 'LoginForm_email_em_',
                'model': 'LoginForm',
                'name': 'email',
                'enableAjaxValidation': false,
                'clientValidation': function(value, messages, attribute) {

                    if ($.trim(value) === '') {
                        messages.push(eMsg.accNumberBlank);
                    }

                }
            },
            {
                'id': 'LoginForm_password',
                'inputID': 'LoginForm_password',
                'errorID': 'LoginForm_password_em_',
                'model': 'LoginForm', 'name': 'password',
                'enableAjaxValidation': false,
                'clientValidation': function(value, messages, attribute) {

                    if ($.trim(value) === '') {
                        messages.push(eMsg.pwdBlank);
                    }

                }
            }
        ]
    });
    
    $('#submit-form-button').on('click', function() {
        var params = {
            url: url.login,
            type: 'POST',
            formData: $(this).parents("form").serialize()
        };
        $.fn.yiiactiveform.validate(
                $(this).parents("form"), 
                function(messages){
                    var n=0;
                    for(var i in messages){
                        n++;
                    }
                    if( n===0 ){
                        ajaxRequest(params, validateForm);
                    }
                },
                function(){
                    log('error callback called in validation login form');
                });
        return false;
    });

}


function readSavedLoginData(){
    
    var tlsId = store.getItem("tlsId");
    var tlsPwd = store.getItem("tlsPwd");
    
    if(tlsId && tlsId!=='undefined'){
        $('#login-form input[name=LoginForm\\[email\\]]').val(tlsId);
        $('#forgotten-password-form input[name=LoginForm\\[email\\]]').val(tlsId);
    }
    if(tlsPwd && tlsPwd!=='undefined'){
        $('#login-form input[name=LoginForm\\[password\\]]').val(tlsPwd);
    }
}


function writeLoginData(){
    var tlsId = $('#login-form input[name=LoginForm\\[email\\]]').val();
    var tlsPwd = $('#login-form input[name=LoginForm\\[password\\]]').val();
    
    if(tlsId && tlsId!=='undefined'){
    store.setItem("tlsId", tlsId);
    }
    if(tlsPwd && tlsPwd!=='undefined'){
    store.setItem("tlsPwd", tlsPwd);
    }
}


var isReseted = false;
function handleResetPasswordForm() {
    var messages = [];
    if(isReseted === true){ return; }
    var formJqEl = $('#forgotten-password-form');
    var formData = formJqEl.serialize();
    var errorField = formJqEl.find('.errorMessage');
    var inputField = formJqEl.find('input[name=LoginForm\\[email\\]]');
    if ($.trim(inputField.val()) === '') {
        errorField.show();
        messages.push(eMsg.accNumberBlank);
        errorField.html(eMsg.accNumberBlank);
    }else{
        errorField.hide();
        errorField.html('');
    }
    if(messages.length>0){
        return false;
    }

    var after = function(result) {
        var status = result.status;
        if (status === "success") {
            errorField.hide();
            errorField.html('');
            isReseted = true;
            var labelsArr = $('#reset-password-button .button-label');
            var defaultCss = $(labelsArr[0]).css('display');
            $(labelsArr[0]).css({display : 'none'});
            $(labelsArr[1]).css({display : defaultCss});

        } else if (status === "error") {
            $.each(result.error, function(key, value) {
                errorField.show();
                errorField.html(value);
            });

        }
    };
    resetForgottenPassword(formData, after);
}



//  ============================================================================
//  =======================    TABULATIONS   ===================================
//  ============================================================================

function showLoginTab() {
    $('#login-tab').show().siblings().hide();

    setCenterButton( $('#login-info-button') );
}

function showForgotPasswordTab() {
    $('#forgot-password-tab').show().siblings().hide();

    setCenterButton(null);
}


function showMainMenuTab() {
    $('#main-menu-tab').show().siblings().hide();

    setCenterButton( $('#main-page-info-button') );

    //refreshNotifications();
}

function showContactsTab(backButton) {
    $('#contacts-tab').show().siblings().hide();
    setCenterButton(null);
    buildContactsTab();
    
    
}


function showProfileTab() {
    $('#profile-tab').show().siblings().hide();
    setCenterButton( $('#profile-reload-button') );
}


function showViewProfileTab() {
    $('#view-profile-tab').show().siblings().hide();
    setCenterButton($('#to-edit-profile-button'));

    fillProfileForm(user, 'view');
}


function showEditProfileTab() {
    $('#edit-profile-tab').show().siblings().hide();
    setCenterButton( $('#save-profile-button') );

    fillProfileForm(user, 'edit');
}


function showLicensesTab() {
    $('#licenses-tab').show().siblings().hide();
    setCenterButton( $('#licenses-info-button') );
    buildLicensesList();
}


function showAvailabilityTab() {
    $('#availability-tab').show().siblings().hide();
    setCenterButton( $('#availability-info-button'), $('#availability-reload-button') );
}


function showTimesheetsTab() {
    $('#timesheets-tab').show().siblings().hide();
    setCenterButton( $('#timesheet-reload-button') );

    buildTimesheetsList(user.contractorTimesheets);
}


function showSubmitTimesheetsTab(viewType, dateImMillis) {
    $('#submit-timesheet-tab').show().siblings().hide();
    if (viewType === 'submit') {
        setCenterButton( $('#submit-timesheet-info-button') );
    } else {
        setCenterButton(null);
    }
    buildSubmitTimesheetTab(viewType, dateImMillis);
}


function showJobsNearbyTab() {
    $('#jobs-nearby-tab').show().siblings().hide();
    setCenterButton( $('#jobs-nearby-info-button'), $('#jobs-nearby-refresh-button') );

    buildJobsNearbyTab(false);
}


function showAddSkillTab() {
    snapshotForNewSkill = null;
    $('#add-skill-tab').show().siblings().hide();
    setCenterButton(null);
}


function  showMyCoursesTab() {
    $('#my-courses-tab').show().siblings().hide();
    setCenterButton($('#my-courses-refresh-button'));

    buildMyCoursesTab(false);
}


function showMyJobsTab() {
    $('#my-jobs-tab').show().siblings().hide();
    setCenterButton($('#my-jobs-info-button'), $('#my-jobs-refresh-button') );

    buildMyJobsTab(false);
}


function showDetailForJob(viewType, jobId) {
    $('#view-job-tab').show().siblings().hide();
    setCenterButton(null);

    buildDeatilsForJob(viewType, jobId);
}


function showDetailForCourse(courseId) {
    $('#view-course-tab').show().siblings().hide();
    setCenterButton(null);

    buildDetailsForCourseTab(courseId);
}




//===================================================================




function validateForm(result) {
    var status = result.status;

    if (status === "success") {
        user = new User();
        user = buildUserModel(result.data);
        
        writeLoginData();
        
        fillSubmitForm(null, null, user.id);


        var checker = checkRights();
        if (checker.hasError) {
            $("#LoginForm_password_em_").show();
            $("#LoginForm_password_em_").html(checker.errMsg);
        } else if (checker.redirect !== '') {
            loadContent(checker.redirect);
        }

    } else if (status === "error") {
//        if(! isArray(result.error)){
//            showErrorMessage(result.error);
//            return;
//        }
        $.each(result.error, function(key, value) {
            $("#LoginForm_" + key + "_em_").show();
            $("#LoginForm_" + key + "_em_").html('' + value);
        });
    }
}




// ====================  Push notification  ==================================

var pushNotification;


function initPushPlugin(){
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = 'js/libs/cordova/push_notification.js';
    document.body.appendChild(script);
    setTimeout(function(){
        initializePushNotification();
    },500);
//    $.getScript('js/libs/cordova/push_notification.js', initializePushNotification);
}

function initializePushNotification() {
    try {
        pushNotification = window.plugins.pushNotification;
        if (device.platform == 'android' || device.platform == 'Android') {
            pushNotification.register(successHandler, errorHandler, {"senderID": "633734918801", "ecb": "onNotificationGCM"});		// required!
        } else {
            pushNotification.register(tokenHandler, errorHandler, {"badge": "true", "sound": "true", "alert": "true", "ecb": "onNotificationAPN"});	// required!
        }
    } catch (error) {
        var errMsg = "Push notification error: " + error.message;
        log(errMsg);
    }
}

// handle APNS notifications for iOS
function onNotificationAPN(e) {
    if (e.alert) {
        //navigator.notification.alert(e.alert);
        showMessage(e.alert, aMsg.newMsg);
    }

    if (e.sound) {
        var snd = new Media(e.sound);
        snd.play();
    }

    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}

// handle GCM notifications for Android
function onNotificationGCM(e) {
    switch (e.event)
    {
        case 'registered':
            if (e.regid.length > 0)
            {
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                log("push notification gcm regID : " + e.regid);
                fillSubmitForm('android', e.regid);
            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground)
            {
                // if the notification contains a soundname, play it.
//                var my_media = new Media("/android_asset/www/"+e.soundname);
//                my_media.play();
                //alert("--INLINE NOTIFICATION--")
                
            }
            else
            {	// otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart) {
                    //showMessage(e.alert, aMsg.newMsg);
                    //alert('--COLDSTART NOTIFICATION--')
                }
                else {
                    //showMessage(e.alert, aMsg.newMsg);
                    //alert('--BACKGROUND NOTIFICATION--')
                }
                //alert('--BACKGROUND NOTIFICATION--')
            }
            showMessage(e.payload.message, aMsg.newMsg);
//            $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
//            $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
            break;

        case 'error':
            log('push notification gcm error: ' + e.msg);
            break;

        default:
            log('push notification gcm : EVENT -> Unknown, an event was received and we do not know what it is');
            break;
    }
}

function tokenHandler(result) {
    log('push notification token handler apn: ' + result);
    fillSubmitForm('ios', result);
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}

function successHandler(result) {
    log('push notification success gcm: '+ result);
}

function errorHandler(error) {
    log('push notification error apn or gcm: '+error);
}

var pushObject = {
    os: null,
    deviceId: null,
    contractorId: null
};

function fillSubmitForm(os, deviceId, contractorId){
    if(os){ pushObject.os = os; }
    if(deviceId){ pushObject.deviceId = deviceId; }
    if(contractorId) { pushObject.contractorId = contractorId; }
    
    var formData = 'os=' + pushObject.os + '&device_id=' + pushObject.deviceId + '&contractor_id='+pushObject.contractorId;
    
    var params = {
        url: url.registerForPush,
        needBlock: false,
        formData: formData,
        type: 'POST'
    };
    
    function after(result){
        if (result.status === 'success') {
            log('push notification registered success');
        } else {
            log('push notification register error');
        }
    }
    
    if(pushObject.os  &&  pushObject.deviceId  &&  pushObject.contractorId){
        ajaxRequest(params, after);
    }
    
//    var formJq = $('#login-form');
//    formJq.find('input[name=os]').val(os);
//    formJq.find('input[name=device_id]').val(deviceId);
}
