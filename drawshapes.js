/****** RECTANGLE ******/

function rectSetup() {
    if(!snapMouseFlag) startPos = d3.mouse(this);
    else startPos = snapMouse(d3.mouse(this));
    svgContainer.append("rect")
        .attr("x", startPos[0])
        .attr("y", startPos[1])
        .attr("class", gclass)
        .attr("id", "drawing");
    svgContainer.on("mousemove", rectDraw);
}

function rectDraw() {
    if(!snapMouseFlag) endPos = d3.mouse(this);
    else endPos = snapMouse(d3.mouse(this));
    var w = Math.abs(endPos[0] - startPos[0]);
    var h = Math.abs(endPos[1] - startPos[1]);
    d3.select("#drawing").attr("width", w)
        .attr("height", h);
    if (endPos[0] < startPos[0])
        d3.select("#drawing").attr("x", endPos[0]);
    if (endPos[1] < startPos[1])
        d3.select("#drawing").attr("y", endPos[1]);
}

/****** CIRCLE ******/

function circleSetup() {
    if(!snapMouseFlag) startPos = d3.mouse(this);
    else startPos = snapMouse(d3.mouse(this));
    svgContainer.append("circle")
        .attr("cx", startPos[0])
        .attr("cy", startPos[1])
        .attr("class", gclass)
        .attr("id", "drawing");
    svgContainer.on("mousemove", circleDraw);
}

// CIRCLEMODE: CORNER
function circleDraw() {
    if(!snapMouseFlag) endPos = d3.mouse(this);
    else endPos = snapMouse(d3.mouse(this));
    var diameter = Math.min(
        Math.abs(endPos[0] - startPos[0]),
        Math.abs(endPos[1] - startPos[1]));
    $("#drawing").attr("r", diameter / 2)
        .attr("cx", startPos[0] + diameter / 2)
        .attr("cy", startPos[1] + diameter / 2);
    if (endPos[0] < startPos[0])
        $("#drawing").attr("cx", startPos[0] - diameter / 2);
    else $("#drawing").attr("cx", startPos[0] + diameter / 2);

    if (endPos[1] < startPos[1])
        $("#drawing").attr("cy", startPos[1] - diameter / 2);
    else $("#drawing").attr("cy", startPos[1] + diameter / 2);
}

// CIRCLEMODE: CENTER
function circleDrawCenter() {
    if(!snapMouseFlag) endPos = d3.mouse(this);
    else endPos = snapMouse(d3.mouse(this));
    var radius = Math.sqrt(
        Math.pow(endPos[0] - startPos[0], 2) +
        Math.pow(endPos[1] - startPos[1], 2));
    $("#drawing").attr("r", radius);
}

/****** LINE ******/

function lineSetup() {
    if(!snapMouseFlag) startPos = d3.mouse(this);
    else startPos = snapMouse(d3.mouse(this));
    svgContainer.append("line")
        .attr("x1", startPos[0])
        .attr("y1", startPos[1])
        .attr("x2", startPos[0])
        .attr("y2", startPos[1])
        .attr("class", gclass)
        .attr("id", "drawing");
    svgContainer.on("mousemove", lineDraw);
}

function lineDraw() {
    if(!snapMouseFlag) endPos = d3.mouse(this);
    else endPos = snapMouse(d3.mouse(this));
    $("#drawing").attr("x2", endPos[0])
        .attr("y2", endPos[1]);
}

/****** ARROW ******/

function defArrow() {
    $("body").append('<svg class="defs"><defs><marker id="regularArrow" class="arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto"><path d="M 2 1 L 5 3 L 2 5" /></marker><marker id="highlightArrow" class="arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto"><path d="M 2 1 L 5 3 L 2 5" /></marker></defs></svg>');
}

function arrowSetup() {
//    lineSetup();
//    d3.select("#drawing").attr("class", gclass + " " + "line_arrow");
    if(!snapMouseFlag) startPos = d3.mouse(this);
    else startPos = snapMouse(d3.mouse(this));
    svgContainer.append("line")
        .attr("x1", startPos[0])
        .attr("y1", startPos[1])
        .attr("x2", startPos[0])
        .attr("y2", startPos[1])
        .attr("class", gclass + " " + "line_arrow")
        .attr("id", "drawing");
    svgContainer.on("mousemove", lineDraw);
}

/****** DRAWEND ******/

function drawEnded() {
    d3.select("#drawing").attr("id", null);
}