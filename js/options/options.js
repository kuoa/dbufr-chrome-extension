/**
 * Created by kuoa on 1/5/17.
 */

function saveOptions(){
    var userId = $('#student-id').val();
    var userPass = $('#student-pswd').val();
    var updateFreq = $('input[name=radio-frequency]:checked', '#options-form').val();

    var config = {
        login : userId,
        password : userPass,
        frequency : updateFreq
    };

    chrome.storage.sync.set (config,
        /* save complete */
        function () {

            /* automatic updates */
            configureScheduler(config);
            
            /* replace current message */
            $('#save-title').fadeOut(300, function () {
                $(this).text('Update complete. Alright alright alright').fadeIn(300);
            });

            /* restore old message */
            setTimeout(function () {
                $('#save-title').fadeOut(300, function () {
                    $(this).text('Options').fadeIn(300);
                });
            }, 1500);
        });
}

/**
 * Fills the options form with existing or default information.
 */
function fillUserInfo() {
    /* recover user informations */
    chrome.storage.sync.get({
            login : "",
            password : "",
            frequency : 0
        },

        /* function called on completion */
        function (items) {
            if (items.login != ""){
                $('#student-id').val(items.login);
            }
            if (items.password != ""){
                $('#student-pswd').val(items.password);
            }
            if (items.frequency != 0){
                $('#inline-radio' + items.frequency).prop('checked', true);
            }
        });
}

fillUserInfo();

$('#save-btn').click(function () {
    event.preventDefault();
    saveOptions();
});

