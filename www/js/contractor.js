

//var lang = langInitialize('ru');

var areas = null;
var skills = null;
var additionalPayTypes = null;


//var checker = checkRights();
//var user = new User();
//user = checker.user;


var notificationPatternStr;
var skillsPatternStr;


function initContractor() {


    //===========================  getting all json data from server  ==========

    $.blockUI(blockParams);

    // static data
    getAllSkills(function(result) {
        if (result.status === 'success') {
            skills = result.data; //dump(result.result));
            var pattern = '<option value="{0}">{1}</option>';
            var htmlArr = [];
            for (var i in skills) {
                var skill = skills[i];
                htmlArr.push(pattern.format(skill.id, skill.name));
            }
            $('#SkillMapping_skill_id').html(htmlArr.join('\n'));

        } else {
            showErrorMessage(result.error);
        }
        loadedJson(result.status, 'getAllSkills');

    });


    // static data
    getAllAreas(function(result) {
        if (result.status === 'success') {
            areas = result.data;
        } else {
            showErrorMessage(result.error);
        }
        loadedJson(result.status, 'getAllAreas');
    });

    // static data
    getAllAdditionalPayTypes(function(result) {
        if (result.status === 'success') {
            additionalPayTypes = result.data;
        }
        loadedJson(result.status, 'getAllAdditionalPayTypes');
    });

    showMainMenuTab();
    $('#contractor-name').html(user.forename);

    //notificationPatternStr = $('#notifications-list').html().replace('display:none;', '');
    //skillsPatternStr = $('#skills-table').html().replace('display:none;', '');


    //addHandlersToRemoveNotificationButtons();
    //addHandlerToRemoveAllNotificationsButton();

    // refreshNotifications();

    addScrolls();
    var currDate = new Date();

    $('#publish-date').mobiscroll().date({
        minDate: currDate,
        endYear: currDate.getFullYear() + 50,
        dateFormat: 'yyyy-mm-dd'
    });

    buildCalendar();

}



function buildCalendar(){
    $('#availability-calendar').html('');
    $('#set-as-holiday-button').hide();
    $('#unset-as-holiday-button').hide();
    
    $('#availability-calendar').DatePicker({
        flat: true,
        calendars: 1,
        starts: 0,
        format: 'Y-m-d',
        date: new Date(),
        onChange: function(formated, dates) {
            $('#ContractorHolidays_holiday_date').val(formated);
            var contractorHoliday = getContractorHolidayByDate(dates);
            if (contractorHoliday !== null) {          // weekend found 
                $('#set-as-holiday-button').hide();
                $('#unset-as-holiday-button').show();
                $('#unset-as-holiday-form input[name=id]').val(contractorHoliday.id);
            } else {      //wekend not found
                $('#unset-as-holiday-button').hide();
                $('#set-as-holiday-button').show();
            }
        },
        onRender: function(date) {
            return returnedDataForCalendar(date);
        }
    });
}


var jsonDataLoaded = 0;
function loadedJson(status, funcName) {
    if (status === 'success') {
        jsonDataLoaded++;
    } else {
        jsonDataLoaded++;
        showMessage('data from ' + funcName + ' throw error');
    }

    if (jsonDataLoaded === 3) {
        log('all json from server loaded');
        $.unblockUI();
        // unlock screen for work
    }
}


var fullscreenViewParams = {
    isOpened: false,
    src: ''
};

var rotateInProgress = false;
if(isMobile){
    
    var _orientationHandler = function(e){
        log('rotation');
        //console.log(e);
        if(rotateInProgress === false){
            rotateInProgress = true;
            var rotationTimeout = setTimeout( function(){
                rotateInProgress = false; 
            
            }
            , 200);
            
            hideKeyboard();
            var htmlDom = $('html');
            htmlDom.css({width: '100%', height: '100%'});
            
            //log(' before  width: '+htmlDom.width()+'  height: '+htmlDom.height());
            var widthHeightTimeout = setTimeout( function(){
                
                htmlDom.css({width: htmlDom.width()+'px', height: htmlDom.height()+'px'});
                console.log('after   width: '+htmlDom.width()+'  height: '+htmlDom.height());
            }
            , 5500);
            
        
            if(fullscreenViewParams.isOpened){
                closeFullScreenView();
                var fullscreenViewTimeout = setTimeout( function(){
                    openInFullScreenView(fullscreenViewParams.src); 
                }
                , 200);


            }
        }
        
    };
    //$(window).bind('orientationchange', _orientationHandler);
    
    
};

function openInFullScreenView(imgSrc) {
    fullscreenViewParams.isOpened = true;
    fullscreenViewParams.src = imgSrc;
    
    var photoWrapperJqEl = $('#photo-wrapper');
    $.blockUI(blockParams);
    var imgPatternStr = ' <img id="photo" alt="photo" src="{0}" onload="fullscreenImageSuccess(this)" onerror="fullscreenImageError(this)" /> ';
    var imgStr = imgPatternStr.format(imgSrc);
    photoWrapperJqEl.html(imgStr);
    
}


function fullscreenImageSuccess(img){
    var photoContainerJqEl = $('#photo-container');
    //alert('width: ' + photoContainerJqEl.width() + '\n height: ' + photoContainerJqEl.height());
    photoContainerJqEl.show();
    var photoJqEl = $('#photo');
    //photoJqEl.attr('src', imgSrc);
    photoJqEl.touchPanView({
        width: photoContainerJqEl.width() - 0,
        height: photoContainerJqEl.height() - 0,
        startZoomedOut: true,
        zoomIn: '.photo-container .zoom-in',
        zoomOut: '.photo-container .zoom-out',
        zoomFit: '.photo-container .zoom-full',
        zoomFull: '.photo-container .zoom-fit'
    });
    $.unblockUI(); 
}


function fullscreenImageError(img){
    $.unblockUI();
    showErrorMessage(eMsg.cannotLoadImage);
}


function closeFullScreenView() {
    var photoContainerJqEl = $('#photo-container');
    var photoWrapperJqEl = $('#photo-wrapper');
    photoWrapperJqEl.html('');
    photoContainerJqEl.hide();
//    var photoJqEl = $('#photo');
//    photoJqEl.attr('src', null);
    fullscreenViewParams.isOpened = false;
}


function refreshAllOfUser(){
    getAllOfUser(after);
    
    function after(result){
        if(result.status === 'success'){
            user = result.data;
        }else{
            showErrorMessage(result.error);
        }
    }
}


function buildAvailabilityTab(){
    
    getAllOfUser(after);
    
    function after(result){
        if(result.status === 'success'){
            user = result.data;
            buildCalendar();
        }else{
            showErrorMessage(result.error);
        }
    }
}


function buildLicensesList() {
    var skillPatternStr = $('#skill-pattern').html();

    var skillImagePatternStr = $('#skill-image-pattern').html();
    var resultHtml = '';

    var userSkills = user.userSkills;

    for (var i in userSkills) {
        var userSkill = new UserSkill();
        userSkill = userSkills[i];
        var skillImgSrc = '';
        var skillImgBigSrc = '';

        var licenses = userSkill.skillLicenses;
        var licenseImages = '';
        var licenseBigPhotoSetted = false;

        if (licenses.length === 0) {
            skillImgSrc = 'img/void_license.png';
        }

        for (var j in licenses) {
            var license = new SkillLicense();
            license = licenses[j];

            var thumbSrc = url.licenseImage + user.username + '/thumb_' + license.licencePhoto;
            var bigSrc = url.licenseImage + user.username + '/' + license.licencePhoto;
            if (!licenseBigPhotoSetted) {
                skillImgSrc = thumbSrc;
                skillImgBigSrc = bigSrc;
                licenseBigPhotoSetted = true;
            }
            licenseImages += skillImagePatternStr.formatObj({thumbSrc: thumbSrc, bigSrc: bigSrc});
        }

        resultHtml += skillPatternStr.format(skillImgSrc, skillImgBigSrc, userSkill.skill.name, userSkill.expiryDate.format('dd-mm-yyyy'), licenseImages, userSkill.id);
    }
    $('#skills-list').html(resultHtml);
}





//  ============================================================================

var snapshotForNewSkill = null;
function setSnapshotToNewSkillForm() {

    var afterSnapshot = function(result) {
        if (result.status === 'success') {
            snapshotForNewSkill = result.mediaFiles[0];
        }else{
            showErrorMessage(result.error);
        }
    };
    var afterChoseType = function(type){
        if(type === 'close'){return;}
        getImageFromCamera(type, afterSnapshot);
    };
    
    showDialogToChooseImageSourceType(afterChoseType);
    
}


function addNewSkill() {

    var form = $('#add-qualification-form');
    var formInputsValuesArr = getDataArrayFromForm(form);
    //check fields
    var errors = [];
    if (formInputsValuesArr['SkillMapping[expiry_date]'] === '') {
        errors.push('put expiry date');
    }
    if (errors.length > 0) {
        showErrorMessage(errors);
        return;
    }

    var urlToUpload = url.addSkill + '&contractor_id=' + user.id;

    var afterUpload = function(result) {
        $.unblockUI();
        if (result.status === 'success') {
            var obj = {userSkills: []};
            fill(obj, result.data);
            
            user.userSkills = obj.userSkills;
            showLicensesTab();
        } else {
            showErrorMessage(result.error);
        }
    };


    if (snapshotForNewSkill === null) {
        uploadAddSkillFormWithoutFile(urlToUpload, form.serialize(), afterUpload);
    } else {
        $.blockUI(blockParams);
        //alert('formInputsValuesArr \n '+dump(formInputsValuesArr))
        var now = new Date();
        var name = 'lcs_'+ now.format('dd-mm-yyyy_HH-MM-ss')+'.jpg';
        uploadFile(urlToUpload, snapshotForNewSkill, name, formInputsValuesArr, 'LicenseMapping[image]', afterUpload);
    }



}



function fillProfileForm(_user, formType) {
   //alert('dump user: 282 \n'+dump(user));
    
    var user = new User();
    user = _user;
    //alert('contractorProfile: 286 \n'+dump(user.contractorProfile) )
    //alert('contractorProfileChanges: 287 \n'+dump(user.contractorProfileChanges) )

    var contractorProfile = new ContractorProfile();
    contractorProfile = user.contractorProfile;
    
    var contractorProfileChanges = new ContractorProfileChanges();
    contractorProfileChanges = user.contractorProfileChanges;
    
    var usedProfile = contractorProfileChanges.id!==-1 ?
            contractorProfileChanges : contractorProfile;

    //contractorProfile = $.extend(true, {}, contractorProfile);//(contractorProfile);
    // next block is emulated == ading fields from user to contractor

    usedProfile.forename = user.forename;
    usedProfile.surname = user.surname;
    usedProfile.email = user.email;
    
    var postcode = new Postcode();
    postcode = usedProfile.postcode;
    var postCodeStr = postcode ? postcode.code : '';

    var form = null;

    var formElements;
    var attrName = null;
    var isEdit = false;
    if (formType === 'view') {
        form = $('#contractor-data-view');
        formElements = form.find('span');
        attrName = 'title';
        isEdit = false;
    } else {
        form = $('#contractor-data-form');
        formElements = form.find('input[type=text], textarea, select');
        attrName = 'name';
        isEdit = true;
    }
    var out = '';
    var foundOut = '';
    $(formElements).each(function() {

        var attribute = $(this).attr(attrName);
        if (!attribute || attribute === '') {
            attribute = '';
        }
        var attributeArray = attribute.split(/[\[\]]/);
        //alert(arr.length +'  '+ arr[1]);
        var formNameInner = '';
        if (attributeArray.length > 0) {
            formNameInner = attributeArray[1];
        } else {
            formNameInner = null;
        }

        for (var i in usedProfile) {
            out += 'formNameInner' + formNameInner + '  i:' + i + '  user[i]=' + usedProfile[i] + '\n';
            if (i && formNameInner && toCamelCase(i.toString()) === toCamelCase(formNameInner)) {
                foundOut += 'found formNameInner:  ' + formNameInner + '   i:' + i + '   contractorProfile[i]=' + usedProfile[i] + ' \n';
                if (isEdit) {
                    $(this).val(usedProfile[i]);
                } else {
                    $(this).html(usedProfile[i]);
                }
                break;
            }
        }
    });
    
    // avatar
    var avatarImgEl = form.find('.avatar-img');
    var thumbSrc = 'img/man_small.png';
    var bigSrc = 'img/man_small.png';
    var minusButton = form.find('.minus-button');
    if (contractorProfile.avatar !== null && contractorProfile.avatar !== '') {
        thumbSrc = url.avatarImage + user.username + '/thumb_' + contractorProfile.avatar;
        bigSrc = url.avatarImage + user.username + '/' + usedProfile.avatar;
        avatarImgEl.get(0).onclick = function() {
            openInFullScreenView(bigSrc);
        };
        minusButton.show();
    } else {
        avatarImgEl.get(0).onclick = null;
        minusButton.hide();
    }
    avatarImgEl.attr('src', thumbSrc);


    var dobValue = usedProfile.dob ? usedProfile.dob.format('dd-mm-yyyy') : '';
    var dobDate = usedProfile.dob ? usedProfile.dob : new Date(0);
    if (isEdit) {
        var userIdInput = form.find('input[name=ContractorData\\[user_id\\]]');
        userIdInput.val(user.id);

        var dobInput = form.find('input[name=ContractorData\\[dob\\]]');
        dobInput.val(null);
        var postcodeInput = form.find('input[name=ContractorData\\[postcode\\]]');
        postcodeInput.val(postCodeStr);

        dobInput.mobiscroll().date({
            //minDate: currDate,
            //endYear: currDate.getFullYear()+50, 
            dateFormat: 'yyyy-mm-dd'
        });
        dobInput.mobiscroll('setDate', dobDate, true, 0);

        formElements.each(function() {
            var bWidth = $(this).parent().find('b').width();
            $(this).css('left', (bWidth + 5) + 'px');
        });

    } else {
        var dobInput = form.find('span[title=User\\[dob\\]]');
        dobInput.html(dobValue);
        var postcodeInput = form.find('span[title=ContractorData\\[postcode\\]]');
        postcodeInput.html(postCodeStr);
    }


}

function showDialogToChooseImageSourceType(callback){
    var dialogJqEl = $('#photo-choser-dialog');
    var after = function(result){
        dialogJqEl.hide();
        openedDialog = null;
        callback(result);
    };
    
    dialogJqEl.show();
    $('#from-camera').off('click').on('click', function(){ after('camera'); });
    $('#from-saved').off('click').on('click', function(){ after('saved'); });
    $('#close-chooser').off('click').on('click', function(){ after('close'); });
    
    openedDialog = dialogJqEl;
}


function createDialogUploadLicense(skillMappingId) {
    
    var urlToUpload = url.addLicense + '&skillMappingId=' + skillMappingId + '&contractorId=' + user.id;

    var afterUpload = function(result) {
        $.unblockUI();
        if (result.status === 'success') {
            var obj = {};
            obj.userSkills = [];
            fill(obj, result.data);
            user.userSkills = obj.userSkills;
            showLicensesTab();
        } else {
            showErrorMessage(result.error);
        }
    };

    var processImage = function(result) {
        //alert('callback '+dump(result));
        if (result.status === 'success') {
            var formParams = new Object();
            formParams.LicenseMapping = 'true';
            formParams.ajax = 'true';
            var fileObj = result.mediaFiles[0];
            var now = new Date();
            var name = 'lcs_'+ now.format('dd-mm-yyyy_HH-MM-ss')+'.jpg';
            $.blockUI(blockParams);
            uploadFile(urlToUpload, fileObj, name, formParams, 'LicenseMapping[image]', afterUpload);
        } else {
            showErrorMessage(result.error);
        }
    };

    var afterChoseType = function(type){
        if(type === 'close'){return;}
        getImageFromCamera(type, processImage);
    };
    
    showDialogToChooseImageSourceType(afterChoseType);
    


}







function createHoliday() {
    var afterCreatingHoliday = function(result) {
        if (result.status === 'success') {
            buildContractorHolidayModel(result.data);
            $('#availability-calendar').DatePickerFill();
            $('#set-as-holiday-button').hide();
            $('#unset-as-holiday-button').show();
            $('.datepickerSelected a span').click();
        } else {
            showErrorMessage(result.error);
        }
    };

    var form = $('#set-as-holiday-form');
    var formData = getDataArrayFromForm(form);

    var params = {
        url: url.crateHoliday,
        type: 'POST',
        formData: formData
    };
    ajaxRequest(params, afterCreatingHoliday);
}



function deleteHoliday()
{
    var afterDeleteHoliday = function(result) {
        if (result.status === 'success') {
            buildContractorHolidayModel(result.data);
            $('#availability-calendar').DatePickerFill();
            $('#unset-as-holiday-button').hide();
            $('#set-as-holiday-button').show();
            $('.datepickerSelected a span').click();
        } else {
            showErrorMessage(result.error);
        }
    };

    var form = $('#unset-as-holiday-form');
    var formData = getDataArrayFromForm(form);

    var params = {
        url: url.deleteHoliday,
        type: 'GET',
        formData: formData
    };
    ajaxRequest(params, afterDeleteHoliday);
}




var jobsNearbyArr = null;
function buildJobsNearbyTab(needReload) {

    var position = null;
    var afterGettingAvailableJobs = function(result) {
        if (result.status === 'success') {
            var jobsArr = buildJobsWithRelations(result.data);
            //alert(dump(jobs));
            buildJobsNearbyList(jobsArr, position);
        } else {
            showErrorMessage(result.error);
        }
    };

    var afterGettingPosition = function(result) {
        if (result.status === 'success') {
            
            position = result.position;
            log(' position.latitude : '+ position.latitude +';   position.longitude : '+position.latitude);
            if (needReload || jobsNearbyArr === null) {
                getAvailableJobs(afterGettingAvailableJobs);
            } else {
                buildJobsNearbyList(jobsNearbyArr, position);
            }
        } else {
            showErrorMessage(eMsg.cannotGetPosition);
        }
    };

    getCurrentPosition(afterGettingPosition);
}


function buildJobsNearbyList(jobsArr, position)
{
    jobsNearbyArr = jobsArr;
    var htmlPatternStr = $('#available-job-list-item-pattern').html();
    var listJd = $('#available-jobs-list-items');
    var availabeJobsNotFoundJqEl = $('#available-jobs-not-found');
    
    availabeJobsNotFoundJqEl.hide();
    
    if(jobsArr.length === 0){
        availabeJobsNotFoundJqEl.show();
        listJd.html('');
        return;
    }
    
    var visibleItems = [];
    for (var i in jobsArr) {
        var visibleItem = {};
        var job = new Job();

        job = jobsArr[i];
        var week = new Week();
        week = job.week;
        var shift = new Shift();
        shift = week.shift;
        var postcode = new Postcode();
        postcode = shift.postcode;
        var area = searchAreaById(postcode.areaId, areas);
        var areaName = area ? area.area : 'area not found';


        visibleItem.jobId = job.id;
        visibleItem.jobNumber = shift.orderNumber;
        visibleItem.postcode = postcode.code;
        visibleItem.distance = getDistanceFromLatLonInKm(position.latitude, position.longitude, postcode.latitude, postcode.longitude);
        visibleItem.location = areaName;
        visibleItems.push(visibleItem);
    }

    // sorting list by distance
    visibleItems.sort(function(a, b) {
        if (a.distance > b.distance) {
            return 1;
        }
        if (a.distance < b.distance) {
            return -1;
        }
        return 0;
    });

    var htmlArr = [];
    for (var i in visibleItems) {
        var item = visibleItems[i];
        var htmlListItem = htmlPatternStr.format(item.jobId, item.jobNumber, item.postcode, item.location);
        htmlArr.push(htmlListItem);
    }
    
    listJd.html(htmlArr.join('\n'));


}



var clearDataInterval = 45*1000;
var myJobsArr = null;

/*
setInterval(function(){
    myJobsArr = null;
    jobsNearbyArr = null;
}, clearDataInterval);
*/

function buildMyJobsTab(needUpdate) {
    if (typeof needUpdate === 'undefined' || myJobsArr === null) {
        needUpdate = true;
    }
    if (needUpdate) {
        var afterGettingMyJobs = function(result) {
            if (result.status === 'success') {
                var jobsArr = buildJobsWithRelations(result.data);
                buildMyJobsList(jobsArr);
                myJobsArr = jobsArr;
            } else {
                showErrorMessage(result.error);
            }
        };

        getMyJobs(afterGettingMyJobs);
    } else {
        buildMyJobsList(myJobsArr);
    }
}


function buildMyJobsList(jobsArr) {
    var htmlPatternStr = $('#my-job-list-item-pattern').html();
    var myJobsNotFoundJqEl = $('#my-jobs-not-found');
    var listJd = $('#my-jobs-list-items');
    var visibleItems = [];
    myJobsNotFoundJqEl.hide();
    
    if(jobsArr.length === 0){
        myJobsNotFoundJqEl.show();
        listJd.html('');
        return;
    }
    
    for (var i in jobsArr) {
        var visibleItem = {};
        var job = new Job();

        job = jobsArr[i];
        var week = new Week();
        week = job.week;
        var shift = new Shift();
        shift = week.shift;
        var postcode = new Postcode();
        postcode = shift.postcode;


        visibleItem.jobId = job.id;
        visibleItem.jobNumber = shift.orderNumber;
        visibleItem.postcode = postcode.code;
        visibleItem.jobDate = job.date.format('dd-mm-yyyy');
        visibleItems.push(visibleItem);
    }

//    sorting list by distance
//    visibleItems.sort(function(a, b){
//        if(a.distance > b.distance){ return 1; }
//        if(a.distance < b.distance){ return -1; }
//        return 0;
//    });

    var htmlArr = [];
    for (var i in visibleItems) {
        var item = visibleItems[i];
        var htmlListItem = htmlPatternStr.format(item.jobId, item.jobNumber, item.postcode, item.jobDate);
        htmlArr.push(htmlListItem);
    }
    
    listJd.html(htmlArr.join('\n'));

}



var thisJobId = null;
function buildDeatilsForJob(viewType, jobId) {
    if(typeof(viewType) === 'undefined'){
        return;
    }
    if( !jobId ){ jobId = thisJobId; }
    else{ jobId = parseInt(jobId); }
    thisJobId = jobId;
    var jobArray = null;
    var backButton = $('#view-job-tab .back-button').get(0);
    var bookedByLineJqEl = $('#booked-by-line');
    if (viewType === 'availableJobs') {
        backButton.onclick = function() {
            showJobsNearbyTab(false);
        };
        jobArray = jobsNearbyArr;
        bookedByLineJqEl.hide();
    }
    if(viewType === 'myJobs'){
        backButton.onclick = function() {
            showMyJobsTab(false);
        };
        jobArray = myJobsArr;
        bookedByLineJqEl.show();
    }

    var job = new Job();
    for (var i in jobArray) {
        var jobItem = jobArray[i];
        if (jobId === jobItem.id) {
            job = jobItem;
        }
    }

    var week = new Week();
    week = job.week;
    var shift = new Shift();
    shift = week.shift;
    var postcode = new Postcode();
    postcode = shift.postcode;
    var additionalPays = job.additionalPays;
    var skill = new Skill();
    skill = searchSkillById(week.skillId);
    var clientData = new ClientDataLite();
    clientData = job.clientDataLite;
    var area = new Area();
    area = searchAreaById(postcode.areaId, areas);
    var areaName = area ? area.area : 'area not found';

    var pattern = $('#view-job-pattern').html();

    var extraPattern = ' <span > {name} : &pound; {price}</span> \n';
    var extrasNone = '';

    var extrasStr = '';
    if (additionalPays.length > 0) {
        for (var i in additionalPays) {
            var addPay = new AdditionalPay();
            addPay = additionalPays[i];
            var addPayType = new AdditionalPayType();
            addPayType = searchAdditionalPayTypeById(addPay.name);
            extrasStr += extraPattern.formatObj({
                name: addPayType.name,
                price: addPay.value
            });
        }
    } else {
        extrasNone = 'None';
    }

    var htmlStr = pattern.formatObj({
        jobNumber: shift.name,
        skillRequired: (skill ? skill.name : 'skill not found'),
        location: areaName,
        postcode: postcode.code,
        date: job.date.format('dd-mm-yyyy'),
        time: getJobTimeFromChar(job.dayNight),
        bookedBy: (clientData ? clientData.organizationName : 'client data not found'),
        extrasNone: extrasNone,
        extras: extrasStr
    });

    $('#view-job-container').html(htmlStr);



    var mapContainer = $('#view-job-map').get(0);
    var postcodeDefined = (postcode.id !== -1 && postcode.latitude) ? true : false;
    if (postcodeDefined) {
        var jobLatlng = new google.maps.LatLng(postcode.latitude, postcode.longitude);
    }

    var mapOptions = {
        zoom: 8,
        center: jobLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        
        panControl: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false
        
    };

    var voidMapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(54, -2),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        
        panControl: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false
    };
    
    var usedMapOptions = postcodeDefined ? mapOptions : voidMapOptions;

    var jobMap = new google.maps.Map(mapContainer, usedMapOptions);
    if (postcodeDefined) {
        var marker = new google.maps.Marker({
            position: jobLatlng,
            map: jobMap,
            title: areaName
        });
    } else {
        //marker.setMap(null);
    }
    
    $('.map').click(function(e){
        e.preventDefault();
        e.stopPropagation();
        var target = e.target;
        if(target.tagName === 'IMG'){
            return false;
        }
    });
    
    google.maps.event.addListenerOnce(jobMap, 'idle', function(){
        log('map loaded');
        $('.map img').click(function(e){
            e.preventDefault();
            e.stopPropagation();
            var a_href = $(e.target).parents('a').attr('href');
            openSiteInDefaultBrowser(a_href);
            return false;
        });
    });

}

function buildTimesheetsTab(needUpdate){
     if(needUpdate){
        var afterGettingTimesheets = function(result){
            if (result.status === 'success') {
                var timesheetsArr = result.data;
                user.contractorTimesheets = timesheetsArr;
                buildTimesheetsList(timesheetsArr);
                
            } else {
                showErrorMessage(result.error);
            }
            
        };
        
        getAllOfUser(afterGettingTimesheets);
    }else{
        buildTimesheetsList(user.contractorTimesheets);
    }
}


function buildTimesheetsList(contractorTimesheetsArr) {
    var htmlPatternStr = $('#timesheet-list-item-pattern').html();
    var unsubmittedHtmlPatternStr = $('#unsubmitted-timesheet-list-item-pattern').html();

    var visibleItems = [];
    for (var i in contractorTimesheetsArr) {
        var visibleItem = {};
        var contractorTimesheet = new ContractorTimesheet();

        contractorTimesheet = contractorTimesheetsArr[i];

        visibleItem.id = contractorTimesheet.id;
        visibleItem.dateBegin = contractorTimesheet.dateBegin;
        visibleItem.status = contractorTimesheet.status;

        visibleItems.push(visibleItem);
    }

    // sorting list by status and date
    visibleItems.sort(function(a, b) {
        if (a.status > b.status) {
            return 1;
        }
        if (a.status < b.status) {
            return -1;
        }

        if (a.dateBegin < b.dateBegin) {
            return 1;
        }
        if (a.dateBegin > b.dateBegin) {
            return -1;
        }

        return 0;
    });

    var htmlArr = [];
    for (var i in visibleItems) {
        var item = visibleItems[i];
        var htmlListItem = htmlPatternStr.formatObj({
            id: item.id,
            status: item.status,
            date: (item.dateBegin.format('dd/mm/yyyy')),
            dateInMillis: item.dateBegin.getTime()
        });
        htmlArr.push(htmlListItem);
    }
    $('#timesheet-list-items').html(htmlArr.join('\n'));

    // unsubmited

    var unsubmittedVirtualTimesheets = [];

    // search weeks mondays with jobs
    var currDate = new Date();

    var beginOfPeriod = new Date(2013, 0, 1);
    var endOfPeriod = new Date(currDate.setDate(currDate.getDate() + 21));
    var mondays = [];

    var periodHandled = false;
    var daysCount = 1;

    var tempDate = new Date(beginOfPeriod.getTime());
    while (!periodHandled) {
        tempDate = new Date(tempDate.setDate(tempDate.getDate() + daysCount));
        if (tempDate.getDay() === 1) {
            mondays.push(new Date(tempDate.getTime()));
            daysCount = 7;
        }
        if (tempDate > endOfPeriod) {
            periodHandled = true;
        }
    }

    var timesheets = user.contractorTimesheets;


    for (var i in mondays) {
        var currMonday = mondays[i];  // begin week
//        var currSunday = new Date(currMonday.getTime());
//            currSunday = new Date(currSunday.setDate(currSunday.getDate()+7));

        var jobsInPeriod = searchJobsForWeek(currMonday, user.jobs);
        var realTimesheetForPeriod = searchCreatedTimesheetForDate(currMonday, timesheets);
        if (jobsInPeriod.length > 0 && realTimesheetForPeriod === null) {
            unsubmittedVirtualTimesheets.push({date: currMonday});

        }
    }

    var unsubmittedHtmlArr = [];
    for (var i in unsubmittedVirtualTimesheets) {
        var virtualTimesheet = unsubmittedVirtualTimesheets[i];
        var htmlListItem = unsubmittedHtmlPatternStr.formatObj({
            date: (virtualTimesheet.date.format('dd-mm-yyyy')),
            dateInMillis: virtualTimesheet.date.getTime()
        });
        unsubmittedHtmlArr.push(htmlListItem);
    }
    $('#unsubmitted-timesheet-list-items').html(unsubmittedHtmlArr.join('\n'));

}



function buildSubmitTimesheetTab(viewType, dateImMillis) {
    var date = new Date(parseInt(dateImMillis));
    var jobs = searchJobsForWeek(date, user.jobs);

    var addPayPattern = $('#timesheet-add-pay-item-pattern').html();
    var addPayHtmlArr = [];

    $('#week-beginning-date').html(date.format('dd-mm-yyyy'));

    var form = $('#submit-timesheet-form');
    var selectboxes = form.find('select').each(function() {
        $(this).html(fillSelectboxXDNB());
        $(this).removeClass('disabled');
    });
    
    var inputs = form.find('input[type=text]').each(function(){
        $(this).removeClass('disabled');
    });

    var dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    var sumForWeek = 0;

    for (var i in dayNames) {
        var currDayName = dayNames[i];
        var currJob = null;
        for (var j in jobs) {
            var job = new Job();
            job = jobs[j];

            if (job.dayOfWeek === currDayName) {
                currJob = job;
                break;
            }
        }

        var selectboxForDay = form.find('#job-' + currDayName + '-shift');
        var inputForDay = form.find('#job-' + currDayName + '-hours');

        if (currJob !== null) {
            selectboxForDay.attr('disabled', null);
            selectboxForDay.val(job.dayNight);
            inputForDay.attr('disabled', null);
            inputForDay.val(currJob.hours);

            var payRate = currJob.payRate;
            if (isNaN(payRate)) {
                var week = currJob.week;
                var skill = searchSkillById(week.skillId);
                payRate = skill.payRate;
            }

            sumForWeek += currJob.hours * payRate;
            if (currJob.additionalPays.length > 0) {
                for (var i in currJob.additionalPays) {
                    var addPay = new AdditionalPay();
                    addPay = currJob.additionalPays[i];
                    sumForWeek += addPay.value;

                    var addPayListItem = addPayPattern.format({addPayType: addPay.objType, addPaySum: addPay.value});
                    addPayHtmlArr.push(addPayListItem);

                }

            }
        } else {
            selectboxForDay.attr('disabled', 'disabled');
            selectboxForDay.addClass('disabled');
            selectboxForDay.val('X');
            inputForDay.attr('disabled', 'disabled');
            inputForDay.addClass('disabled');
            inputForDay.val('');
        }

        if (viewType !== 'submit') {
            selectboxForDay.attr('disabled', 'disabled');
            inputForDay.attr('disabled', 'disabled');
        }

    }
    var submitTimesheetButton = $('#submit-timesheet-button');
    var submitTimesheetMessage = $('#submit-timesheet-message');
    if (viewType === 'submit') {
        submitTimesheetButton.show();
        submitTimesheetMessage.show();
    } else {
        submitTimesheetButton.hide();
        submitTimesheetMessage.hide();
    }

    $('#timesheet-add-pay-items').html(addPayHtmlArr.join('\n'));

    $('#total-sum-for-week').html(sumForWeek);


}


function fillSelectboxXDNB(selectedLetter) {
    var letters = ['X', 'D', 'N', 'B'];
    var pattern = '     <option value="{letter}" {isSelected}">{letter}</option>';
    var htmlArr = [];
    for (var i in letters) {
        var letter = letters[i];
        if (selectedLetter && letter === selectedLetter) {
            var isSelected = 'selected="selected"';
        }
        htmlArr.push(pattern.formatObj({letter: letter, isSelected: isSelected}));
    }
    return htmlArr.join('\n');
}


function buildMyCoursesTab(needUpdate) {
    if(needUpdate){
        var afterGettingMyCourses = function(result){
            if (result.status === 'success') {
                var coursesArr = buildMyCoursesWithRelation(result.data);
//                buildMyJobsList(jobsArr);
//                myJobsArr = jobsArr;
                buildMyCoursesList(user.userCourses);
                user.userCourses = coursesArr;
            } else {
                showErrorMessage(result.error);
            }
            
        };
        
        
        getMyCourses(afterGettingMyCourses);
    }else{
        buildMyCoursesList(user.userCourses);
    }
    
}


function buildMyCoursesList(coursesArr) {
    var htmlPatternStr = $('#my-courses-list-item-pattern').html();
    var visibleItems = [];
    var coursesArr = coursesArr;
    var listJd = $('#my-courses-list-items');
    
    var myCoursesNotFoundJqEl = $('#my-courses-not-found');
    myCoursesNotFoundJqEl.hide();
    if(coursesArr.length === 0){
        myCoursesNotFoundJqEl.show();
        listJd.html('');
        return;
    }
    
    for (var i in coursesArr) {
        var visibleItem = {};
        var userCourse = new UserCourse();
        userCourse = coursesArr[i];
        var course = new Course();
        course = userCourse.course;
        var postcode = new Postcode();
        postcode = userCourse.postcode;


        visibleItem.userCourseId = userCourse.id;
        visibleItem.name = course.name;
        //visibleItem.postcode = postcode.code;
        visibleItem.courseDate = course.date.format('dd-mm-yyyy');
        visibleItems.push(visibleItem);
    }


    var htmlArr = [];
    for (var i in visibleItems) {
        var item = visibleItems[i];
        var htmlListItem = htmlPatternStr.format(item.userCourseId, item.name, item.courseDate);
        htmlArr.push(htmlListItem);
    }
    listJd.html(htmlArr.join('\n'));

}




function buildDetailsForCourseTab(courseId) {
    courseId = parseInt(courseId);

    var userCoursesArr = user.userCourses;

    var userCourse = new UserCourse();
    for (var i in userCoursesArr) {
        var userCourseItem = userCoursesArr[i];
        if (courseId === userCourseItem.id) {
            userCourse = userCourseItem;
        }
    }
    var course = new Course();
    course = userCourse.course;
    var postcode = new Postcode();
    postcode = course.postcode;   // todo uncoment

    var area = new Area();
    area = searchAreaById(postcode.areaId, areas);  // todo uncoment
    var areaName = area ? area.area : 'area not found';

    var pattern = $('#view-course-pattern').html();

    var skill = new Skill();
    skill = searchSkillById(course.skillId);
    var qualification = skill.name;

    var description = course.description;

    var htmlStr = pattern.formatObj({
        title: course.name,
        location: areaName,
        postcode: postcode.code,
        date: course.date.format('dd-mm-yyyy'),
        time: course.time,
        qualification: qualification,
        description: description
    });

    $('#view-course-container').html(htmlStr);



    var mapContainer = $('#my-course-map').get(0);
    var postcodeDefined = (postcode.id !== -1 && postcode.latitude) ? true : false;
    if (postcodeDefined) {
        var latlng = new google.maps.LatLng(postcode.latitude, postcode.longitude);
    }

    var mapOptions = {
        zoom: 8,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var voidMapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(54, -2),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var usedMapOptions = postcodeDefined ? mapOptions : voidMapOptions;

    var map = new google.maps.Map(mapContainer, usedMapOptions);
    if (postcodeDefined) {
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: areaName
        });
    } else {
        //marker.setMap(null);
    }
    
    
    $('.map').click(function(e){
        e.preventDefault();
        e.stopPropagation();
        var target = e.target;
        if(target.tagName === 'IMG'){
            return false;
        }
    });
    
    google.maps.event.addListenerOnce(map, 'idle', function(){
        log('map loaded');
        $('.map img').click(function(e){
            e.preventDefault();
            e.stopPropagation();
            var a_href = $(e.target).parents('a').attr('href');
            openSiteInDefaultBrowser(a_href);
            return false;
        });
    });


}


function buildContactsTab(){
    
    var contactsPhoneJqEl = $('#contacts-phone');
    contactsPhoneJqEl.html(officePhone);
    
    var mapContainer = $('#contacts-map').get(0);
    
    var latlng = new google.maps.LatLng(53.323955, -0.947983);
    var mapOptions = {
        zoom: 7,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(mapContainer, mapOptions);
    
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: ''
    });
    
    
    $('.map').click(function(e){
        e.preventDefault();
        e.stopPropagation();
        var target = e.target;
        if(target.tagName === 'IMG'){
            return false;
        }
    });
    
    
    google.maps.event.addListenerOnce(map, 'idle', function(){
        $('.gm-style a[target=_blank]').click(function(e){
            e.preventDefault();
            e.stopPropagation();
            var a_href = $(e.target).parents('a').attr('href');
            openSiteInDefaultBrowser(a_href);
            return false;
        });

    });
    
}




function addOrChangeAvatar() {
    var urlToUpload = url.changeAvatar + '&id=' + user.id;
    var formParams = {
        ajax: true,
        'ContractorData[image]': ''
    };
    var fileKey = 'ContractorData[image]';

    var afterUpload = function(result) {
        $.unblockUI();
        if (result.status === 'success') {
            var changes = new ContractorProfile(result.data);
            //alert('changes\n'+dump(changes))
            user.contractorProfile = changes;
            fillProfileForm(user, 'edit');
            fillProfileForm(user, 'view');
        } else {
            showErrorMessage(result.error);
        }
    };

    var afterGettingImage = function(result) {
        //alert('afterGettingImage \n' +dump(result))
        if (result.status === 'success') {
            var mediaFile = result.mediaFiles[0];
            var now = new Date();
            var name = 'avt_'+ now.format('dd-mm-yyyy_HH-MM-ss')+'.jpg';
            $.blockUI(blockParams);
            uploadFile(urlToUpload, mediaFile, name, formParams, fileKey, afterUpload);
        } else {
            showErrorMessage(result.error);
        }
    };
    
    var afterChoseType = function(type){
        if(type === 'close'){return;}
        getImageFromCamera(type, afterGettingImage);
    };
    
    showDialogToChooseImageSourceType(afterChoseType);
    
}


function deleteAvatar() {
    var urlToDelete = url.deleteAvatar + '&id=' + user.id;
    var formData = {
        ajax: 'true'
    };
    var params = {
        url: urlToDelete,
        formData: formData
    };

    var afterDelete = function(result) {
        //alert('afterDelete \n' + dump(result))
        if (result.status === 'success') {
            user.contractorProfile = new ContractorProfile(result.data);
            fillProfileForm(user, 'edit');
            fillProfileForm(user, 'view');
        } else {
            showErrorMessage(result.error);
        }
    };
    ajaxRequest(params, afterDelete);
}