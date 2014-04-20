function setupDrags() {
    dragRect = d3.behavior.drag()
        .origin(Object)
        .on("dragstart", setpmousePos)
        .on("drag", dragRectMove);
    //            .on("dragend", function () {
    //                $("#selected").click()
    //            });

    dragCircle = d3.behavior.drag()
        .origin(Object)
        .on("dragstart", setpmousePos)
        .on("drag", dragCircleMove);

    dragLine = d3.behavior.drag()
        .origin(Object)
        .on("dragstart", setpmousePos)
        .on("drag", dragLineMove);
}

function dragRectMove() {
    var pPos = [parseInt(d3.select(this).attr("x")),
                parseInt(d3.select(this).attr("y"))];
    var mousePos = d3.mouse(this);

    var offsetX = mousePos[0] - pmousePos[0];
    var offsetY = mousePos[1] - pmousePos[1];

    d3.select(this).attr("x", pPos[0] + offsetX)
        .attr("y", pPos[1] + offsetY);

    pmousePos = mousePos;
}

function dragCircleMove() {
    var pPos = [parseInt(d3.select(this).attr("cx")),
                parseInt(d3.select(this).attr("cy"))];
    var mousePos = d3.mouse(this);

    var offsetX = mousePos[0] - pmousePos[0];
    var offsetY = mousePos[1] - pmousePos[1];

    d3.select(this).attr("cx", pPos[0] + offsetX)
        .attr("cy", pPos[1] + offsetY);

    pmousePos = mousePos;
}

function dragLineMove() {
    var pPos = [parseInt(d3.select(this).attr("x1")),
                parseInt(d3.select(this).attr("y1")),
                parseInt(d3.select(this).attr("x2")),
                parseInt(d3.select(this).attr("y2"))];
    var mousePos = d3.mouse(this);

    var offsetX = mousePos[0] - pmousePos[0];
    var offsetY = mousePos[1] - pmousePos[1];

    d3.select(this).attr("x1", pPos[0] + offsetX)
        .attr("y1", pPos[1] + offsetY)
        .attr("x2", pPos[2] + offsetX)
        .attr("y2", pPos[3] + offsetY);

    pmousePos = mousePos;
}


function setpmousePos() {
    pmousePos = d3.mouse(this);
}