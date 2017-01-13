/**
 * Created by kuoa on 1/12/17.
 */

/**
 * Listener : close notification on user click
 */
chrome.notifications.onClicked.addListener(

    function(notificationId){

        /* display in new tab */
        //chrome.tabs.create({url : "popup.html"});
        popup.cancel();
    });

/**
 * [Function called by the scheduler]
 * Create a new desktop notification
 * @param data
 */
function createNotification(data){

    var options = {
        type: "list",
        title: "Nouvelles notes disponibles",
        message: "Vos notes sont ici : ",
        iconUrl: "images/icon128.png",
        items: data
    };

    chrome.notifications.create("dbufr-new-grades", options,
        function(notificationId){
            setTimeout(function(){
                chrome.notifications.clear(notificationId, function(){});
            }, 5000);
    });

}