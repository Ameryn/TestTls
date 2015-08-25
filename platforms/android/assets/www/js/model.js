
function buildUserModel(data){
    var user = new User(data);
    return user;
}


function buildTimesheetsModel(data){
    var timesheetsResp = data;
    var object = new Object();
    object.contractorTimesheets = [];
    fill(object, timesheetsResp);
    var timesheets = object.contractorTimesheets;
    return timesheets;
}


function getContractorHolidayByDate(date){
    for(var i in user.contractorHolidays){
        var holiday = user.contractorHolidays[i];
        var hDate = new Date( Date.parse(holiday.holidayDate) );
        if( date.getDate()  === hDate.getDate() &&
            date.getMonth() === hDate.getMonth() &&
            date.getYear()  === hDate.getYear() )
        {
            return holiday;
        }
    }
    return null;
}


function buildContractorHolidayModel(data){
    
    var holidaysArr = [];
    for(var chIter in data){
        holidaysArr.push( new ContractorHoliday(data[chIter]) );
    }
    user.contractorHolidays = holidaysArr;
    //store.setItem('user', JSON.stringify(user));

    return user.contractorHolidays;
}


function buildJobsWithRelations(data){
    var availableJobs = [];
    for(var i in data){
        var jobData = data[i];
        var job = new Job(jobData);
        
        //job.week = new Week(jobData.Week);
        //job.week.shift = new Shift(jobData.Week.Shift);
        //job.week.shift.postcode = new Postcode(jobData.Week.Shift.Postcode);
        
        availableJobs.push(job);
    }
    
    return availableJobs;
}


function buildMyCoursesWithRelation(data){
    var courses = [];
     for(var i in data){
        var courseData = data[i];
        var course = new Job(courseData);
        courses.push(course);
    }
    
    return courses;
}


function searchAreaById(id, areas){
    for(var i in areas){
        var area = areas[i];
        if(area.id == id){
            return area;
        }
    }
    return null;
}


function searchSkillById(id){
    for(var i in skills){
        var skill = new Skill();
            skill = skills[i];
        if(skill.id == id){
            return skill;
        }
    }
    return null;
}


function searchAdditionalPayTypeById(id){
    for(var i in additionalPayTypes){
        var additionalPayType = new AdditionalPayType();
            additionalPayType = additionalPayTypes[i];
        if(additionalPayType.id == id){
            return additionalPayType;
        }
    }
    return null;
}


function searchJobsForWeek(dateFrom, jobsArr){
    var dateTo = new Date(dateFrom.getTime());
        dateTo = new Date(dateTo.setDate(dateTo.getDate()+7));
    var jobs = searchJobsInPeriod(dateFrom, dateTo, jobsArr)
    return jobs;
}


function searchJobsInPeriod(dateFrom, dateTo, jobsArr){
    var findedJobs = [];
    for(var i in jobsArr){
        var job = new Job();
        job = jobsArr[i];
        if(job.date >= dateFrom  && job.date < dateTo){
            findedJobs.push(job);
        }
    }
    return findedJobs;
}


function searchCreatedTimesheetForDate(date, timesheetsArr){
    for(var t in timesheetsArr){
        var timesheet = new ContractorTimesheet();
        timesheet = timesheetsArr[t];
        var timesheetDateBegin = timesheet.dateBegin;
        if(date.getTime() == timesheetDateBegin.getTime()){
            return timesheet;
        }
    }
    return null;
}
