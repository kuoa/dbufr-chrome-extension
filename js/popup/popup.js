/**
 * Created by kuoa on 12/20/16.
 */


/****** extension logic ******/
const url = "https://www-dbufr.ufr-info-p6.jussieu.fr/lmd/2004/master/auths/seeStudentMarks.php";

/**
 * Connects to the DBUFR server and recovers the student's grades
 * @param config
 * @param successCallback
 * @param loginErrorCallback
 * @param networkErrorCallback
 */
function getDbufrData(config, successCallback, loginErrorCallback, networkErrorCallback) {

    var req = new XMLHttpRequest();

    req.open("GET", url, true);
    req.setRequestHeader("Authorization", "Basic " + btoa(config.login + ":" + config.password));
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
 * Function called on XMLHttpRequest successful completion
 * @param html
 */
function displayData(html){
    var grades = new GradeSet(html);

    createNewView(grades);
}

/**
 * Function called on XMLHttpRequest 401 error code
 * @param msg
 */
function displayLoginError(msg){

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
function displayNetworkError(msg){

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
    $('#retry-button').on('click', function () {

        initializeExtension();
        $('.error-panel').hide('slow');
    });
}

/**
 * DBUFR extension routine
 */
function initializeExtension(){

    /* number of new grades [badge] */
    removeBadge();

    showProgressBar();

    /* recover user informations from storage */
    chrome.storage.sync.get({
        login : "",
        password : "",
        frequency : 1,
        notifications : true,
        gradesMap: null
    },

        /* information recovered | do the request */
        function (config) {

            configureScheduler(config);
            
            getDbufrData(config, displayData, displayLoginError, displayNetworkError);
        });
}

document.addEventListener('DOMContentLoaded', initializeExtension);

