/**
 * Created by kuoa on 1/11/17.
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
};
