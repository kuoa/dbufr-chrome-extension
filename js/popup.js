/**
 * Created by kuoa on 12/20/16.
 */

/****** listeners ******/

/****** extension logic ******/
const url = "https://www-dbufr.ufr-info-p6.jussieu.fr/lmd/2004/master/auths/seeStudentMarks.php";

function getDateTime(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var min = today.getMinutes();

    if(dd<10) {
        dd='0' + dd
    }

    if(mm<10) {
        mm='0'  +mm
    }


    return dd + '/' + mm+'/' + yyyy + " " + hh + ":" + min;
}

/**
 * Grade object used in a GradeSet
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
};

/**
 * Acquires the html content of the student page.
 * @param user
 * @param pass
 * @param successCallback function called on onSuccess
 * @param errorCallback function called on error
 */
function getDbufrData(user, pass, successCallback, loginErrorCallback, networkErrorCallback) {

    var req = new XMLHttpRequest();

    req.open("GET", url, true);
    req.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + pass));
    req.withCredentials = true;

    req.onload = function () {

        hideProgressBar();

        if(req.readyState === 4){
            switch (req.status) {
                case 200 :
                    successCallback(this.responseText);
                    break;

                case 401 :
                    loginErrorCallback(" Numéro d'étudiant ou mot de passe incorrect");
                    break;
            }
        }
    };

    req.onerror = function () {

        hideProgressBar();

        networkErrorCallback(" Erreur inattendue de réseau");
    };

    req.send();
}

/**
 * Generates a new extension view
 * @param gradeSet
 */
function createNewView(gradeSet){

    /* display name */
    var welcome = "Bonjour " + gradeSet.firstName + " " + gradeSet.lastName;
    $('#welcome').text(welcome);

    /* display description */
    var description = "Cette page présente les inscriptions et notes de <strong>" +
        gradeSet.firstName + " " + gradeSet.lastName +
        "</strong> telles que connues et affichées au <strong>" + getDateTime() + "</strong>";

    $('#description').html(description);

    /* create and display the grade Table */
    createTable(gradeSet);
}

function tableHeaderHtml(idCounter, title) {
    var headerMold = '<div class="panel panel-default">' +
        '<div class="panel-heading" role="tab" id="heading'+ idCounter + '">' +
        '<h4 class="panel-title">' +
        '<span role="button" class="glyphicon glyphicon-chevron-down pull-right click-glyphicon" aria-hidden="true"' +
        'data-toggle="collapse" data-parent="#accordion" href="#collapse' + idCounter + '"' +
        'aria-expanded="true" aria-controls="collapse' + idCounter + '"></span>' +
        title + '</h4>' + '</div>';
    
    return headerMold;
}

function tableContentStartHtml(idCounter) {
    var contentMoldStart ='<div id="collapse' + idCounter + '" class="panel-collapse collapse" ' +
        'role="tabpanel" aria-labelledby="heading"'+'idCounter' + '">' +
        '<div class="panel-body">' +
        '<table class="table table-bordered table-condensed" id="table"' + idCounter +'">' +
        '<thead> <tr class="active"> <th>UE</th> <th>Contrôle</th> <th>Note</th> </tr> </thead>' + '<tbody>';

    return contentMoldStart;
}

function tableContentEndHtml() {
    var contentMoldEnd = '</tbody></table> </div> </div> </div>';
    return contentMoldEnd;
}

function createTable(gradeSet) {

    /* table id */
    var idCounter = 1;

    var tableNb = gradeSet.gradesList[1].ue.charAt(0);

    /* table html */
    var content = tableHeaderHtml(idCounter, tableNb +"I000") +
        tableContentStartHtml(idCounter);


    /* starting at 1 since 0 contains headers */
    for(var i = 1; i < gradeSet.gradesList.length; i++){

        var grade = gradeSet.gradesList[i];
        var note = grade.note.split("/");
        var ue = grade.ue.split("-")[0];

        /* grade goes in the same table */
        if(ue.charAt(0) == tableNb){
            content += '<tr><td>'+ ue + '</td>' +
                '<td>' + grade.controle + '</td>' +
                '<td><strong>' + note[0] +'</strong>/' + note[1] +'</td> </tr>';
        }
        /* grades need a new table, so create one */
        else{
            /* end current table */
            content += tableContentEndHtml();

            idCounter++;
            tableNb = grade.ue.charAt(0);

            /* start new table */
            content += tableHeaderHtml(idCounter, tableNb +"I000") +
                    tableContentStartHtml(idCounter);

            /* redo same grade since it was skipped */
            i--;
        }
    }

    content += tableContentEndHtml();

    /* append table */
    $('#accordion').append(content);
    /* color the last one */
    $('#heading' + idCounter).parent()
        .removeClass('panel-default').addClass('panel-info');
    /* open the last one */
    $('#collapse' + idCounter).addClass('in');

    /*  Change glyphicon image on click */
    $('.click-glyphicon').click( function(){
        $(this).toggleClass('glyphicon-chevron-down').toggleClass('glyphicon-chevron-up');
    });

    /* display the main pannel */
    $('.main-panel').show();
}


/**
 * Function called on XMLHttpRequest successful completion
 * @param html
 */
function onSuccess(html){
    var grades = new GradeSet(html);

    createNewView(grades);
}

/**
 * Function called on XMLHttpRequest 401 error code
 * @param msg
 */
function onLoginError(msg){

    var content = '<h3 class="text-center"></h3>' +
        '<div class="alert alert-warning" role="alert">' +
        '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
        '<span class="sr-only">Error:</span>' + msg +
        '<span href="options page" class="alert-link pull-right" role="button">' +
        '<span class="glyphicon glyphicon-cog" aria-hidden="true" id="options-button"></span>' +
        '</span> </div>';

    /* display content */
    $('.error-panel').html(content).show();

    /* click listener */
    $('#options-button').on('click', function () {
        if (chrome.runtime.openOptionsPage) {
            // New way to open options pages, if supported (Chrome 42+).
            chrome.runtime.openOptionsPage();
        } else {
            // Reasonable fallback.
            window.open(chrome.runtime.getURL('options.html'));
        }
    });
}

/**
 * Function called on XMLHttpRequest network error
 * @param msg
 */
function onNetworkError(msg){

    var content = '<h3 class="text-center"></h3>' +
        '<div class="alert alert-danger" role="alert">' +
        '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
        '<span class="sr-only">Error:</span>' + msg +
        '<span class="alert-link pull-right" role="button">' +
        '<span class="glyphicon glyphicon-repeat" aria-hidden="true" id="retry-button"></span>' +
        '</span> </div>';

    /* display content */
    $('.error-panel').html(content).show();

    /* click listener */
    $('#retry-button').on('click', initializeExtension);
}

function hideProgressBar(){
    $('.loading-panel').hide('slow');
}

function showProgressBar(){
    $('.loading-panel').show();
}

function initializeExtension(){

    showProgressBar();

    /* recover user informations from storage */
    chrome.storage.sync.get({
            login : "",
            password : "",
            frequency : 24
        },

        /* information recovered | do the request */
        function (items) {
            getDbufrData(items.login, items.password, onSuccess, onLoginError, onNetworkError);
        });
}

document.addEventListener('DOMContentLoaded', initializeExtension);
