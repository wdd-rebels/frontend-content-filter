'use strict';

const tweets = document.getElementById('stream-items-id');
const config = { attributes: true, childList: true, subtree: true };
const observer = new WebKitMutationObserver((mutations) => {
    getTweetData();
});
observer.observe(tweets, config);

function getTweetData() {
    console.log('getting tweets');
    
    console.log('tweets: ', tweets);

    let allTweets = document.querySelectorAll('[data-item-type="tweet"]');
    console.log('length: ', Array.from(allTweets).length);
    let tweetsToSend = [];
    Array.from(allTweets).forEach((tweet) => {
        if (tweet) {
            const tweetDetails = {
                id: tweet.getAttribute('data-item-id'),
                text: tweet.querySelector('.tweet-text').innerText,
                sender_handle: tweet.querySelector('.username').innerText
            }
            tweetsToSend.push(tweetDetails);
        }
    });

    var tweetPostBody = {
        'tweets': tweetsToSend
    };
    classify(JSON.stringify(tweetPostBody));
}

// post request {'tweets': [{'id': 53536626, 'text': 'hello', 'sender_handle': 'Trump'}]}
function classify(postBody) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'https://polar-thicket-18683.herokuapp.com/classify', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            var responseJson = JSON.parse(xhr.responseText);
            console.log("response from /classify", responseJson);
        } else if (this.readyState === XMLHttpRequest.DONE && this.status !== 200) {
            var errorJson = JSON.parse(xhr.responseText);
            console.log("error response from /classify", errorJson);
        }
    }
    xhr.send(postBody);
}