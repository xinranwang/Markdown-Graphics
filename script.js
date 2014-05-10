var GRIDSIZE = 30;
var SNAPTHRESHOLD = 10;

var CANVASWIDTH = 600;
var CANVASHEIGHT = 600;

var CANVASMARGIN = 30;

var startPos = [0, 0];
var endPos = [0, 0];
var pmousePos = [0, 0];

var svgContainer;
var gclass;
var shape;

var dragRect;
var dragCircle;
var dragLine;

var myCodeMirror;
var cursorPos;

var cmList = [];
var svgList = [];
var cmIndex = 0;

var placeholder = "Start typing here. Type '<svg>' to start drawing.";

$(function () {
    
    $("body").append('<button id="copy-to-clipboard" title="Click to copy.">COPY TO CLIPBOARD</button>');
    defArrow();

    var client = new ZeroClipboard($("#copy-to-clipboard"));
    
    myCodeMirror = createEditor();
    cmList[0].setOption("placeholder", placeholder);


    client.on("copy", function (event) {
        var content = getContent();
        var clipboard = event.clipboardData;
        clipboard.setData("text/plain", content);
    });

    client.on("aftercopy", function (event) {
        // `this` === `client`
        // `event.target` === the element that was clicked
        //event.target.style.display = "none";
        alert("Copied text to clipboard: " + event.data["text/plain"]);
    });
});