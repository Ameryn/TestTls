var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var deviceIsReady = false;





function onDeviceReady() {
    log('Device is ready');
    deviceIsReady = true;
    
    correctiveScale();
    initPushPlugin();
    
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    
    document.addEventListener('backbutton', function (e) {
        e.preventDefault();
        
        if(openedDialog!==null){
            closeInfoDialog();
            return;
        }
        
        $('.page:visible').find('.back-button').click();
    }, false );
    
    document.addEventListener('menubutton', function(e){ 
        e.preventDefault();
        
        function onConfirm(buttonIndex){
            if(buttonIndex === 2){
                exitFromApp();
            }
        }
        
        navigator.notification.confirm(
            'Exit from app?',  // message
            onConfirm,              // callback to invoke with index of button pressed
            'Exit',            // title
            'Cancel,Ok'          // buttonLabels
        );
    }, false);
    
}

document.addEventListener("deviceready", onDeviceReady, false);

function isDeviceReady(){
    if(deviceIsReady === false){
        showErrorMessage('device not ready');
        log('device not ready');
        return false;
    }
    return true;
}


function getImageFromCamera(type, callback){
    if(! isDeviceReady() ){ return false; }
    //alert(dump(Camera.PictureSourceType));
    //alert(dump(Camera.DestinationType));
    var sourceType = Camera.PictureSourceType.CAMERA;
    if(type === 'saved'){
        sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;//   PHOTOLIBRARY;
    }
    navigator.camera.getPicture(
        function(mediaFiles){
            if( typeof ( mediaFiles ) === 'string' ) {
                var fileObj = {};
                fileObj.fullPath = mediaFiles;
                fileObj.name = mediaFiles.substr(mediaFiles.lastIndexOf('/')+1);
                mediaFiles = [];
                mediaFiles.push(fileObj);
            }
            log('photo captured success');
            callback({status:'success', mediaFiles: mediaFiles});
            
        },
    
        function(message){
            if(message.indexof('no image selected')>-1 ){
                // no need to show error message;
            }else{
                log('error on capturing photo: '+message);
                callback({status:'error', error: message});
            }
        },
        
        {
            quality: 90,
            destinationType: Camera.DestinationType.FILE_URI ,
            sourceType: sourceType
        }
    );
    
}





function uploadFile(url, mediaFile, filename, formParams, fileKey, callback) {
    if(! isDeviceReady() ){
        callback({status:'error', error: eMsg.tryLater});
        return false;
    }
    
    if(isMobile){
        var isConnected = checkConnection();
        if(!isConnected){
            //callback({status:'error', error: eMsg.tryLater});
            $.unblockUI();
            return false; 
        }
    }
    
    //alert(url +'\n' + dump(mediaFile)+ '\n'+filename +'\n'+dump(formParams)+ '\n'+fileKey);
    var path = mediaFile.fullPath;
    var name = filename ? filename: mediaFile.name;
    
    var options = new FileUploadOptions();
    options.fileKey = fileKey;
    options.fileName = name;
    options.mimeType = "image/jpeg";

    options.params = formParams;
    options.chunkedMode = false;
    options.headers = {
        Connection: "close"
     };
    
    
    
    var ft = new FileTransfer();
    ft.upload( path, url,
        function(result) {
            result = JSON.parse( result.response );
            var status = result.status;
            if(status === 'success' ){
                log('photo uploaded success');
                callback({status:'success', data: result.data});
            }else{
                log('error after uploading file: '+dump(result));
                
                callback({status:'error', error: result.errors});
            }
            
        },
        function(errorObj) {
            log('error on uploading file: '+dump(errorObj));
            callback({status:'error', error: eMsg.tryLater});
        },
        options
    );
    
    var timeout = setTimeout(function(){
        ft.abort();
        log('reached timeout for estabilish connection');
        return false;
    }, 10000 );
        
    ft.onprogress = function(progressEvent) {
        clearTimeout(timeout);
        if (progressEvent.lengthComputable) {
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            $('#block-text').html(perc+' % '); //loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
        } else {
            $('#block-text').html('uploading...');
        }
    };
}



function getCurrentPosition(callback){
    //if(! isDeviceReady() ){ return false;}
    //alert('getCurrentPosition called  \n'+ isDeviceReady() );
    navigator.geolocation.getCurrentPosition(
        function(position){
            callback({status: 'success', position: position.coords});
        }, 
        function(error){
            callback({status: 'error', error: error});
        }
    );
}
