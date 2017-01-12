/**
 * Created by kuoa on 1/12/17.
 */

function createBadge(data){
    chrome.browserAction.setBadgeText({text : data});
}

function removeBadge(){
    chrome.browserAction.setBadgeText({text : ""});
}