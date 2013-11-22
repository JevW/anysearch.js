<h2>jQuery Plugin - anysearch.js</h2>
<ul>
    <li>Direct search in browser</li>
    <li>Search without inputfield</li>
    <li>Activate searchfield optional</li>
    <li>Activate searchslider optional</li>
    <li>Supports barcode scanner</li>
    <li>Searchfilter</li>
</ul>
<h2>Demo and project site</h2>
http://www.jevnet.de/anysearch-js-demo.html<br>
http://www.jevnet.de/anysearch-js.html

<div class="bs-example">
    <h2>Usage</h2>
    <pre>$(document).ready(function() { 
    $(document).anysearch({
        searchFunc: function(search) {
            alert(search);
        }
    });
});</pre>
</div>

<div class="bs-example">
    <h2>Options & configuration</h2>
    You can find on the project site:
    <br>http://www.jevnet.de/anysearch-js.html
</div>

<div class="bs-example">
    <h2>Example</h2>
    <pre>$(document).ready(function() {
    $(document).anysearch({
        reactOnKeycodes: 'all',
        secondsBetweenKeypress: 1,
        searchPattern: {1: '[^~,]*'},
        minimumChars: 3,
        liveField: {selector: '#liveField', value: true},
        excludeFocus: 'input,textarea,select,#tfield',
        enterKey: 13,
        backspaceKey: 8,
        checkIsBarcodeMilliseconds: 250,
        checkBarcodeMinLength: 6,
        searchSlider: true,
        startAnysearch: function() {
            openHelp();
        },
        stopAnysearch: function() {
            closeHelp();
        },
        minimumCharsNotReached: function(string, stringLength, minLength) {
            alert(string + ' has ' + stringLength + ' chars! Minlength: ' + minLength);
        },
        searchFunc: function(string) {
            doAjaxSearch(string);
        },
        patternsNotMatched: function(string, patterns) {
            alert(string + ' must be in this form: ' + patterns);
        }, 
        isBarcode: function(barcode){
            ajaxCheckBarcode(barcode);
        }
    });
});</pre>
</div>


