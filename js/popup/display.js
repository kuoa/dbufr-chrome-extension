/**
 * Created by kuoa on 1/11/17.
 */


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
        '<thead> <tr class="active"> <th class="fix">UE</th>' +
        '<th>Contrôle<input class="form-control form-group-sm filter" type="text" placeholder="Search/Filter"></th>' +
        '<th>Note</th> </tr> </thead>' + '<tbody>';

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
            var id = grade.ue + grade.controle + grade.note;
            content += '<tr id="' + id.toLowerCase() + '"><td>'+ ue + '</td>' +
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

    /* change his glyphicon */
    $('#heading' + idCounter).children(0).children(0)
        .removeClass('glyphicon-chevron-down')
        .addClass('glyphicon-chevron-up');

    /* register filter function */
    $('.filter').keyup(function(event){

        /* i know :) */
        var rows = $(event.target).parent().parent().parent().siblings(0).children();

        var filterValue =  $(event.target).val().toLowerCase();
        var regexp = new RegExp(filterValue);

        filterGrades(regexp, rows);
    });


    /* open the last one */
    $('#collapse' + idCounter).addClass('in');

    /*  Change glyphicon image on click */
    $('.click-glyphicon').click( function(){
        $(this).toggleClass('glyphicon-chevron-down').toggleClass('glyphicon-chevron-up');
    });

    /* display the main pannel */
    $('.main-panel').show();
}

function hideProgressBar(){
    $('.loading-panel').hide('slow');
}

function showProgressBar(){
    $('.loading-panel').show('slow');
}

/**
 * Show the rows that match the regexp.
 * @param regexp
 * @param rows
 */
function filterGrades(regexp, rows){
    $(rows).each(function () {
        var rowContent = $(this).attr('id');

        if(rowContent.search(regexp) === -1){
            $(this).fadeOut(300, function () {
                $(this).hide();
            });
        }
        else{
            $(this).fadeIn(300, function () {
                $(this).show();
            });
        }
    });
}

function getDateTime(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var min = today.getMinutes();

    if(dd < 10) {
        dd='0' + dd
    }

    if(mm < 10) {
        mm='0'  +mm
    }

    return dd + '/' + mm+'/' + yyyy + " " + hh + ":" + min;
}