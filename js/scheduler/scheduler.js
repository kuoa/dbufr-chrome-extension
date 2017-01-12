/**
 * Created by kuoa on 1/11/17.
 */

const alarmName = "dbufr-check-updates";

function checkUpdates(config){


    var oldGradesMap = config.gradesMap;

    /* testing */
    console.log("removing grade");
    delete oldGradesMap["4I801-2016oct[examen-reparti-1] 2 novembre"];
    delete oldGradesMap["4I501-2016oct[partiel] creation du 30-11-2016-108"];

    var req = new XMLHttpRequest();

    req.open("GET", url, true);
    req.setRequestHeader("Authorization", "Basic " + btoa(config.login + ":" + config.password));
    req.withCredentials = true;

    req.onload = function () {

        if(req.readyState === 4){
            switch (req.status) {
                case 200 :
                    var grades = new GradeSet(this.responseText);
                    var newGradesMap = grades.gradesMap;

                    console.log(grades);

                    compareGrades(oldGradesMap, newGradesMap);
                    break;

                case 401 :
                    console.log("Numéro d'étudiant ou mot de passe incorrect");
                    break;
            }
        }
    };

    req.onerror = function () {

        console.log("Erreur inattendue de réseau");
    };

    req.send();

    console.log("Got an alarm!");
}

function configureScheduler(config){

    /* set callback */
    chrome.alarms.onAlarm.addListener(function (alarm) {
        checkUpdates(config);
    });


    /* create alarm */
    chrome.alarms.create(alarmName, {
        /* needs to be * 60 */
        periodInMinutes: config.frequency/10
    });
}

