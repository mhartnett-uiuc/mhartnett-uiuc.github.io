const annotations = {
    "scene-1":
        {
            text: ["Decades prior to 2002", "Small and slightly", "growing body of research"],
            textCenter: {
                year: 2016,
                debt: 1e6
            },
            aimingPoints: [
                {
                    year: 2016,
                    debt: 1e5
                }
            ]
        },
    "scene-2":
        {
            text: ["September 11th Attack:", "Abrupt increase in number of ", "debt published. Steady", "increase since then."],
            textCenter: {
                year: 2002,
                debt: 130,
            },
            aimingPoints: [
                {
                    year: 2002,
                    debt: 30
                }
            ]
        },
    "scene-3a":
        {
            text: ["Citations have kept pace", "at about 10-20 to 1."],
            textCenter: {
                year: 1999,
                debt: 110
            },
            aimingPoints: [
                {
                    year: 2004,
                    debt: 60
                }
            ]
        },
    "scene-3b": {
        text: ["Drop-off in citations in 2013",
               "suggests that it takes 5+ years",
               "for the effect of research to be felt"],
        textCenter: {
            year: 2003,
            debt: 170
        },
        aimingPoints: [{
            year: 2013,
            debt: 120
        }
        ]
    },
    "scene-3c": {
        text: ["Large spike in 2010-2011. Why?", "We'll explore that next scene."],
        textCenter: {
            year: 1997,
            debt: 212
        },
        aimingPoints: [{
            year: 2010,
            debt: 212
        }]
    }
};


function removeAnnotation( annotationName ) {
    const rectName = "annotation-rect-" + annotationName;
    const textName = "annotation-text-" + annotationName;
    const lineSetName = "annotation-lines-" + annotationName;
    const lineClass = "annotation-line-" + annotationName;
    const tspanClass = "annotation-tspan-" + annotationName;

    d3.selectAll("." + tspanClass)
        .transition()
        .duration(500)
        .attr("opacity",0)
        .remove();
    d3.select("#" + rectName)
        .transition()
        .duration(500)
        .attr("opacity",0)
        .remove();
    d3.selectAll("." + lineClass)
        .transition()
        .duration(500)
        .attr("opacity",0)
        .remove();
    d3.select("#" + textName)
        .transition()
        .delay(500)
        .duration(0)
        .attr("opacity",0)
        .remove();
    d3.select("#" + lineSetName)
        .transition()
        .delay(500)
        .duration(0)
        .remove();
}

var x_scales = {"scene-1":x1scale, "scene-2":x2scale, "scene-3":x3scale};
var y_scales = {"scene-1":y_debt, "scene-2":y_rate, "scene-3":y_pred_debt};

function insertAnnotation( annotationName ) {
    const rectName = "annotation-rect-" + annotationName;
    const textName = "annotation-text-" + annotationName;
    const lineSetName = "annotation-lines-" + annotationName;
    const lineClass = "annotation-line-" + annotationName;
    const tspanClass = "annotation-tspan-" + annotationName;

    const annotation = annotations[annotationName];
    const x_scale = x_scales[annotationName];
    const y_scale = y_scales[annotationName];
    // First add the text lines to the graph so we can calculate the geometry
    // of it
    d3.select(".chart")
        .append("text")
        .attr("id",textName)
        .selectAll("tspan").data(annotation.text)
        .enter()
        .append("tspan")
        .attr("class",tspanClass)
        .attr("opacity",0)
        .attr("text-anchor","start")
        .attr("x",10)
        .attr("y",function(d,i) { return (i*15) })
        .text(function(d,i) { return annotation.text[i]});

    // Now calculate the bounding rectangle of this text area
    const annotationText = document.getElementById(textName);
    const SVGRect = annotationText.getBBox();
    const rectDimensions = {
        height: (10 + SVGRect.height + 10),
        width: (10 + SVGRect.width + 10)
    };
    const textBlockDimensions = annotationText.getBoundingClientRect();

    // Remove the text, as we will want to add it in a different order so that z layering works
    d3.select("#"+textName).remove();

    const textBlockTopLeft = {
        x: (margin.left+(x_scale(annotation.textCenter.year)+(x_scale.bandwidth()*0.75))-textBlockDimensions.width/2),
        y: (margin.top+chart_dimensions.height-y_scale(annotation.textCenter.debt)+textBlockDimensions.height/2)
    };

    const lineStartingPoint = {
        x: (textBlockTopLeft.x + (textBlockDimensions.width/2)),
        y: (textBlockTopLeft.y + (textBlockDimensions.height/2))
    };

    d3.select(".chart")
        .append("g")
        .attr("id",lineSetName)
        .selectAll("line").data(annotation.aimingPoints)
        .enter()
        .append("line")
        .attr("class",lineClass)
        .attr("opacity",0)
        .attr("style","stroke:rgb(0,0,0);stroke-width:0.5px")
        .attr("x1",lineStartingPoint.x)
        .attr("y1",lineStartingPoint.y)
        .attr("x2",function(d,i) {
            return (margin.left + (x_scale(annotation.aimingPoints[i].year)+x_scale.bandwidth()*0.75));
        })
        .attr("y2",function(d,i) {
            return (margin.top + chart_dimensions.height - y_scale(annotation.aimingPoints[i].debt))
        });

    d3.select(".chart")
        .append("rect")
        .attr("id",rectName)
        .attr("opacity",0)
        .attr("x",textBlockTopLeft.x-10)
        .attr("y",textBlockTopLeft.y-20)
        .attr("height",rectDimensions.height)
        .attr("width", rectDimensions.width)
        .attr("fill","lightgrey");

    // Under our text section create tspans for every line of text in the annotation
    d3.select(".chart")
        .append("text")
        .attr("id",textName)
        .selectAll("tspan").data(annotation.text)
        .enter()
        .append("tspan")
        .attr("class",tspanClass)
        .attr("opacity",0)
        .attr("text-anchor","start")
        .attr("x",textBlockTopLeft.x)
        .attr("y",function(d,i) { return (textBlockTopLeft.y + i*15) })
        .text(function(d,i) { return annotation.text[i]});

    d3.selectAll("." + lineClass)
        .transition()
        .delay(500)
        .duration(500)
        .attr("opacity",1);

    d3.select("#" + rectName)
        .transition()
        .duration(1000)
        .attr("opacity",1);

    d3.selectAll("." + tspanClass)
        .transition()
        .duration(1000)
        .attr("opacity",1);
}

