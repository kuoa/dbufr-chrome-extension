/**
 * Created by kuoa on 1/5/17.
 */

/**
 * Save user options on local storage
 */
function saveOptions(){
    var userId = $('#student-id').val();
    var userPass = $('#student-pswd').val();
    var updateFreq = parseInt($('input[name=radio-frequency]:checked', '#options-form').val());
    var dsktNotif = $('#dskt-notify').is(':checked');


    var config = {
        login : userId,
        password : userPass,
        frequency : updateFreq,
        notifications : dsktNotif
    };

    chrome.storage.sync.set (config,
        /* save complete */
        function () {
            
            /* replace current message */
            $('#save-title').fadeOut(300, function () {
                $(this).text('Saving options').fadeIn(300);
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
        frequency : 6,
        notifications : true
    },

        /* function called on completion */
        function (items) {
            if (items.login != ""){
                $('#student-id').val(items.login);
            }
            if (items.password != ""){
                $('#student-pswd').val(items.password);
            }

            $('#inline-radio' + items.frequency).prop('checked', true);

            $('#dskt-notify').prop('checked', items.notifications);
        });
}

fillUserInfo();

$('#save-btn').click(function () {
    event.preventDefault();
    saveOptions();
});

