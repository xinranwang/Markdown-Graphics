var GRIDSIZE = 30;
var SNAPTHRESHOLD = 10;

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

$(function () {
    myCodeMirror = CodeMirror(document.body, {
        mode: "markdown",
        autoCloseTags: true,
        autofocus: true
    });

//    // insert button
//    $("body").append('<button id="insert-btn">insert svg</button>');
//
//    // add options
//    d3.select("#insert-btn").on("click", setupCanvas);

});

function setupCanvas() {
    
    $("body").append('<button id="view-code">CODE</button>');
    $("body").append('<button id="finish-drawing">DONE</button>');

    d3.select("body").append("div")
        .attr("id", "control-panel");
    d3.select("#control-panel").append("form")
        .attr("id", "select-class");
    d3.select("#control-panel").append("form")
        .attr("id", "select-shape");

//    $("#select-class").append('<input type="radio" id="regular-gclass" name="gclass" value="regular" checked><label for="regular-gclass">regular</label><input type="radio" id="emphasis-gclass" name="gclass" value="emphasis"><label for="emphasis-gclass">emphasis</label>')
//        .change(setClass);
    
    $("#select-class").append('<input type="radio" id="regular-gclass" name="gclass" value="regular" checked><label for="regular-gclass"></label><input type="radio" id="emphasis-gclass" name="gclass" value="emphasis"><label for="emphasis-gclass"></label>')
        .change(setClass);

//    $("#select-shape").append('<input type="radio" name="shape" value="select" id="select-toggle"><label for="select-toggle">select</label><input type="radio" id="draw-rect" name="shape" value="rect" checked><label for="draw-rect">rect</label><input type="radio" id="draw-circle" name="shape" value="circle"><label for="draw-circle">circle</label><input type="radio" id="draw-line" name="shape" value="line"><label for="draw-line">line</label>')
//        .change(setShape);
    $("#select-shape").append('<input type="radio" name="shape" value="select" id="select-toggle"><label for="select-toggle"></label><input type="radio" id="draw-rect" name="shape" value="rect" checked><label for="draw-rect"></label><input type="radio" id="draw-circle" name="shape" value="circle"><label for="draw-circle"></label><input type="radio" id="draw-line" name="shape" value="line"><label for="draw-line"></label>')
        .change(setShape);



    svgContainer = d3.select("body").append("svg");

    var grid = d3.select("body").append("div")
        .attr("id", "grid");

    $("#insert-btn").remove();



    $("#view-code").click(function () {
        var svgDom = $("svg")[0].outerHTML;
        //var svgDom = $('svg').clone().wrap('<svg>').parent().html();
        alert(svgDom);
    });
    
    $("#finish-drawing").click(finishCanvas);


    setClass();
    setShape();

    d3.select("body").on("keydown", key);

    setupDrags();
}

function finishCanvas() {
    cursorPos = myCodeMirror.getCursor();
    $("#control-panel").remove();
    $("#grid").remove();
    $("#view-code").remove();
    $("#finish-drawing").remove();
    var svgDom = $("svg")[0].innerHTML;
    myCodeMirror.replaceRange(svgDom, cursorPos);
    cursorPos = null;
    $("svg").remove();
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