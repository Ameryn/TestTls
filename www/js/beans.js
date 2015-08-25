

function User(params)
{
    this.id = -1;
    this.username = '';
    this.forename = '';
    this.surname = '';
    this.password = '';
    this.roleId = -1;
    this.status = '';
    this.email = '';
    this.payrollNum = '';
    this.lastActivityDate = new Date();
    this.createdOn = new Date();
    
    this.role = {};
    this.userSkills = []; 
    this.jobs = [];
    this.shifts = [];
    this.notifications = [];
    this.userCourses = [];
    
    this.contractorProfile = {};
    this.contractorProfileChanges = {};
    this.contractorHolidays = [];
    this.contractorTimesheets = [];
    
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
        self.lastActivityDate = Date.parseYiiDate(self.lastActivityDate);
        self.createdOn = Date.parseYiiDate(self.createdOn);;
    };
    
    
    __constructor();
}



function ContractorProfile(params)
{
    this.id = -1;
    this.userId = -1;
    this.title = '';
    this.forename = '';
    this.surname = '';
    this.dob = new Date();
    this.nationalInsurance = '';
    this.landLineNumber = '';
    this.mobileNumber = '';
    
    this.kinName = '';
    this.kinMobile = '';
    this.kinRelationship = '';
    
    this.address_1 = '';
    this.address_2 = '';
    this.address_3 = '';
    this.address_4 = '';
    
    this.postcodeId = -1;
    this.bankName = '';
    this.accNumber = '';
    this.sortCode = '';
    this.paymentMethod = '';
    this.notes = '';
    
    this.avatar = '';
    this.rating = -1;
    this.lightStatus = new Date();
    
    this.postcode = {};
    
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
        self.dob = Date.parseYiiDate(self.dob);
        self.lightStatus = Date.parseYiiDate(self.lightStatus);
    };

    
    __constructor();

}

//ContractorProfileChanges = ContractorProfile;
//ContractorProfileChanges.prototype = new ContractorProfile(params);


function ContractorProfileChanges(params)
{
    this.id = -1;
    this.userId = -1;
    this.title = '';
    this.forename = '';
    this.surname = '';
    this.dob = new Date();
    this.nationalInsurance = '';
    this.landLineNumber = '';
    this.mobileNumber = '';
    
    this.kinName = '';
    this.kinMobile = '';
    this.kinRelationship = '';
    
    this.address_1 = '';
    this.address_2 = '';
    this.address_3 = '';
    this.address_4 = '';
    
    this.postcodeId = -1;
    this.bankName = '';
    this.accNumber = '';
    this.sortCode = '';
    this.paymentMethod = '';
    this.notes = '';
    
    this.avatarUrl = '';
    this.rating = -1;
    
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
        self.dob = Date.parseYiiDate(self.dob);
    };

    
    __constructor();

}



function Role (params)
{
    this.id = -1;
    this.roleDescription = '';
    
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
    };
    __constructor();
};



function UserSkill(params)
{
    this.id = -1;
    this.userId = -1;
    this.skillId = -1;
    this.expiryDate = new Date();
    this.picture = '';
    this.status = '';
    this.payRate = -1.0;
    
    this.skillLicenses = [];
    this.skill = [];
    
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
        self.expiryDate = Date.parseYiiDate(self.expiryDate);
    };
    __constructor();
}



//  {id:17, skill_mapping_id:4, licence_photo:1380711564alexis-img2.png}
function SkillLicense(params)
{
    this.id = -1;
    this.skillMappingId = -1;
    this.licencePhoto = '';
    
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
    };
    __constructor();
}



function Skill(params)
{
    this.id = -1;
    this.name = '';
    this.beginOfName = '';
    this.endOfName = '';
    this.payRate = -1.0;
    
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
    };
    __constructor();
}



function Job(params)
{
    this.id = -1;
    this.weekId = -1;
    this.contractorId = -1;
    this.status = '';
    this.hours = -1;
    this.date = new Date();
    this.dayNight = '';
    this.dayOfWeek = '';
    this.payRate = -1.0;
    this.published = false;
    
    this.week = {};
    this.additionalPays = [];
    this.clientDataLite = {};
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
        self.date = Date.parseYiiDate(self.date);
    };
    __constructor();
}



function ClientDataLite(params)
{
    this.organizationName = '';
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
    };
    __constructor();
}



function AdditionalPay(params)
{
    this.id = -1;
    this.name = '';
    this.description = '';
    this.value = -1.0;
    this.objType = '';
    this.objId = -1;
    this.createdOn = -1;
    this.createdBy = '';
    this.editedOn = -1;
    this.editedBy = '';
    /** ENUM('Client','TLS') */
    this.payer = '';
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
    };
    __constructor();
}



function AdditionalPayType(params)
{
    this.id = -1;
    this.name = '';
    this.hourly = false;
    
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
    };
    __constructor();
}



function Week(params)
{
    this.id = -1;
    this.shiftId = -1;
    this.skillId = -1;
    this.sat = '';
    this.sun = '';
    this.mon = '';
    this.tue = '';
    this.wed = '';
    this.thu = '';
    this.fri = '';
    
    this.shift = {};
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
    };
    __constructor();
}



function Shift(params)
{
    this.id = -1;
    this.clientId = -1;
    this.dateBegin = new Date();
    this.dayWeekBegin = '';  //enum sat, mon
    this.name = '';
    this.notes = '';
    this.postcodeId = -1;
    this.siteId = -1;
    this.orderNumber = '';
    this.archive = false;
    this.createdOn = -1;
    this.createdBy = '';
    this.editedOn = -1;
    this.editedBy = '';
    /**  ENUM('UNSUBMITTED','SUBMITTED','UNPAID','PAID') */
    this.status = '';
    this.dateBeginPayment = new Date();
    this.datePayment = new Date();
   
    this.postcode = {};
    
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
        self.dateBeginPayment = Date.parseYiiDate(self.dateBeginPayment);
        self.datePayment = Date.parseYiiDate(self.datePayment);
    };
    __constructor();
}


function ContractorTimesheet (params)
{
    this.id = -1;
    this.contractorId = -1;
    this.dateBegin = new Date();
    /** ENUM('unsubmitted','pending1','submitted for approval','pending2','approved awaiting payment')*/
    this.status = '';
    this.note = '';
    
    this.monJob = -1;
    this.tueJob = -1;
    this.wedJob = -1;
    this.thuJob = -1;
    this.friJob = -1;
    this.satJob = -1;
    this.sunJob = -1;
    
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
        self.dateBegin = Date.parseYiiDate(self.dateBegin);
    };
    __constructor();
};



function Postcode(params)
{
    this.id = -1;
    this.areaId = -1;
    this.code = '';
    this.codeSearch = '';
    this.county = '';
    this.latitude = -1.0;
    this.longitude = -1.0;
    
    this.area = {};
    
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
    };
    __constructor();
}



function Area(params)
{
    this.id = -1;
    this.area = '';
    this.parentId = -1;
    this.parent = false;
    
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
    };
    __constructor();
}



function ContractorHoliday(params)
{
    this.id = -1;
    this.userId = -1;
    this.holidayDate = new Date();
    this.reason = '';
    this.holidayStatus = false;
    
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
        self.holidayDate = Date.parseYiiDate(self.holidayDate);
    };
    __constructor();
}



function Notification(params)
{
    this.id = -1;
    this.authorId = -1;
    this.date = new Date();
    this.text = '';
    this.url = '';
    
    //this.mappingId = null;
    //this.userId = null;// authorId = null; // id of user, was created notification 
    
    //this.redirect = null;
    //this.active = null;
    //this.addresseeId = null;
    //this.status = null;
    
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
        self.date = Date.parseYiiDate(self.date);
        self.setRedirect(params.url);  // todo change
    };
    
    
    this.setRedirect = function(urlObjStr){   // todo change
        // "url":"\/index.php?r=jobs\/myJobs",
        this.redirect = {};
        var page = urlObjStr.substring(urlObjStr.indexOf('?r=') );
        this.redirect.page = page;
        
    };
    
    __constructor();
}



function UserCourse (params)
{
    this.id = -1;
    this.contractorId = -1;
    this.courseId = -1;
    this.read = -1;
    
    this.course = {};
    
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
    };
    __constructor();
};



function Course(params)
{
    this.id = -1;
    this.name = '';
    this.date = new Date();
    this.time = '';
    this.address = '';
    this.description = '';
    this.postcodeId = -1;
    this.skillId = -1;
    
    this.postcode = {};
    
    
    var self = this;
    var __constructor = function() {
        fill(self, params);
        self.date = Date.parseYiiDate(self.date);
    };
    __constructor();
};




function fill(object, params){
    if(params){
        //object = setToNullAllVariables(object);
        var msg = '';
        for(var currParam in params){
            //alert(currParam+"  "+params[currParam]);
            //alert('typeof self.'+currParam+': '+typeof self[currParam]);
            var camelCasedParam = toCamelCase(currParam);
            var currParamValue = params[currParam];
            
            // param is object like Week, Shift  and it is not null
            if(typeof currParamValue === 'object' & currParamValue !== null & !isArray(currParamValue)){
                var className = ''+currParam;
                
                if ( !( window[className] && typeof(window[className]) === 'function') ) { 
                    // function with name 'window[className]' not exists
                    msg+=('Object with name "'+className+'" not exists \n');
                    continue;
                }
                
                var currParamName = currParam[0].toLowerCase()+ currParam.slice(1);
                var nestedClass = new window[className]( params[currParam]);
                object[currParamName] = nestedClass;
                continue;
            }
            
            // param is array of some objects
            if(typeof currParamValue === 'object' & currParamValue !== null & isArray(currParamValue)){
                
                // deleting letter 's' example  Shifts => Shift
                var className = currParam.slice(0, -1);
                
                if ( !( window[className] && typeof(window[className]) === 'function') ) { 
                    // function with name 'window[className]' not exists
                    msg+=('Object with name "'+className+'" not exists \n');
                    continue;
                }
                
                var currParamValueArr = currParamValue;
                var nestedClassesArr = [];
                for(var i in currParamValueArr){
                    var nestedClass = new window[""+className]( currParamValueArr[i]);
                    nestedClassesArr.push(nestedClass);
                }
                var currParamName = currParam[0].toLowerCase()+ currParam.slice(1);
                object[currParamName] = nestedClassesArr;
                continue;
            }
            
            // param is null-type
            if(typeof currParamValue === 'object' & currParamValue === null){
                // if null-type is object(class)
                if( window[currParam] && typeof(window[currParam]) === 'function'){
                    var nestedClass = new window[""+currParam]();
                    var currParamName = currParam[0].toLowerCase()+ currParam.slice(1);
                    object[currParamName] = nestedClass;
                    
                }
                // if null-type is simple param
                else{
                    object[camelCasedParam] = null;
                }
                
            }
            
            
            if(typeof object[camelCasedParam] !=="undefined" && object[camelCasedParam] !==null){
           // if(!(camelCasedParam in object)){
            var type = typeof object[camelCasedParam];
                var currParamValueWithType = getVariableWithItRealType(type, currParamValue);
                object[camelCasedParam] = currParamValueWithType; //currParamValue;
            }else{
               // msg+=("variable  '"+camelCasedParam+"' not found in object '"+object.constructor.name+ "' ::  create it or change model ! \n");
            }
        }
        //msg += check(object);
        if(msg!==''){
            alert(msg);
            //log(msg);
        }
    }else{
        //object = null;
    }
}


function getVariableWithItRealType(type, value){
    
    if(type === 'number'){ return parseFloat(value); }
    return value;
}



function check(object){
    var objClassName = getObjectClass(object);
    var msg = '';
    if(object === null || typeof(object)==='undefined'){ 
        msg += 'object'+ objClassName +' is null';
    }else{
        for(var attr in object){
//            if(typeof(object[attr])==='undefined'){
//                msg += objClassName+'['+ attr +'] is undefined \n';
//            }
            if(object[attr] === null){
                msg += objClassName+'['+ attr +'] is null or undefined \n';
            }
        }
    }
    return msg;
}

function getObjectClass(obj){
   if (typeof obj !== "object" || obj === null) return false;
   else return /(\w+)\(/.exec(obj.constructor.toString())[1];
}

function toCamelCase(input) {
    return input./*toLowerCase(). */replace(/_([A-z])/g, function(match, group1) {
        return group1.toUpperCase();
    });
}

function setToNullAllVariables(object){
    for(var attr in object){
        var isDate = Object.prototype.toString.call(object[attr]) === '[object Date]';
        if(isArray(object[attr]) ){ continue; }
        if(typeof object[attr] === 'object' & !isDate ){
                continue;
        }
        if(typeof object[attr] === 'function' ){
                continue;
        }
        object[attr] = null;
    }
    return object;
}

/*
function toCamelCase(input) {
    for(var i=0; i<input.length; i++){
        if(input[i]=='_'){
            if(input[i+1]){ input[i+1] = input[i+1].toUpperCase(); }
            input.replaceAt(i, '');
            i++;
        }
    }
    
    return input;
}
*/