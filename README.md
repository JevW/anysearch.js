<div class="jumbotron hero-spacer">
    <h1>jQuery Plugin - anysearch.js</h1>
    <ul>
        <li>Direct search in browser</li>
        <li>Search without inputfield</li>
        <li>Activate searchfield optional</li>
        <li>Activate searchslider optional</li>
        <li>Supports barcode scanner</li>
        <li>Searchfilter</li>
    </ul>
</div>

<div class="bs-example">
    <h3>Usage</h3>
<pre>$(document).ready(function() { 
    $(document).anysearch({
        searchFunc: function(search) {
            alert(search);
        }
    });
});</pre>
</div>
<hr>
<div class="bs-example">
    <h3>Options and configuration</h3>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Option</th>
                <th>Standar dvalue</th>                            
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>reactOnKeycodes:</td><td>'string'</td><td>Search only reacts on given ASCII Keycodes.<br><br>Options:'all', 'string', 'numeric', ASCII charcodes z. B.: '48,49,50,51,52,53,54,55,56,57'</td></tr>
            <tr><td>secondsBetweenKeypress:</td><td>2</td><td>After given time anysearch.js clears the search string. anysearch.js resets the timer on each keystroke.<br><br>Options: 0.001 - 99</td></tr>
            <tr><td>searchPattern:</td><td>{1: '[^~,]*'}</td><td>Filters the input string, before it is sent to the search.<br><br>Options: regular expressions e.g.: {1: '(\\d+)', 2: '((?:[a-z][0-9]+))'} </td></tr>
            <tr><td>minimumChars:</td><td>3</td><td>Necessary amount of charakters to start the search script.<br><br>Options: 1 - 99 </td></tr>
            <tr><td>liveField:</td><td>false</td><td>Given selector will be filled in realtime on writing.<br><br>Options: false,<br>{selector: '#example', value: true}<br>{selector: '#example', html: true}<br>{selector: '#example', attr: 'title'}</td></tr>
            <tr><td>excludeFocus:</td><td>'input,textarea,select'</td><td>While one of the given selectors focused, anysearch will be deactivated.<br><br>Options: Selector</td></tr>
            <tr><td>enterKey:</td><td>13</td><td>ASCII Keycode for Enter.<br><br>Options: ASCII charcode</td></tr>
            <tr><td>backspaceKey:</td><td>8</td><td>ASCII Keycode for Backspace.<br><br>Options: ASCII charcode</td></tr>
            <tr><td>checkIsBarcodeMilliseconds:</td><td>250</td><td>Time in milliseconds the barcode scanner is allowed to need for a scan.<br><br>Options: 1 - 9999</td></tr>
            <tr><td>checkBarcodeMinLength:</td><td>4</td><td>Minimum amount of characters for a barcode.<br><br>Options: 1 - 99</td></tr>
            <tr><td>searchSlider:</td><td>true</td><td>Activates searchslider with inputfield.<br><br>Options: true oder false</td></tr>
            <tr><td>startAnysearch:</td><td>function(){}</td><td>Callback function will be triggered by first reaction of anysearch.js<br><br>Options: function(){ // do something }</td></tr>
            <tr><td>stopAnysearch:</td><td>function(){}</td><td>Callback function will be triggered once anysearch.js ends.<br><br>Options: function(){ // do something }</td></tr>
            <tr><td>minimumCharsNotReached:</td><td>function(string, stringLength, minLength){}</td><td>Callback function will be triggered if the length of the search string is lower then the value of "minimumChars". <br><br>Options: function(string, stringLength, minLength){ // do something with string, stringLength, minLength }</td></tr>
            <tr><td>searchFunc:</td><td>function(string){}</td><td>Callback function for the search (e.g. serverside script).<br><br>Options: function(string){ // do something with the string }</td></tr>
            <tr><td>patternsNotMatched:</td><td>function(string, patterns){}</td><td>Callback function will be triggered if "searchPattern" returns false.<br><br>Options: function(string, patterns){ // do something with string or patterns }</td></tr>
            <tr><td>isBarcode:</td><td>function(barcode){}</td><td>Callback function will be triggered if a barcode is detected.<br><br>Options: function(barcode){ // do something with the barcode }</td></tr>
        </tbody>
    </table>
</div>

<hr>
<div class="bs-example">
    <h3>Example</h3>
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
