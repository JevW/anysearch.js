/***********************************************************************
************************************************************************
************************************************************************

Copyright [2013] [Eugen Wagner - Jev]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

***********************************************************************
***********************************************************************
***********************************************************************/

(function($) {
    $.fn.anysearch = function(options) {
        options = $.extend({
            secondsBetweenKeypress: 2, // puffer between keypress
            searchPattern: {1: '[^~,][^~,]*'}, // use http://txt2re.com/ 
            searchFunc: function(string) {
                console.log('search now.... ' + string + ' ....')
            }, // executes function if press the enterKey
            patternsNotMatchedAction: function() {
            }, // action if all pattern not matched
            minimumChars: 3, // minimum amout of keypressed chars before its possible to search,
            minimumCharsNotReachedAction: function() {
            },
            liveField: false, // if one of this elements is focused -> do not check keypress
            // {selector: '#example', value: true} or 
            // {selector: '#example', html: true} or
            // {selector: '#example', attr: the attribute}
            excludeFocus: 'input,textarea,select',
            enterKey: 13, // 13 == Enter
            backspaceKey: 8, // 8 == Backspace
            checkIsBarcodeMilliseconds: 200, // milliseconds between keypressed string to check if is barcodescanner
            checkBarcodeMinLength: 4, // minimum length of the barcode
            startAnysearchAction: function() {
            }, // Action if start keypress
            stopAnysearchAction: function() {
            }, // Action if keypress processed
            searchSlider: true
        }, options);

        return this.each(function() {

            var startTime = null;
            var keyTimestamp = null;
            var keypressArr = [];

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
                options.patternsNotMatchedAction();
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
                if (((keyTimestamp - startTime) < options.checkIsBarcodeMilliseconds) && (string.length >= (options.checkBarcodeMinLength * 4))) {
                    var splittedStringArr = string.split('');
                    var string = "";
                    for (var i = 0; i < splittedStringArr.length; i++) {
                        if (((i + 1) % 4) === 0) {
                            string = string + splittedStringArr[i];
                        }
                    }
                }
                return string;
            };

            // function check length of a string
            var checkAmountKeypressedChars = function(string) {
                if (string.length >= options.minimumChars) {
                    return true;
                }
                options.minimumCharsNotReachedAction();
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
                }
                deleteKeypressArr();
                fillLiveField(keypressArr);
                options.stopAnysearchAction();
                if (options.searchSlider === true) {
                    animateCloseSearchbox();
                }
            };

            // function if press backspace
            var backspacePressed = function(e) {
                backspaceKeyAction(e);
                fillLiveField(keypressArr);
            };

            // enter and backspace must be handled with keydown cause of some browsers keypress event 
            $(this).keydown(function(e) {
                if (isAnElementFocused() === false) {
                    if ((checkIsValidTime(keyTimestamp))
                            && (e.which === options.enterKey || e.which === options.backspaceKey)) {
                        keyTimestamp = new Date().getTime();
                        if (e.which === options.enterKey) {
                            enterPressed();
                        }
                        if (e.which === options.backspaceKey) {
                            backspacePressed(e);
                        }
                    }
                }
            });

            // handle keypress
            $(this).keypress(function(e) {
                // if input aso is not focues && check keydownevents for bacspace and enter key
                if (isAnElementFocused() === false && e.which !== options.backspaceKey && e.which !== options.enterKey) {
                    // completely new init or continuation
                    if ((checkIsValidTime(keyTimestamp) || keyTimestamp === null)) {
                        if (options.searchSlider === true) {
                            animateOpenSearchbox();
                        }
                        // init
                        if (keyTimestamp === null && e.which !== options.enterKey && e.which !== options.backspaceKey) {
                            startTime = new Date().getTime();
                            options.startAnysearchAction();

                        }
                        // time of keypress
                        keyTimestamp = new Date().getTime();
                        keypressArr.push(e.which);
                        fillLiveField(keypressArr);
                    } else {
                        // new init if time over
                        deleteKeypressArr();
                        fillLiveField(keypressArr);
                        if (e.which !== options.enterKey) {
                            keypressArr.push(e.which);
                            fillLiveField(keypressArr);
                        }
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
                $('#anysearch-input').keypress(function(e) {
                    if (e.which === 13) {
                        var string = $(this).val();
                        if (string.length >= 1) {
                            if (doesAPatternMatch(string) === true && checkAmountKeypressedChars(string)) {
                                doSearch(string);
                                animateCloseSearchbox();
                                $(this).val('');
                            }
                        }
                    }
                });
            }
        });
    };
})(jQuery);