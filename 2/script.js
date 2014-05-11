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

var content0 = "## 1.3 Vector Addition\n\n> Excerpted from Daniel Shiffman [Nature of Code](http://natureofcode.com/book/chapter-1-vectors/)\n\nBefore we continue looking at the `PVector` class and its `add()` method (purely for the sake of learning since it’s already implemented for us in Processing itself), let’s examine vector addition using the notation found in math and physics textbooks.\n\nVectors are typically written either in boldface type or with an arrow on top. For the purposes of this book, to distinguish a ***vector*** from a ***scalar*** (*scalar* refers to a single value, such as an integer or a floating point number), we’ll use the arrow notation:\n\n- Vector: u⃗\n- Scalar: x\n\nLet’s say I have the following two vectors:\n";

var diagram = '<svg width="420" height="180" class="diagram"><line x1="30" y1="30" x2="180" y2="30" class="regular"></line><line x1="180" y1="30" x2="180" y2="90" class="regular"></line><line x1="180" y1="90" x2="30" y2="30" class="highlight line_arrow"></line><line x1="300" y1="30" x2="390" y2="30" class="regular"></line><line x1="390" y1="30" x2="390" y2="150" class="regular"></line><line x1="300" y1="30" x2="390" y2="150" class="highlight line_arrow"></line><text x="60" y="120">u⃗ = (5, 2)</text><text x="270" y="120">v⃗ = (3, 4)</text><text x="105" y="15">5</text><text x="195" y="60">2</text><text x="345" y="15">3</text><text x="405" y="90">4</text></svg>';

var content1 = "Each vector has two components, an `x` and a `y`. To add two vectors together, we simply add both `x`’s and both `y`’s. ...";

$(function () {
    
    $("body").append('<button id="copy-to-clipboard" title="Click to copy.">COPY TO CLIPBOARD</button>');
    defArrow();

    var client = new ZeroClipboard($("#copy-to-clipboard"));
    
    createEditor();
    cmList[0].setValue(content0);
    cmList[0].setOption("autofocus", false);
    
    $("body").append(diagram);
    svgContainer = d3.select(".diagram");
    $(".diagram").click(editSVG);
    
    createEditor();
    cmList[1].setValue(content1);
    cmList[1].setOption("autofocus", false);


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