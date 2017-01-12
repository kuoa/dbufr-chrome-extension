/**
 * Created by kuoa on 1/11/17.
 */

/**
 * Student grade object
 * @param ue
 * @param controle
 * @param note
 * @constructor
 */
var Grade = function(ue, controle, note){
    this.ue = ue;
    this.controle = controle;
    this.note = note;
};

/**
 * GradeSet collection of grades
 * @param html
 * @constructor
 */
var GradeSet = function(html){

    /* obtain a jQuery object from raw html */
    var jHtml = $.parseHTML(html),
        student = $(jHtml).children()[2].textContent.split(",");

    this.firstName = student[1].trim().charAt(0).toUpperCase() + student[1].substr(2);
    this.lastName = student[0].trim();

    var gradesTable = $(jHtml).find('.Table')[1],
        gradesRows = $(gradesTable).find("tr");

    var tempList = [],
        tempMap = {};

    gradesRows.each(function(index, value) {
        var fields = $(value).children();
        var grade = new Grade(fields[0].textContent, fields[1].textContent, fields[2].textContent);
        var key = fields[0].textContent + fields[1].textContent;

        tempList.push(grade);
        tempMap[key] = grade;
    });

    this.gradesList = tempList;      /* unsorted grades Map used for local storage */
    this.gradesMap = tempMap;        /* sorted grades List used for printing */

    /* save to local storage */
    saveGradeData(this.gradesMap);
};

/**
 * Save current grades to local storage
 * @param grades
 */
function saveGradeData(grades){

    var config = {gradesMap : grades};

    chrome.storage.local.set (config,
        /* save complete */
        function () {
            console.log("New grades saved");
        });
}

/**
 * [Function called by the scheduler]
 * Compare old vs new grades.
 * @param oldGrades
 * @param newGrades
 */
function compareGrades(config, oldGrades, newGrades){

    /* if first run */
    if(oldGrades === null){
        return;
    }

    var notifyGrades = [];

    for (var key in newGrades) {

        /* check if map key */
        if (newGrades.hasOwnProperty(key)) {
            //console.log("checking for " + key + " -> " + newGrades[key]);

            /* compare to old grades */
            if(!oldGrades.hasOwnProperty(key)){

                var grade = newGrades[key];

                notifyGrades.push({title : grade.ue, message: grade.controle});

                //console.log("new grade found for " +  key + " -> " + newGrades[key]);
            }
        }
    }

    if(notifyGrades.length != 0){
        //console.log("Found new grades " + notifyGrades);

        createBadge(notifyGrades.length.toString());

        if(config.notifications){
            createNotification(notifyGrades);
        }
    }
}

