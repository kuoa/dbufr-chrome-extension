/**
 * Created by kuoa on 1/11/17.
 */

const alarmName = "check-dbufr-updates";
const url = "https://www-dbufr.ufr-info-p6.jussieu.fr/lmd/2004/master/auths/seeStudentMarks.php";

function compareGrades() {
    
}

function checkUpdates(config, alarm){

    var req = new XMLHttpRequest();

    req.open("GET", url, true);
    req.setRequestHeader("Authorization", "Basic " + btoa(config.login + ":" + config.password));
    req.withCredentials = true;

    req.onload = function () {

        if(req.readyState === 4){
            switch (req.status) {
                case 200 :
                    var grades = new GradeSet(this.responseText);
                    console.log(grades);
                    compareGrades(grades.gradesMap);
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

    console.log("Got an alarm!", alarm);
}

function configureScheduler(config){

    console.log("setting alarm " + config);

    /* set callback */
    chrome.alarms.onAlarm.addListener(function (alarm) {
        //checkUpdates(config, alarm);
    });


    /* create alarm */
    chrome.alarms.create(alarmName, {
        delayInMinutes: 0.1,
        periodInMinutes: 0.1
    });
}