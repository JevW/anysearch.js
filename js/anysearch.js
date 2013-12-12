/***********************************************************************
 The MIT License (MIT)
 
 Copyright (c) 2013 Eugen Wagner - Jev
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ***********************************************************************/

(function($) {
    $.fn.anysearch = function(options) {

        options = $.extend({
            reactOnKeycodes: 'string',                                      // Search only reacts on given ASCII Keycodes.
                                                                            // Options:
                                                                            // 'all'
                                                                            // 'string'
                                                                            // 'numeric'
                                                                            // '48,49,50,51,52,53,54,55,56,57'
                                                                            // -----------------------------------------------
            secondsBetweenKeypress: 2,                                      // After given time anysearch.js clears the search 
                                                                            // string. anysearch.js resets the timer on each 
                                                                            // keystroke.
                                                                            // Options:
                                                                            // 0.001 - 99
                                                                            // -----------------------------------------------
            searchPattern: {1: '[^~,]*'},                                   // Filters the input string, before it is sent to 
                                                                            // the search.
                                                                            // Options:
                                                                            // {1: '(\\d+)', 2: '((?:[a-z][0-9]+))'}
                                                                            // -----------------------------------------------
            minimumChars: 3,                                                // Necessary amount of charakters to start the 
                                                                            // search script.
                                                                            // Options: 
                                                                            // 1 - 99
                                                                            // -----------------------------------------------
            liveField: false,                                               // Given selector will be filled in realtime on 
                                                                            // writing.
                                                                            // Options:
                                                                            // false
                                                                            // {selector: '#example', value: true}
                                                                            // {selector: '#example', html: true}
                                                                            // {selector: '#example', attr: 'title'}
                                                                            // -----------------------------------------------
            excludeFocus: 'input,textarea,select',                          // While one of the given selectors focused, 
                                                                            // anysearch will be deactivated.
                                                                            // Options:
                                                                            // selector
                                                                            // -----------------------------------------------
            enterKey: 13,                                                   // ASCII Keycode for Enter.
                                                                            // Options:
                                                                            // ASCII charcode
                                                                            // -----------------------------------------------
            backspaceKey: 8,                                                // ASCII Keycode for Backspace.
                                                                            // Options:
                                                                            // ASCII charcode
                                                                            // -----------------------------------------------
            checkIsBarcodeMilliseconds: 250,                                // Time in milliseconds the barcode scanner is 
                                                                            // allowed to need for a scan.
                                                                            // Options:
                                                                            // 1 - 9999
                                                                            // -----------------------------------------------
            checkBarcodeMinLength: 4,                                       // Minimum amount of characters for a barcode.
                                                                            // Options:
                                                                            // 1 - 99
                                                                            // -----------------------------------------------
            searchSlider: true,                                             // Activates searchslider with inputfield.
                                                                            // Options:
                                                                            // true
                                                                            // false
                                                                            // -----------------------------------------------
            startAnysearch: function() {},                                  // Callback function will be triggered by first 
                                                                            // reaction of anysearch.js
                                                                            // Options:
                                                                            // function(){ // do something }
                                                                            // -----------------------------------------------
            stopAnysearch: function() {},                                   // Callback function will be triggered once 
                                                                            // anysearch.js ends.
                                                                            // Options:
                                                                            // function(){ // do something }
                                                                            // -----------------------------------------------
            minimumCharsNotReached: function(string, length, minLength) {}, // Callback function will be triggered if the 
                                                                            // length of the search string is lower then the 
                                                                            // value of "minimumChars".
                                                                            // Options:
                                                                            // function(string, length, minLength){ 
                                                                            //     do something with string, length, minLength 
                                                                            // }
                                                                            // -----------------------------------------------
            searchFunc: function(string) {},                                // Callback function for the search 
                                                                            // (e.g. serverside script).
                                                                            // Options:
                                                                            // function(string){ 
                                                                            //     do something with the string 
                                                                            // }
                                                                            // -----------------------------------------------             
            patternsNotMatched: function(string, patterns) {},              // Callback function will be triggered 
                                                                            // if "searchPattern" returns false.
                                                                            // Options:
                                                                            // function(string, patterns){ 
                                                                            //     do something with string or patterns 
                                                                            // }
                                                                            // ----------------------------------------------- 
            isBarcode: function(barcode) {}                                 // Callback function will be triggered if a barcode is detected.
                                                                            // Options:
                                                                            // function(barcode){ 
                                                                            //     do something with the barcode 
                                                                            // }
        }, options);

        return this.each(function() {

            var startTime = null;
            var keyTimestamp = null;
            var keypressArr = [];
            var timeout = setTimeout(function() {
            });
            var reactOnKeycodes = '';
            var inputKeypressStartTime = null;


            switch (options.reactOnKeycodes) {
                case "string":
                    reactOnKeycodes = '32,48,49,50,51,52,53,54,55,56,57,94,176,33,34,167,36,37,38,47,40,41,61,63,96,180,223,178,179,123,91,93,125,92,113,119,101,114,116,122,117,105,111,112,252,43,35,228,246,108,107,106,104,103,102,100,115,97,60,121,120,99,118,98,110,109,44,46,45,81,87,69,82,84,90,85,73,79,80,220,42,65,83,68,70,71,72,74,75,76,214,196,39,62,89,88,67,86,66,78,77,59,58,95,64,8364,126,35,124,181';
                    break;
                case "numeric":
                    reactOnKeycodes = '43,45,48,49,50,51,52,53,54,55,56,57';
                    break;
                case "all":
                    reactOnKeycodes = 'all';
                    break;
                default:
                    reactOnKeycodes = options.reactOnKeycodes;
                    break;
            }

            if (reactOnKeycodes !== 'all') {
                var reactOnKeycodesArr = reactOnKeycodes.replace(/\s/g, "").split(',').map(function(x) {
                    return parseInt(x);
                });
            }


            // is last keypress XXX seconds ago 
            var checkIsValidTime = function(keyTimestamp, seconds) {
                if (typeof seconds === 'undefined') {
                    seconds = options.secondsBetweenKeypress;
                }
                var now = new Date().getTime();
                if ((now - keyTimestamp) <= (seconds * 1000)) {
                    return true;
                }
                return false;
            };

            // delete the keypress array
            var deleteKeypressArr = function() {
                keypressArr = null;
                keypressArr = [];
                keyTimestamp = null;
                startTime = null;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                });
                inputKeypressStartTime = null;
            };

            // search function
            var doSearch = function(string) {
                options.searchFunc(string);
            };

            // is an element focused
            var isAnElementFocused = function() {

                var isBool = false;
                var excludeFocusArr = options.excludeFocus.split(',');
                $.each(excludeFocusArr, function(i, elem) {
                    if ($('' + $.trim(elem)).is(':focus')) {
                        return isBool = true;
                    }
                });
                return isBool;
            };

            // does a pattern match
            var doesAPatternMatch = function(string) {
                var isBool = false;
                $.each(options.searchPattern, function(i, regExp) {
                    var Regex = new RegExp(regExp);
                    if (Regex.test(string)) {
                        return isBool = true;
                    }
                });
                if (isBool === false) {
                    options.patternsNotMatched(string, options.searchPattern);
                }
                return isBool;
            };

            // backspace key action
            var backspaceKeyAction = function(e) {
                if (e && e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
                keypressArr.pop();
                return;
            };

            // function to execute after pressing enter
            var generateStringAfterPressEnter = function() {
                var string = String.fromCharCode.apply(String, keypressArr);
                // check is barcodescanner input
                if (checkIsBarcode(string, 4, startTime, keyTimestamp)) {
                    var splittedStringArr = string.split('');
                    var string = "";
                    for (var i = 0; i < splittedStringArr.length; i++) {
                        if (((i + 1) % 4) === 0) {
                            string = string + splittedStringArr[i];
                        }
                    }
                    options.isBarcode(string);
                }
                return string;
            };

            var checkIsBarcode = function(string, asciiPosition, startTime, keyTimestamp) {
                if (((keyTimestamp - startTime) < options.checkIsBarcodeMilliseconds) && (string.length >= (options.checkBarcodeMinLength * asciiPosition))) {
                    return true;
                }
                return false;
            };

            // function check length of a string
            var checkAmountKeypressedChars = function(string) {
                if (string.length >= options.minimumChars) {
                    return true;
                }
                options.minimumCharsNotReached(string, string.length, options.minimumChars);
                return false;
            };

            // function for filling the input
            var fillLiveField = function(keypressArr) {
                var string = String.fromCharCode.apply(String, keypressArr);
                if (options.searchSlider === true) {
                    $('#anysearch-input').val(string);
                }
                if (options.liveField !== false && options.liveField.selector !== null) {
                    if (options.liveField.html === true) {
                        $('' + options.liveField.selector).html(string);
                        return;
                    }
                    if (options.liveField.value === true) {
                        $('' + options.liveField.selector).val(string);
                        return;
                    }
                    if (options.liveField.attr !== null) {
                        $('' + options.liveField.selector).attr(options.liveField.attr, string);
                        return;
                    }
                }
            };

            // function if press enter
            var enterPressed = function() {
                // generate string from array
                var string = generateStringAfterPressEnter(startTime, keyTimestamp, keypressArr);
                if (string.length >= 1) {
                    if (doesAPatternMatch(string) === true && checkAmountKeypressedChars(string)) {
                        doSearch(string);
                    }
                    deleteKeypressArr();
                    fillLiveField(keypressArr);
                    options.stopAnysearch();
                    if (options.searchSlider === true) {
                        animateCloseSearchbox();
                    }
                }
            };

            // function if press backspace
            var backspacePressed = function(e) {
                backspaceKeyAction(e);
                fillLiveField(keypressArr);
            };

            var timeoutKeypress = function() {
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    animateCloseSearchbox();
                }, (options.secondsBetweenKeypress * 1000));
            };

            var checkReactOnKeycode = function(e) {
                if (reactOnKeycodes === 'all') {
                    return true;
                }
                if (jQuery.inArray(e.which, reactOnKeycodesArr) >= 0) {
                    return true;
                }
                return false;
            };

            // enter and backspace must be handled with keydown cause of some browsers keypress event 
            $(this).keydown(function(e) {
                if (isAnElementFocused() === false) {
                    if ((checkIsValidTime(keyTimestamp))
                            && (e.which === options.enterKey || e.which === options.backspaceKey)) {
                        keyTimestamp = new Date().getTime();
                        if (e.which === options.enterKey) {
                            clearTimeout(timeout);
                            enterPressed();
                        }
                        if (e.which === options.backspaceKey) {
                            if (options.searchSlider === true) {
                                timeoutKeypress();
                            }
                            backspacePressed(e);
                        }
                    }
                }
            });

            // handle keypress
            $(this).keypress(function(e) {
                // if input aso is not focues && check keydownevents for bacspace and enter key
                if (isAnElementFocused() === false && e.which !== options.backspaceKey && e.which !== options.enterKey && checkReactOnKeycode(e)) {
                    // completely new init or continuation
                    if ((checkIsValidTime(keyTimestamp) || keyTimestamp === null)) {
                        if (options.searchSlider === true) {
                            animateOpenSearchbox();
                        }
                        // init
                        if (keyTimestamp === null && e.which !== options.enterKey && e.which !== options.backspaceKey) {
                            startTime = new Date().getTime();
                            options.startAnysearch();
                        }
                        // time of keypress
                        keyTimestamp = new Date().getTime();
                        keypressArr.push(e.which);
                        fillLiveField(keypressArr);
                    } else {
                        deleteKeypressArr();
                        fillLiveField(keypressArr);
                        keypressArr.push(e.which);
                        fillLiveField(keypressArr);
                    }
                    if (options.searchSlider === true) {
                        timeoutKeypress();
                    }
                }
            });

            if (options.searchSlider === true) {

                $('<div id="anysearch-slidebox"><div id="anysearch-slidebox-button"><button id="anysearch-sidebutton"><i class="anysearch-icon"></i></button></div><div id="anysearch-slidebox-content"><input id="anysearch-input" type="text" placeholder="Suchen..."></div></div>').appendTo('body');

                $('#anysearch-slidebox').css('right', '-' + $('#anysearch-slidebox-content').outerWidth() + 'px');

                // function for opening the searchsidebar
                function animateOpenSearchbox() {
                    setTimeout(function() {
                        var button = $('#anysearch-slidebox').find('#anysearch-sidebutton');
                        if (!$(button).hasClass('anysearchIsOpen')) {
                            $('#anysearch-slidebox').animate({'right': '0px'}, 300);
                            $(button).addClass('anysearchIsOpen');
                        }
                    }, 25);
                }

                // function for closing the searchsidebar
                function animateCloseSearchbox() {
                    setTimeout(function() {
                        var button = $('#anysearch-slidebox').find('#anysearch-sidebutton');
                        if ($(button).hasClass('anysearchIsOpen')) {
                            $('#anysearch-slidebox').stop(true).animate({'right': '-' + $('#anysearch-slidebox-content').outerWidth()}, 100);
                            $(button).removeClass('anysearchIsOpen');
                            deleteKeypressArr();
                            $('#anysearch-input').val('').blur();
                        }
                    }, 25);
                }

                // close searchsidebar if click outside the area of the searchsidebar
                $(this).bind('click', function(e) {
                    if (!$(e.target).is('#anysearch-input')
                            && !$(e.target).is('#anysearch-sidebutton')
                            && !$(e.target).is('#anysearch-slidebox-button')
                            && !$(e.target).is('#anysearch-slidebox')
                            && !$(e.target).is('#anysearch-slidebox-content')) {
                        animateCloseSearchbox();
                    }
                });

                // open and close the searchsidebar
                $('#anysearch-sidebutton').click(function() {
                    if (!$(this).hasClass('anysearchIsOpen')) {
                        $('#anysearch-input').focus();
                        animateOpenSearchbox();
                    } else {
                        animateCloseSearchbox();
                    }
                });

                // if search-input is focused --> bind search if press enter
                $('#anysearch-input').keydown(function(e) {
                    if (inputKeypressStartTime === null && e.which !== 13) {
                        inputKeypressStartTime = new Date().getTime();
                        options.startAnysearch();
                    }
                    if (e.which === 13) {
                        var string = $(this).val();
                        var now = new Date().getTime();
                        if (checkIsBarcode(string, 1, inputKeypressStartTime, now)) {
                            options.isBarcode(string);
                        }
                        inputKeypressStartTime = null;
                        if (string.length >= 1) {
                            if (doesAPatternMatch(string) === true && checkAmountKeypressedChars(string)) {
                                doSearch(string);
                                animateCloseSearchbox();
                            }
                        }
                        options.stopAnysearch();
                    }
                });

                // if focus #anysearch-input -> clearTimeout for closing
                $('#anysearch-input').focus(function() {
                    clearTimeout(timeout);
                });
            }
        });
    };
})(jQuery);
