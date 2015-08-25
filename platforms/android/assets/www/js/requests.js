
function refreshNotifications() {
    params = {
        url: url.notifications,
        type: 'POST'  
    };
    
    var handleNotifications = function(result) {
        var status = result.status;
        var data = result.data;
        if (status === 'success') {
            var notificationsJqEl = $('#notifications-list');
            var htmlArr = [];
            
            for (var i = 0; i < data.length; i++) {
                var notification = new Notification(data[i]);
                var handlerStr = 'loadContent('+ notification.getRedirect().page +')';
                htmlArr.push( notificationPatternStr.format(handlerStr, notification.getText() , notification.getMappingId() ) );
            }
            //alert(htmlArr[0]);
            notificationsJqEl.html(htmlArr.join('\n'));
            addHandlersToRemoveNotificationButtons();

        } else if (status === 'error') {
            showErrorMessage(data);
        }
    };
    
    ajaxRequest(params, handleNotifications);


    
}


function addHandlersToRemoveNotificationButtons(){
    $('.delete-notification-button').click(function(){
        var notificationId = $(this).attr('id').split('__')[1];
        var parentEl = $(this).parent('li');
        
        $.ajax({
            data:{id: notificationId},
            url: url.removeNotification,
            success: function(){ parentEl.remove(); },
            error: function(XMLHttpRequest, textStatus, errorThrown){ showErrorMessage(errorThrown); }
        });
    });
       
}


function addHandlerToRemoveAllNotificationsButton(){
    $('.remove-all-notifications').click(function(){
        var notificationsJqEl = $('#notifications-list');
        $.ajax({
            url: url.removeAllNotifications,
            success: function(){ notificationsJqEl.html(''); },
            error: function(XMLHttpRequest, textStatus, errorThrown){ showErrorMessage(errorThrown); }
        });
    });
    
}




function submitContractorDataForm(){
    var formJqEl = $('#contractor-data-form');
    var formData = formJqEl.serialize();
    var id = user.id;
    var urlToUpload = url.editProfile+'&id='+id+'&ajax=true';

    var params = {
        url: urlToUpload,
        type: 'POST',
        formData: formData
    };
    
    var after = function(result){
        if(result.status === 'success'){
            showMessage(aMsg.changesSubmitted);
        }else{
            showErrorMessage(result.error);
        }
    };
    
    ajaxRequest(params, after);
    
    return false;
}



function getAllTimesheets(callback){
    var params ={
        url: url.allOfUser
    };
    
    var after = function(result){
        if(result.status === 'success'){
            var timesheets = buildTimesheetsModel(result.data);
            result.data = timesheets;
            callback(result);
        }
        
    };
    
    ajaxRequest(params, after);
}


function submitTimesheetForm(){
    log('submit timesheet form called');
    var formJqEl = $('#submit-timesheet-form');
    // check Timesheet form
    var inputs = formJqEl.find('input[type=text]').each(function(){
        var isDisabled = ( $(this).attr('disabled') ) ? true : false;
        var val = $(this).val();
        var digitVal = parseFloat(val);
        if(isDisabled || val === ''){
            
        }else{
            if(  isNaN(digitVal) || digitVal>24 ){
            showErrorMessage(eMsg.wrongTimeInInput);
            return;
        }
        }
        
        
    });
    
    var formJqEl = $('#submit-timesheet-form');
    var dateFormatted = $('#week-beginning-date').html();
    var formData = formJqEl.serialize();
    var urlToUpload = url.submitTimesheet+'&date='+dateFormatted+'&ajax=true';
    var params = {
        url: urlToUpload,
        type: 'POST',
        formData: formData
    };
    
    var after = function(result){
        if(result.status === 'success'){
            //var timesheets = buildTimesheetsModel(result.data);
            user = buildUserModel(result.data); //.contractorTimesheets = timesheets;
            showTimesheetsTab();
        }else{
            showErrorMessage(result.error, aMsg.fixErrors);
        }
    };
    
    ajaxRequest(params, after);
    return false;
}


function getAllOfUser(callback){
    var params = {
        url: url.allOfUser
    };
    
    var after = function(result) {
        if (result.status === 'success') {
            var user = buildUserModel(result.data);
            callback({status: 'success', data: user});
        } else {
            callback({status: 'error', error: result.error});
        }
    };
    
    ajaxRequest(params, after);
}



function uploadAddSkillFormWithoutFile(urlToUpload, formData, callback){
    var params = {
        url: urlToUpload,
        type: 'POST',
        formData: formData
    };
    ajaxRequest(params, callback);
}


function getAllSkills(callback){
    var params = {
        url: url.allSkills,
        needBlock: false
    };
    
    var after = function(params){
        if(params.status === 'success'){
            var skillsArr = [];
            var skillsRespArr = params.data;
            for(var i in skillsRespArr){
                var skill = new Skill(skillsRespArr[i]);
                skillsArr.push(skill);
            }
            params.data = skillsArr;
        }
        callback(params);
    };
    
    ajaxRequest(params, after);
}




function getAllAdditionalPayTypes(callback){
    var params = {
        url: url.allAdditionalPayTytes,
        needBlock: false
    };
    var after = function(result){
        if(result.status === 'success'){
            var additionalPayTypesArr = [];
            var additionalPayTypesRespArr = result.data;
            for(var i in additionalPayTypesRespArr){
                var additionalPayType = new AdditionalPayType(additionalPayTypesRespArr[i]);
                additionalPayTypesArr.push(additionalPayType);
            }
            result.data = additionalPayTypesArr;
        }
        callback(result);
    };
    ajaxRequest(params, after);
}


function resetForgottenPassword(formData, callback){
    var params ={
        url: url.forgottenPassword,
        type: 'POST',
        formData:formData
    };
    ajaxRequest(params, callback);
}


function getAvailableJobs(callback){
    var params = {
        url: url.availableJobs
    };
    ajaxRequest(params, callback);
}


function getMyJobs(callback){
    var params = {
        url: url.myJobs
    };
    ajaxRequest(params, callback);
}

function getMyCourses(callback){
    var params = {
        url: url.myCourses
    };
    ajaxRequest(params, callback);
}


function getAllAreas(callback){
    var params = {
        url: url.allAreas,
        needBlock: false
    };
    
    var after = function(result){
        if(result.status === 'success'){
            var areasArr = [];
            var areasResponseArr = result.data;
            for(var i in areasResponseArr){
                var area = new Area(areasResponseArr[i]);
                areasArr.push(area);
            }
            //areas = areasArr;
            result.data = areasArr;
        }
        callback(result);
    
    };
    ajaxRequest(params, after);
}


function ajaxRequest(params, callback){
    hideKeyboard();
    if(isMobile){
        var isConnected = checkConnection();
        if(!isConnected){ return false; }
    }
    
    var needBlock  = true;
    if(params.needBlock && params.needBlock === false){
        needBlock = false;
    }
    
    if(needBlock){ $.blockUI(blockParams); }
    var type = 'GET';
    var formData = [];
    if( typeof (params.type) !== 'undefined'){ type = params.type; }
    if( typeof (params.formData) !== 'undefined'){ formData = params.formData; }
    if( typeof (params.url) === 'undefined'){ log('params.url not setted'); return ;}
    if( typeof (callback) === 'undefined'){ log('callback not setted'); return ;}
    
    log('ajax: '+params.url);
    
    $.ajax({
        type: type,
        url: params.url,
        crossDomain: true,
        dataType: 'json',
        data: formData,
        cache: false,
        timeout: 10000,
        success: function(data) {
            if (!data) {
                callback({status: 'error', error: eMsg.parserError});
            }
            if (data.status === 'success') {
                if (needBlock) {
                    $.unblockUI();
                }
                callback({status: 'success', data: data.data});
            } else {
                if (needBlock) {
                    $.unblockUI();
                }
                callback({status: 'error', error: data.errors});
            }
            return;
        },
        error: function(jqXHR, textStatus, errorMessage) {
            $.unblockUI();
            var msg;
            if (textStatus === 'parsererror') {
                msg = eMsg.parserError;
            } else if (textStatus === 'timeout') {
                msg = eMsg.timeoutReached;
            } else if (textStatus === 'abort') {
                msg = eMsg.ajaxAborted;
            } else if (jqXHR.status === 0) {
                msg = eMsg.connectionError;
            } else if (jqXHR.status === 404) {
                msg = eMsg.urlNotFound;
            } else if (jqXHR.status === 500) {
                msg = eMsg.serverError;
            } else {
                msg = jqXHR.responseText;
                alert(eMsg.uncaughtError + '\n' + jqXHR.responseText);
            }

            var logMsg = 'Request error:' + params.url +';  jqXHR.status: '+jqXHR.status+ ';  textStatus:' + textStatus + ';  errorMessage:' + errorMessage;
            log(logMsg);
            //callback( {status:'connectionError', error: msg } );
            showErrorMessage(msg);
            return;
        }
    });
}