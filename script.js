$(function () {
    var startPos = [0, 0];
    var endPos = [0, 0];
    
    var pmousePos = [0, 0];
    function setpmousePos() {
        pmousePos = d3.mouse(this);
    }
    
    var selectionType = null;
    var selection;
    
    //        var drag = d3.behavior.drag()
    //                              .on("dragstart", dragstarted)
    //                              .on("drag", dragged)
    //                              .on("dragend", dragended);

    var dragRect = d3.behavior.drag()
        .origin(Object)
        .on("dragstart", setpmousePos)
        .on("drag", dragRectMove);
    
    var dragCircle = d3.behavior.drag()
        .origin(Object)
        .on("dragstart", setpmousePos)
        .on("drag", dragCircleMove);
    
    var dragLine = d3.behavior.drag()
        .origin(Object)
        .on("dragstart", setpmousePos)
        .on("drag", dragLineMove);
    
    function dragRectMove() {
        var pPos = [parseInt(d3.select("#selected").attr("x")),
                    parseInt(d3.select("#selected").attr("y"))];
        var mousePos = d3.mouse(this);
        
        var offsetX = mousePos[0] - pmousePos[0];
        var offsetY = mousePos[1] - pmousePos[1];
        
        selection.attr("x", pPos[0]+offsetX)
            .attr("y", pPos[1]+offsetY);
        
        pmousePos = mousePos;
//        selection.attr("x", d3.event.x)
//                 .attr("y", d3.event.y);
    }
    
    function dragCircleMove() {
        var pPos = [parseInt(d3.select("#selected").attr("cx")),
                    parseInt(d3.select("#selected").attr("cy"))];
        var mousePos = d3.mouse(this);
        
        var offsetX = mousePos[0] - pmousePos[0];
        var offsetY = mousePos[1] - pmousePos[1];
        
        selection.attr("cx", pPos[0]+offsetX)
            .attr("cy", pPos[1]+offsetY);
        
        pmousePos = mousePos;
    }
    
    function dragLineMove() {
        var pPos = [parseInt(d3.select("#selected").attr("x1")),
                    parseInt(d3.select("#selected").attr("y1")),
                    parseInt(d3.select("#selected").attr("x2")),
                    parseInt(d3.select("#selected").attr("y2"))];
        var mousePos = d3.mouse(this);
        
        var offsetX = mousePos[0] - pmousePos[0];
        var offsetY = mousePos[1] - pmousePos[1];
        
        selection.attr("x1", pPos[0]+offsetX)
            .attr("y1", pPos[1]+offsetY)
            .attr("x2", pPos[2]+offsetX)
            .attr("y2", pPos[3]+offsetY);
        
        pmousePos = mousePos;
    }

    var svgContainer = d3.select("body").append("svg")
        .on("mousedown", rectSetup)
        .on("mouseup", dragended);

    var gclass = $('input:radio[name=gclass]:checked').val();
    var shape = $('input:radio[name=shape]:checked').val();

    $("#select-class").change(function () {
        gclass = $('input:radio[name=gclass]:checked').val();
    });

    $("#select-shape").change(function () {
        shape = $('input:radio[name=shape]:checked').val();
        switch (shape) {
        case "select":
            svgContainer.on("mousedown", null)
                .on("mouseup", null);
            break;
        case "rect":
            svgContainer.on("mousedown", rectSetup)
                .on("mouseup", dragended);
            break;
        case "circle":
            svgContainer.on("mousedown", circleSetup)
                .on("mouseup", dragended);
            break;
        case "line":
            svgContainer.on("mousedown", lineSetup)
                .on("mouseup", dragended);
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
        if (endPos[0] < startPos[0])
            $("#active").attr("x", endPos[0]);
        if (endPos[1] < startPos[1])
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

    // CIRCLEMODE: CORNER
    function circleDraw() {
        endPos = d3.mouse(this);
        var diameter = Math.min(
            Math.abs(endPos[0] - startPos[0]),
            Math.abs(endPos[1] - startPos[1]));
        $("#active").attr("r", diameter / 2)
            .attr("cx", startPos[0] + diameter / 2)
            .attr("cy", startPos[1] + diameter / 2);
        if (endPos[0] < startPos[0])
            $("#active").attr("cx", startPos[0] - diameter / 2);
        else $("#active").attr("cx", startPos[0] + diameter / 2);

        if (endPos[1] < startPos[1])
            $("#active").attr("cy", startPos[1] - diameter / 2);
        else $("#active").attr("cy", startPos[1] + diameter / 2);
    }

    // CIRCLEMODE: CENTER
    function circleDrawCenter() {
        endPos = d3.mouse(this);
        var radius = Math.sqrt(
            Math.pow(endPos[0] - startPos[0], 2) +
            Math.pow(endPos[1] - startPos[1], 2));
        $("#active").attr("r", radius);
    }

    function lineSetup() {
        startPos = d3.mouse(this);
        svgContainer.append("line")
            .attr("x1", startPos[0])
            .attr("y1", startPos[1])
            .attr("x2", startPos[0])
            .attr("y2", startPos[1])
            .attr("class", gclass)
            .attr("id", "active");
        svgContainer.on("mousemove", lineDraw);
    }

    function lineDraw() {
        endPos = d3.mouse(this);
        $("#active").attr("x2", endPos[0])
            .attr("y2", endPos[1]);
    }

    function dragended() {
//        $("#active").attr("id", null)
//            .click(elementSelect)
//            .mouseover(elementHover);
        
        d3.select("#active").attr("id", null)
            .on("click", elementSelect);
        svgContainer.on("mousemove", null)
            .on("mouseup", null)
            .on("mousedown", null);
            //.on("mousedown", elementUnselect);
        $("#select-toggle").prop("checked", true);
    }

//    function elementUnselect() {
//        d3.select("#selected")//.attr("id", null)
//            .on("click", elementSelect);
//    }

    function elementSelect() {
        //elementUnselect();
        $(this).attr("id", "selected")
            .outside('click', function(e){
            $(this).attr("id", null);
        });
        selection = d3.select("#selected");
            //.on("click", null);
        selectionType = $("#selected").prop("tagName");
        
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


    var domStr = $("svg").clone().html();
});

// click outside elements
(function($){
   $.fn.outside = function(ename, cb){
      return this.each(function(){
         var $this = $(this),
              self = this;
         $(document.body).bind(ename, function tempo(e){
             if(e.target !== self && !$.contains(self, e.target)){
                cb.apply(self, [e]);
                if(!self.parentNode) $(document.body).unbind(ename, tempo);
             }
         });
      });
   };
}(jQuery));