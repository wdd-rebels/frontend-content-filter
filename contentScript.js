'use strict';

const config = { attributes: true, childList: true, subtree: true };
const classifiedDataItemIds = [];
const observer = new WebKitMutationObserver((mutations) => {
    getTweetData();
});
observer.observe(document.getElementById('timeline'), config);

var selectedCategories = ['dogs', 'brexit', 'millenials'];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.type === 'saveConfig') {
      selectedCategories = request.categories;
      console.log(selectedCategories);
    }
  });

function getTweetData() {
    console.log('getting tweets');
    let allTweets = document.querySelectorAll('[data-item-type="tweet"]');
    let tweetsToSend = [];
    Array.from(allTweets).forEach((tweet) => {
        let dataItemId = tweet.getAttribute('data-item-id');
        let tweetText = tweet.querySelector('.tweet-text');
        let senderHandle = tweet.querySelector('.username');

        if (tweet && tweetText && senderHandle && !classifiedDataItemIds.includes(dataItemId)) {
            const tweetDetails = {
                id: dataItemId,
                text: tweetText.innerText,
                sender_handle: senderHandle.innerText
            };
            tweetsToSend.push(tweetDetails);
        }
    });

    if (tweetsToSend.length > 0) {
        var tweetPostBody = {
            'tweets': tweetsToSend,
            'categories': selectedCategories
        };
        classify(JSON.stringify(tweetPostBody));
    }
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
            handleResponse(responseJson);
            console.log("response from /classify", responseJson);
        } else if (this.readyState === XMLHttpRequest.DONE && this.status !== 200) {
            var errorJson = JSON.parse(xhr.responseText);
            console.log("error response from /classify", errorJson);
        }
    }
    xhr.send(postBody);
}

function handleResponse(responseJson) {
    if (responseJson !== null) {
        const responseTweets = responseJson.tweets;
        responseTweets.forEach((tweet) => {
            if (tweet.filter) {
                console.log('tweet', tweet);
                console.log('tweet to censor!', tweet.id);
                censorContent(tweet.id, tweet.categories);
            }
            classifiedDataItemIds.push(tweet.id);
        });
    }
}

function censorContent(tweetID, categories) {
    const tweetToCensor = document.querySelector(`[data-tweet-id="${tweetID}"]`) || document.querySelector(`[data-conversation-id="${tweetID}"]`);
    tweetToCensor.classList.add('censoredTweet');
    
    if (categories.length > 0) {
        const category = categories[0];
        switch (category) {
            case 'brexit':
                tweetToCensor.classList.add('censoredTweet--brexit');
                break;
            case 'dog':
                tweetToCensor.classList.add('censoredTweet--dog');
                break;
            case 'millenni':
                tweetToCensor.classList.add('censoredTweet--millennials');
                break;
            default:
                break;
        }
    }
}
