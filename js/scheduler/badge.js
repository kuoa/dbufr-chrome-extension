/**
 * Created by kuoa on 1/12/17.
 */
/**
 * [Function called by the scheduler]
 * Create a new extension badge displaying
 * the current number of new grades
 * @param data
 */
function createBadge(data){
    chrome.browserAction.setBadgeText({text : data});
}

/**
 * Clear badge on user click
 */
function removeBadge(){
    chrome.browserAction.setBadgeText({text : ""});
}