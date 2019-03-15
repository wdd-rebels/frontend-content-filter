// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let categoryConfig = document.getElementById('category-config');
let saveConfig = document.getElementById('save-config');

saveConfig.addEventListener('click', function() {
  let selectedCategories = [];
  let categories = document.getElementsByName('category');
  for (let category of categories) {
    if (category.checked) {
      selectedCategories.push(category.value);
    }
  }
  chrome.tabs.query({url: 'https://twitter.com/*'}, function (tabs){
    chrome.tabs.sendMessage(tabs[0].id, {categories: selectedCategories}, function(response) {

    });
  })
})
