'use strict';

const tweets = document.getElementById('stream-items-id');
const config = { attributes: true, childList: true, subtree: true };

function getTweetData() {
    console.log('getting tweets');
    
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
            console.log('tweetDetails: ', tweetDetails);
        }
    });
}

const insertedNodes = [];
const observer = new WebKitMutationObserver((mutations) => {
    // mutations.forEach(function (mutation) {
    //     for (var i = 0; i < mutation.addedNodes.length; i++)
    //         insertedNodes.push(mutation.addedNodes[i]);
    // })
    console.log('DOM changed');
    getTweetData();
});
observer.observe(tweets, config);
console.log(insertedNodes);