/**
 * Created by kuoa on 1/5/17.
 */

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
                console.log('#inline-radio' + items.frequency);
                $('#inline-radio' + items.frequency).prop('checked', true);
            }
        });
}

fillUserInfo();

$('#save-btn').click(function () {
    event.preventDefault();
    saveOptions();
});

