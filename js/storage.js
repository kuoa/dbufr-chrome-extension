/**
 * Created by kuoa on 1/5/17.
 */

function saveOptions(){
    var userId = $('#student-id').val();
    var userPass = $('#student-pswd').val();
    var updateFreq = $('input[name=radio-frequency]:checked', '#options-form').val();

    chrome.storage.sync.set({
        login : userId,
        password : userPass,
        frequency : updateFreq
    },
        /* save complete */
        function () {

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