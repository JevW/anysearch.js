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
    <h2>Options and configuration</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Option</th>
                            <th>Standard value</th>                            
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>reactOnKeycodes:</td><td>'string'</td><td>Search only reacts on given ASCII Keycodes.<br /><br />Options:<br /><pre>'all'
'string'
'numeric'
'48,49,50,51,52,53,54,55,56,57' // ASCII char codes</pre></td></tr>
                        <tr><td>secondsBetweenKeypress:</td><td>2</td><td>After given time anysearch.js clears the search string. anysearch.js resets the timer on each keystroke.<br /><br />Options:<br /><pre>0.001 - 99</pre></td></tr>
                        <tr><td>searchPattern:</td><td>{1: '[^~,]*'}</td><td>Filters the input string, before it is sent to the search.<br /><br />Options:<br /><pre>// JSON Object of regular expressions
{1: '(\\d+)', 2: '((?:[a-z][0-9]+))'}</pre></td></tr>
                        <tr><td>minimumChars:</td><td>3</td><td>Necessary amount of charakters to start the search script.<br /><br />Options:<br /><pre>1 - 99</pre></td></tr>
                        <tr><td>liveField:</td><td>false</td><td>Given selector will be filled in realtime on writing.<br /><br />Options:<br /><pre>false
{selector: '#example', value: true}
{selector: '#example', html: true}
{selector: '#example', attr: 'title'}</pre></td></tr>
                        <tr><td>excludeFocus:</td><td>'input,textarea,select'</td><td>While one of the given selectors focused, anysearch will be deactivated.<br /><br />Options:<br /><pre>selector</pre></td></tr>
                        <tr><td>enterKey:</td><td>13</td><td>ASCII Keycode for Enter.<br /><br />Options:<br /><pre>ASCII charcode</pre></td></tr>
                        <tr><td>backspaceKey:</td><td>8</td><td>ASCII Keycode for Backspace.<br /><br />Options:<br /><pre>ASCII charcode</pre></td></tr>
                        <tr><td>checkIsBarcodeMilliseconds:</td><td>250</td><td>Time in milliseconds the barcode scanner is allowed to need for a scan.<br /><br />Options:<br /><pre>1 - 9999</pre></td></tr>
                        <tr><td>checkBarcodeMinLength:</td><td>4</td><td>Minimum amount of characters for a barcode.<br /><br />Options:<br /><pre>1 - 99</pre>/td></tr>
                        <tr><td>searchSlider:</td><td>true</td><td>Activates searchslider with inputfield.<br /><br />Options:<br /><pre>true
false</pre></td></tr>
                        <tr><td>startAnysearch:</td><td>function(){}</td><td>Callback function will be triggered by first reaction of anysearch.js<br /><br />Options:<br /><pre>function(){ 
    // do something 
}</pre></td></tr>
                        <tr><td>stopAnysearch:</td><td>function(){}</td><td>Callback function will be triggered once anysearch.js ends.<br /><br />Options:<br /><pre>function(){ 
    // do something 
}</pre></td></tr>
                        <tr><td>minimumCharsNotReached:</td><td>function(string, stringLength, minLength){}</td><td>Callback function will be triggered if the length of the search string is lower then the value of "minimumChars". <br /><br />Options:<br /><pre>function(string, stringLength, minLength){ 
    // do something with string, stringLength, minLength 
}</pre></td></tr>
                        <tr><td>searchFunc:</td><td>function(string){}</td><td>Callback function for the search (e.g. serverside script).<br /><br />Options:<br /><pre>function(string){ 
    // do something with the string 
}</pre></td></tr>
                        <tr><td>patternsNotMatched:</td><td>function(string, patterns){}</td><td>Callback function will be triggered if "searchPattern" returns false.<br /><br />Options:<br /><pre>function(string, patterns){ 
    // do something with string or patterns 
}</pre></td></tr>
                        <tr><td>isBarcode:</td><td>function(barcode){}</td><td>Callback function will be triggered if a barcode is detected.<br /><br />Options:<br /><pre>function(barcode){ 
    // do something with the barcode 
}</pre></td></tr>
                    </tbody>
                </table>
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
 
