function rectSetup() {
    //startPos = d3.mouse(this);
    startPos = snapMouse(d3.mouse(this));
    svgContainer.append("rect")
        .attr("x", startPos[0])
        .attr("y", startPos[1])
        .attr("class", gclass)
        .attr("id", "drawing");
        //.call(dragRect);
    svgContainer.on("mousemove", rectDraw);
}

function rectDraw() {
    //endPos = d3.mouse(this);
    endPos = snapMouse(d3.mouse(this));
    var w = Math.abs(endPos[0] - startPos[0]);
    var h = Math.abs(endPos[1] - startPos[1]);
    d3.select("#drawing").attr("width", w)
        .attr("height", h);
    if (endPos[0] < startPos[0])
        d3.select("#drawing").attr("x", endPos[0]);
    if (endPos[1] < startPos[1])
        d3.select("#drawing").attr("y", endPos[1]);
}

function circleSetup() {
    //startPos = d3.mouse(this);
    startPos = snapMouse(d3.mouse(this));
    svgContainer.append("circle")
        .attr("cx", startPos[0])
        .attr("cy", startPos[1])
        .attr("class", gclass)
        .attr("id", "drawing");
    svgContainer.on("mousemove", circleDraw);
}

// CIRCLEMODE: CORNER
function circleDraw() {
    //endPos = d3.mouse(this);
    endPos = snapMouse(d3.mouse(this));
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
    //endPos = d3.mouse(this);
    endPos = snapMouse(d3.mouse(this));
    var radius = Math.sqrt(
        Math.pow(endPos[0] - startPos[0], 2) +
        Math.pow(endPos[1] - startPos[1], 2));
    $("#drawing").attr("r", radius);
}

function lineSetup() {
    //startPos = d3.mouse(this);
    startPos = snapMouse(d3.mouse(this));
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
    //endPos = d3.mouse(this);
    endPos = snapMouse(d3.mouse(this));
    $("#drawing").attr("x2", endPos[0])
        .attr("y2", endPos[1]);
}

function drawEnded() {
    d3.select("#drawing").attr("id", null);
    $("#select-toggle").prop("checked", true);
    select();
}

// get shape data
function getRectData(selection) {
    this.x = parseInt(selection.attr("x"));
    this.y = parseInt(selection.attr("y"));
    this.width = parseInt(selection.attr("width"));
    this.height = parseInt(selection.attr("height"));
}

function getCircleData(selection) {
    this.cx = parseInt(selection.attr("cx"));
    this.cy = parseInt(selection.attr("cy"));
    this.r = parseInt(selection.attr("r"));
}

function getLineData(selection) {
    this.x1 = parseInt(selection.attr("x1"));
    this.y1 = parseInt(selection.attr("y1"));
    this.x2 = parseInt(selection.attr("x2"));
    this.y2 = parseInt(selection.attr("y2"));
}