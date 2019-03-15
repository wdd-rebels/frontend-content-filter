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
            text: tweet.querySelector('.tweet-text').innerText
        }
        console.log('tweetDetails: ', tweetDetails);
    }
});
