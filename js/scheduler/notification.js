/**
 * Created by kuoa on 1/12/17.
 */
chrome.notifications.onClicked.addListener(

    function(notificationId){

        /* display in new tab */
        //chrome.tabs.create({url : "popup.html"});
        popup.cancel();
    });


function createNotification(data){

    var options = {
        type: "list",
        title: "New grades available",
        message: "Here are your new grades",
        iconUrl: "images/icon.png",
        items: data
    };

    chrome.notifications.create("dbufr-new-grades", options,
        function(notificationId){
            setTimeout(function(){
                chrome.notifications.clear(notificationId, function(){});
            }, 4000);
    });

}