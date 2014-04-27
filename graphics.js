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

$(function () {
    
    $("body").append('<button id="copy-to-clipboard" title="Click to copy.">COPY TO CLIPBOARD</button>');
    //    $("#copy-to-clipboard").click(function() {
    //        alert(getContent());
    //    });

    var client = new ZeroClipboard($("#copy-to-clipboard"));
    
    myCodeMirror = createEditor();


    client.on("copy", function (event) {
        var content = getContent();
        var clipboard = event.clipboardData;
        clipboard.setData("text/plain", content);
        //        clipboard.setData("text/html", "<b>Copy me!</b>");
        //        clipboard.setData("application/rtf", "{\\rtf1\\ansi\n{\\b Copy me!}}");
        //#hclipboard.setData("text/x-markdown", content);
    });

    client.on("aftercopy", function (event) {
        // `this` === `client`
        // `event.target` === the element that was clicked
        //event.target.style.display = "none";
        alert("Copied text to clipboard: " + event.data["text/plain"]);
    });
});



function createEditor() {
    var cm = CodeMirror(document.body, {

        mode: "markdown",
        autoCloseTags: true,
        autofocus: true,
        lineWrapping: true
    });

    cmList.push(cm);
    cmIndex = cmList.length - 1;
    return cmList[cmIndex];
}

function setupControls() {
    var canvasContainer = d3.select("#canvasContainer"); 
    canvasContainer.append("div")
        .attr("id", "control-panel");
    d3.select("#control-panel").append("form")
        .attr("id", "select-class");
    d3.select("#control-panel").append("form")
        .attr("id", "select-shape");

    $("#select-class").append('<input type="radio" id="regular-gclass" name="gclass" value="regular" checked><label for="regular-gclass"></label><input type="radio" id="emphasis-gclass" name="gclass" value="emphasis"><label for="emphasis-gclass"></label>')
        .change(setClass);

    $("#select-shape").append('<input type="radio" name="shape" value="select" id="select-toggle"><label for="select-toggle"></label><input type="radio" id="draw-rect" name="shape" value="rect" checked><label for="draw-rect"></label><input type="radio" id="draw-circle" name="shape" value="circle"><label for="draw-circle"></label><input type="radio" id="draw-line" name="shape" value="line"><label for="draw-line"></label>')
        .change(setShape);

    $("#control-panel").append('<button id="finish-drawing">DONE</button>');

    var canvas = canvasContainer.append("div").attr("id", "canvas");

    $("#canvas").append('<button id="view-code">CODE</button>');
    var grid = canvas.append("div")
        .attr("id", "grid");

    $("#grid").width(CANVASWIDTH).height(CANVASHEIGHT);
    $("#view-code").click(function () {
        var svgDom = $("svg")[0].outerHTML;
        //var svgDom = $('svg').clone().wrap('<svg>').parent().html();
        alert(svgDom);
    });
    
    d3.select("body").on("keydown", key);
}


function setupCanvas() {

    var canvasContainer = d3.select("body").append("div")
        .attr("id", "canvasContainer");

    setupControls();
    $("#finish-drawing").click(finishCanvas);

    svgContainer = d3.select("#canvas").append("svg")
        .attr("width", CANVASWIDTH)
        .attr("height", CANVASHEIGHT)
        .attr("id", "active-svg");

    setClass();
    setShape();
    setupDrags();
    myCodeMirror.setOption("readOnly", "nocursor");
}

function editSVG() {
    //get previous dom
    var pDom = $(this).prev(".CodeMirror");//All('.CodeMirror').first();
    $(this).attr("id", "active-svg")
        .off('click');
    //console.log(d.prop("class"));
    pDom.after("<div id='canvasContainer'></div>");
    canvasContainer = d3.select("#canvasContainer");
    setupControls();
    $("#finish-drawing").click(finishEditingSVG);
    centerGraph();
    
    $("#active-svg").appendTo($("#canvas"));
    
    setClass();
    setShape();
    setupDrags();
    
    // select mode
    $("#select-toggle").prop("checked", true);
    select();
    
    myCodeMirror.setOption("readOnly", "nocursor");
}

function finishCanvas() {
    cursorPos = myCodeMirror.getCursor();

    var svgDom = $("#active-svg")[0].innerHTML;
    //myCodeMirror.replaceRange(svgDom, cursorPos);

    // delete svg text
    var tagStartPos = {
        line: cursorPos.line,
        ch: cursorPos.ch - 5
    };
    var tagEndPos = {
        line: cursorPos.line,
        ch: cursorPos.ch + 6
    };

    myCodeMirror.replaceRange("", tagStartPos, tagEndPos);
    cursorPos = null;

    finishEditingSVG();
    
    if (svgDom != "") myCodeMirror = createEditor();
}

function finishEditingSVG() {
    trimCanvas();
    if ($("#active-svg")[0].innerHTML != "") {
        //$("#active-svg").clone().appendTo("body").removeAttr("id");
        $("#canvasContainer").after($("#active-svg"));
        $("#active-svg").removeAttr("id")
            .click(editSVG);
    }
    $("#canvasContainer").remove();
    myCodeMirror.setOption("readOnly", false);
    disableAllEvent(svgContainer);
    disableSelection();
}

// Prevent the backspace key from navigating back.
$(document).unbind('keydown').bind('keydown', function (event) {
    var doPrevent = false;
    if (event.keyCode === 8) {
        var d = event.srcElement || event.target;
        if ((d.tagName.toUpperCase() === 'INPUT' && (d.type.toUpperCase() === 'TEXT' || d.type.toUpperCase() === 'PASSWORD' || d.type.toUpperCase() === 'FILE' || d.type.toUpperCase() === 'EMAIL')) || d.tagName.toUpperCase() === 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
        } else {
            doPrevent = true;
        }
    }

    if (doPrevent) {
        event.preventDefault();
    }
});

function key() {
    // remove selected element
    if (d3.event.keyCode == 8) {
        d3.event.preventDefault();
        $("#selected").remove();
    }
}

function setClass() {
    gclass = $('input:radio[name=gclass]:checked').val();

    //return gclass;
}

function setShape() {
    shape = $('input:radio[name=shape]:checked').val();
    svgContainer.on("mouseup", drawEnded);
    switch (shape) {
    case "select":
        select();
        break;
    case "rect":
        svgContainer.on("mousedown", rectSetup);
        disableSelection();
        break;
    case "circle":
        svgContainer.on("mousedown", circleSetup);
        disableSelection();
        break;
    case "line":
        svgContainer.on("mousedown", lineSetup);
        disableSelection();
        break;
    }
    //return shape;
}

function selectElement() {
    unselectElement();
    d3.event.stopPropagation();
    var selection = d3.select(this).attr("id", "selected");
    //        .on("keydown", function(){
    //            if(d3.event.keyCode === 8) {
    //                d3.event.preventDefault();
    //                d3.select(this).remove();
    //            }
    //        });

    var selectionType = $("#selected").prop("tagName");

    switch (selectionType) {
    case "rect":
        selection.call(dragRect);
        break;
    case "circle":
        selection.call(dragCircle);
        break;
    case "line":
        selection.call(dragLine);
        break;
    }
}

function unselectElement() {
    d3.select("#selected").attr("id", null)
        .on("mousedown.drag", null);
    //.call(null);
}

function disableAllEvent(selection) {
    selection.on("mousemove", null)
        .on("mouseup", null)
        .on("mousedown", null);
}

function disableSelection() {
    unselectElement();
    d3.selectAll(".regular").on("click", null);
    d3.selectAll(".emphasis").on("click", null);
}

function enableSelection() {
    d3.selectAll(".regular").on("click", selectElement);
    d3.selectAll(".emphasis").on("click", selectElement);
    d3.selectAll(".emphasis").on("click", selectElement);
}

function select() {
    disableAllEvent(svgContainer);
    svgContainer.on("mousedown", unselectElement);
    enableSelection();
}

function snapMouse(mouse) {
    var snap = mouse;

    for (var i = 0; i < window.innerWidth; i += GRIDSIZE) {
        if (mouse[0] > i - SNAPTHRESHOLD && mouse[0] < i + SNAPTHRESHOLD) {
            snap[0] = i;
            break;
        }
    }

    for (var j = 0; j < window.innerHeight; j += GRIDSIZE) {
        if (mouse[1] > j - SNAPTHRESHOLD && mouse[1] < j + SNAPTHRESHOLD) {
            snap[1] = j;
            break;
        }
    }
    //console.log(snap);
    return snap;
}

function getContent() {
    var contentStr = "";
    var svgCopied = false;
    for (var i = 0; i < cmList.length; i++) {
        contentStr += cmList[i].getValue();
        if (!svgCopied && $("svg").length == 1) {
            contentStr += "\n" + $("svg")[0].outerHTML + "\n\n";
            svgCopied = true;
        }
    }
    return contentStr;
}

function trimCanvas() {
    var b = new getSVGBoundingBox();
    var elements = d3.selectAll("#active-svg > *")[0];

    for (var i = 0; i < elements.length; i++) {
        var s = d3.select(elements[i]);

        var d;

        switch (elements[i].tagName) {
        case "rect":
            d = new getRectData(s);
            s.attr("x", d.x - b.startX + CANVASMARGIN)
                .attr("y", d.y - b.startY + CANVASMARGIN);

            break;
        case "circle":
            d = new getCircleData(s);
            s.attr("cx", d.cx - b.startX + CANVASMARGIN)
                .attr("cy", d.cy - b.startY + CANVASMARGIN);
            break;
        case "line":
            d = new getLineData(s);
            s.attr("x1", d.x1 - b.startX + CANVASMARGIN)
                .attr("y1", d.y1 - b.startY + CANVASMARGIN)
                .attr("x2", d.x2 - b.startX + CANVASMARGIN)
                .attr("y2", d.y2 - b.startY + CANVASMARGIN);
            break;
        }
    }
    
    svgContainer.attr("width", b.endX - b.startX + CANVASMARGIN * 2)
            .attr("height", b.endY - b.startY + CANVASMARGIN * 2);
}

function centerGraph() {
    var svgContainer = d3.select("#active-svg");
    var w = parseInt(svgContainer.attr("width"));
    var h = parseInt(svgContainer.attr("height"));
    var elements = d3.selectAll("#active-svg > *")[0];
    
    var moveX = (CANVASWIDTH - w)/2;
    var moveY = (CANVASHEIGHT - h)/2;
    
    for (var i = 0; i < elements.length; i++) {
        var s = d3.select(elements[i]);

        var d;

        switch (elements[i].tagName) {
        case "rect":
            d = new getRectData(s);
            s.attr("x", d.x + moveX)
                .attr("y", d.y + moveY);

            break;
        case "circle":
            d = new getCircleData(s);
            s.attr("cx", d.cx + moveX)
                .attr("cy", d.cy + moveY);
            break;
        case "line":
            d = new getLineData(s);
            s.attr("x1", d.x1 + moveX)
                .attr("y1", d.y1 + moveY)
                .attr("x2", d.x2 + moveX)
                .attr("y2", d.y2 + moveY);
            break;
        }
    }
    
    svgContainer.attr("width", CANVASWIDTH)
        .attr("height", CANVASHEIGHT);
}

