$(function () {
    var startPos = [0, 0];
    var endPos = [0, 0];
//    var drag = d3.behavior.drag()
//                          .on("dragstart", dragstarted)
//                          .on("drag", dragged)
//                          .on("dragend", dragended);
    
    var svgContainer = d3.select("body").append("svg")
                                        //.call(drag)
                                        .on("mousedown", rectSetup)
                                        .on("mouseup", dragended);
    
    var gclass = $('input:radio[name=gclass]:checked').val();
    var shape = $('input:radio[name=shape]:checked').val();
    
    $("#select-class").change(function() {
        gclass = $('input:radio[name=gclass]:checked').val();
    });
    
    $("#select-shape").change(function() {
        shape = $('input:radio[name=shape]:checked').val();
        switch(shape) {
            case "rect":
                svgContainer.on("mousedown", rectSetup);
                break;
            case "circle":
                svgContainer.on("mousedown", circleSetup);
                break;
        }
    });
    

    function rectSetup() {
        startPos = d3.mouse(this);
        svgContainer.append("rect")
                    .attr("x", startPos[0])
                    .attr("y", startPos[1])
                    .attr("class", gclass)
                    .attr("id", "active");
        svgContainer.on("mousemove", rectDraw);
    }
    
    function rectDraw() {
        endPos = d3.mouse(this);
        var w = Math.abs(endPos[0] - startPos[0]);
        var h = Math.abs(endPos[1] - startPos[1]);
        $("#active").attr("width", w)
                    .attr("height", h);
        if(endPos[0] < startPos[0]) 
            $("#active").attr("x", endPos[0]);
        if(endPos[1] < startPos[1])
            $("#active").attr("y", endPos[1]);
    }
    
    function circleSetup() {
        startPos = d3.mouse(this);
        svgContainer.append("circle")
                    .attr("cx", startPos[0])
                    .attr("cy", startPos[1])
                    .attr("class", gclass)
                    .attr("id", "active");
        svgContainer.on("mousemove", circleDraw);
    }
    
    function circleDraw() {
        endPos = d3.mouse(this);
        var radius = Math.sqrt(
            Math.pow(endPos[0]-startPos[0], 2) + 
            Math.pow(endPos[1]-startPos[1], 2));
        $("#active").attr("r", radius);
    }
    
    function dragended() {
        $("#active").attr("id", null);
        svgContainer.on("mousemove", null);
    }
    
    var domStr = $("svg").clone().html();
});