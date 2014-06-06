/****** SNAPPING ******/

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
    return snap;
}

/****** GET SVG BOUNDING BOX ******/

function getSVGBoundingBox() {
    var elements = d3.selectAll("#active-svg > *")[0];
    this.startX = CANVASWIDTH;
    this.startY = CANVASHEIGHT;
    this.endX = 0;
    this.endY = 0;

    for (var i = 0; i < elements.length; i++) {
        var s = d3.select(elements[i]);

        var d;
        
        switch (elements[i].tagName) {
        case "rect":
            d = new getRectData(s);
            if(d.x < this.startX) this.startX = d.x;
            if(d.y < this.startY) this.startY = d.y;
            if(d.x + d.width > this.endX) this.endX = d.x + d.width;
            if(d.y + d.height > this.endY) this.endY = d.y + d.height;
            break;
        case "circle":
            d = new getCircleData(s);
            if(d.cx - d.r < this.startX) this.startX = d.cx - d.r;
            if(d.cy - d.r < this.startY) this.startY = d.cy - d.r;
            if(d.cx + d.r > this.endX) this.endX = d.cx + d.r;
            if(d.cy + d.r > this.endY) this.endY = d.cy + d.r;
            break;
        case "line":
            d = new getLineData(s);
            var lstartX, lstartY, lendX, lendY;
            if(d.x1 < d.x2) {
                lstartX = d.x1;
                lendX = d.x2;
            } else {
                lstartX = d.x2;
                lendX = d.x1;
            }
                
            if(d.y1 < d.y2) {
                lstartY = d.y1;
                lendY = d.y2;
            } else {
                lstartY = d.y2;
                lendY = d.y1;
            }
                
            if(lstartX < this.startX) this.startX = lstartX;
            if(lstartY < this.startY) this.startY = lstartY;
            if(lendX > this.endX) this.endX = lendX;
            if(lendY > this.endY) this.endY = lendY;

            break;
        }
    }
}

/****** TRIM AND CENTER ******/

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
        case "text":
            d = new getTextData(s);
            s.attr("x", d.x - b.startX + CANVASMARGIN)
                .attr("y", d.y - b.startY + CANVASMARGIN);
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
        case "text":
            d = new getTextData(s);
            s.attr("x", d.x + moveX)
                .attr("y", d.y + moveY);
            break;
        }
    }
    
    svgContainer.attr("width", CANVASWIDTH)
        .attr("height", CANVASHEIGHT);
}

/****** GET SHAPE DATA ******/

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

function getTextData(selection) {
    this.x = parseInt(selection.attr("x"));
    this.y = parseInt(selection.attr("y"));
}