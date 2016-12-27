/* global chrome */
(function (window) {

  'use strict';

  var self = {
    ONLINE_CHECK: 'onlineCheck',
    BATTERY_CHECK: 'batteryCheck',
    SUSPEND_TIME: 'timeToDiscard',
    IGNORE_PINNED: 'dontDiscardPinned',
    IGNORE_FORMS: 'dontDiscardForms',
    IGNORE_AUDIO: 'dontDiscardAudio',
    IGNORE_CACHE: 'ignoreCache',
    ADD_CONTEXT: 'addContextMenu',
    NO_NAG: 'noNag',
    WHITELIST: 'whitelist',

    getOption: getOption,
    getOptions: getOptions,
    setOption: setOption,
    setOptions: setOptions,
    saveToWhitelist: saveToWhitelist,
    removeFromWhitelist: removeFromWhitelist,
    cleanupWhitelist: cleanupWhitelist

  };
  window.storage = self;


  const noop = function() {};

  function getOption(prop, callback) {
    getOptions(function (settings) {
      callback(settings[prop]);
    });
  }

  function getOptions(callback) {
    chrome.storage.local.get(null, function (settings) {

      var defaults = getSettingsDefaults();
      for (var prop in defaults) {
        if (typeof(settings[prop]) !== 'undefined' && settings[prop] !== null) {
          defaults[prop] = settings[prop];
        }
      }
      callback(defaults);
    });
  }

  function setOption(prop, value, callback) {
    callback = callback || noop;
    var valueByProp = {};
    valueByProp[prop] = value;
    setOptions(valueByProp, callback);
  }

  function setOptions(valueByProp, callback) {
    callback = callback || noop;
    chrome.storage.local.get(null, function (settings) {

      for (var prop in valueByProp) {
        if (valueByProp.hasOwnProperty(prop)) {
          settings[prop] = valueByProp[prop];
        }
      }
      console.log('saving settings',settings);
      chrome.storage.local.set(settings, callback);
    });
  }


  // WHITELIST HELPERS

  function saveToWhitelist (newString, callback) {
    callback = callback || noop;
    self.getOption(self.WHITELIST, function (whitelist) {
      whitelist = whitelist ? whitelist + '\n' + newString : newString;
      whitelist = cleanupWhitelist(whitelist);
      self.setOption(self.WHITELIST, whitelist, callback);
    });
  }

  function removeFromWhitelist (url, callback) {
    callback = callback || noop;
    self.getOption(self.WHITELIST, function (whitelist) {

      var whitelistItems = whitelist ? whitelist.split(/[\s\n]+/).sort() : '',
        i;

      for (i = whitelistItems.length - 1; i >= 0; i--) {
        if (testForMatch(whitelistItems[i], url)) {
          whitelistItems.splice(i, 1);
        }
      }
      self.setOption(self.WHITELIST, whitelistItems.join('\n'), callback);
    });
  }

  function cleanupWhitelist (whitelist) {
    var whitelistItems = whitelist ? whitelist.split(/[\s\n]+/).sort() : '',
      i,
      j;

    for (i = whitelistItems.length - 1; i >= 0; i--) {
      j = whitelistItems.lastIndexOf(whitelistItems[i]);
      if (j !== i) {
        whitelistItems.splice(i + 1, j - i);
      }
    }
    if (whitelistItems.length) {
      return whitelistItems.join('\n');
    } else {
      return whitelistItems;
    }
  }

  // PRIVATE FUNCTIONS

  function getSettingsDefaults() {

    var defaults = {};
    defaults[self.ONLINE_CHECK] = false;
    defaults[self.BATTERY_CHECK] = false;
    defaults[self.IGNORE_PINNED] = true;
    defaults[self.IGNORE_FORMS] = true;
    defaults[self.IGNORE_AUDIO] = true;
    defaults[self.IGNORE_CACHE] = false;
    defaults[self.ADD_CONTEXT] = true;
    defaults[self.SUSPEND_TIME] = '60';
    defaults[self.NO_NAG] = false;
    defaults[self.WHITELIST] = '';

    return defaults;
  }




}(window));

