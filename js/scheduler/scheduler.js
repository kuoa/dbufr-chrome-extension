/**
 * Created by kuoa on 1/11/17.
 */

const alarmName = "dbufr-check-updates";
/**
 * [Function called by the scheduler when alarm rings]
 * @param config
 */
function checkUpdates(config){

    /* recover old grades from storage */
    chrome.storage.local.get({
            gradesMap: null
    },

        /* information recovered | do the request */
        function (data) {

            var oldGradesMap = data.gradesMap;

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

                            compareGrades(config, oldGradesMap, newGradesMap);
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

        });
}

/**
 * Configure scheduler alarm
 * @param config
 */
function configureScheduler(config){

    /* set callback */
    chrome.alarms.onAlarm.addListener(function (alarm) {
        checkUpdates(config);
    });

    /* create alarm */
    chrome.alarms.create(alarmName, {
        periodInMinutes: config.frequency * 60
    });

    console.log("Alarm created : " + config.frequency * 60);
}

