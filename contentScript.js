'use strict';

let tweets = document.getElementById('stream-items-id');
console.log('tweets: ', tweets);

let allTweets = document.querySelectorAll('[data-item-type="tweet"]');
console.log('length: ', Array.from(allTweets).length);
let tweetsToSend = {};
Array.from(allTweets).forEach((tweet) => {
    if (tweet) {
        const tweetDetails = {
            id: tweet.getAttribute('data-item-id'),
            text: tweet.querySelector('.tweet-text').innerText,
            sender_handle: tweet.querySelector('.username').innerText
        }
        classify(tweetDetails);
    }
});

function classify(postBody) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/classify', true);
    
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            var responseJson = JSON.parse(xhr.responseText);
            console.log("response from /classify", responseJson);
        }
    }
    xhr.send(postBody);
}
