var animateFunctions = [
    [animateScene0, null],
    [animateScene1, deanimateScene1],
    [animateScene2,deanimateScene2],
    [animateScene3,deanimateScene3]
];

function animateScene( forward ) {
    if (frame > (animateFunctions.length-1)) return;

    const animateFunction = animateFunctions[frame][(forward?0:1)];
    if (animateFunction)
        animateFunction();
}

var colors = ['red','blue'];

var y_debt_rev,y_ratio_rev,y_rate_rev,y_pred_rev,x_scale,y_scale,y_alt,data,alt_data,y_left;
var x_ax_scale = {"1" : d3.scaleBand().domain(["Debt","Income","Ratio"]).range([0,chart_dimensions.width]),
                  "2" : d3.scaleBand().domain(["Inflation","Interest","Effective Interest"]).range([0,chart_dimensions.width])};
console.log(x_ax_scale);

function calculateScales() {
    x1scale.range([0, chart_dimensions.width])
        .domain(Object.keys(scene1data));

    x2scale.range([0, chart_dimensions.width])
        .domain(Object.keys(scene2data));

    x3scale.range([0, chart_dimensions.width])
        .domain(scene3data.Date);

    y_debt.domain([0,scene1data.fed_debt]).range([100,chart_dimensions.height]);
    y_ratio.domain([0,scene1data.gdp_ratio]).range([100,chart_dimensions.height]);
    y_rate.domain([scene2data.eff_fed_int,scene2data.eff_h_int]).range([-50,chart_dimensions.height]);
    y_pred_debt.domain([0,scene3data.Federal_Debt[7]]).range([0,chart_dimensions.height]);
    y_debt_rev = y_debt.copy();
    y_debt_rev.range([chart_dimensions.height,0]);
    y_ratio_rev =  y_ratio.copy();
    y_ratio_rev.range([chart_dimensions.height,0]);
    y_rate_rev = y_rate.copy();
    y_rate_rev.range([chart_dimensions.height,0]);
    y_pred_rev = y_pred_debt.copy();
    y_pred_rev.range([chart_dimensions.height,0]);
    x_scale = {"1" : x1scale, "2" : x2scale, "3" : x3scale};
    y_scale = {"1" : y_debt, "2" : y_rate, "3" : y_pred_debt};
    x_ax_scale["3"] = x3scale;
    y_alt = {"1" : y_ratio, "2" : y_rate};
    data = {"1" : [debt_data,income_data], "2" : [inflation_data,interest_data]};
    alt_data = {"1" : ratio_data, "2" : eff_interest_data};
    y_left = {"1" : y_debt_rev, "2" : y_rate_rev, "3": y_pred_rev};
}

function initializeChartArea() {
    chart = d3.select(".chart")
        .attr("width", canvas.width)
        .attr("height", canvas.height);
}

function createDebtBars(scene) {
    d3.select(".chart").selectAll(".debt-group")
        .data(Object.keys(data[scene][0]))
        .enter()
        .append("g")
        .classed("debt-group",true)
        .attr("transform",
            function (d) {
                return "translate(" + (margin.left + x_scale[scene].bandwidth()) + ", " + margin.top + ")";
            })
        .append("rect")
        .classed("debt-rect",true)
        .attr("width", x_scale[scene].bandwidth()/2)
        .attr("height", 0)
        .attr("x", function(d,i) {return x_scale[scene].bandwidth()*i/2;})
        .attr("y", chart_dimensions.height)
        .attr("fill", function(d,i) {return colors[i];});
}

function showDebtBars(scene) {
    d3.selectAll(".debt-rect")
        .data(Object.values(data[scene][0]))
        .transition()
        .duration(1000)
        .attr("height", function (d) {
            return y_scale[scene](d);
        })
        .attr("y", function (d) {
            return (chart_dimensions.height - y_scale[scene](d));
        });
}

function hideDebtBars() {
    d3.selectAll(".debt-rect")
        .transition()
        .duration(1000)
        .attr("height", 0);
}

function createIncomeBars(scene) {
    d3.select(".chart").selectAll(".income-group")
        .data(Object.keys(data[scene][1]))
        .enter()
        .append("g")
        .classed("income-group",true)
        .attr("transform",
            function (d) {
                return "translate(" + (margin.left + (x_scale[scene].bandwidth()*3)) + ", " + margin.top + ")";
            })
        .append("rect")
        .classed("income-rect",true)
        .attr("x", function(d,i) {return x_scale[scene].bandwidth()*i/2;})
        .attr("y", chart_dimensions.height)
        .attr("width", x_scale[scene].bandwidth() / 2)
        .attr("height", 0)
        .attr("fill", function(d,i) {return colors[i];});
}

function showIncomeBars(scene) {
    d3.selectAll(".income-rect")
        .data(Object.values(data[scene][1]))
        .transition()
        .duration(1000)
        .attr("y",function (d) { return (chart_dimensions.height-y_scale[scene](d)); })
        .attr("height",function(d) { return y_scale[scene](d);});
}

function hideIncomeBars() {
    d3.selectAll(".income-rect")
        .transition()
        .duration(1000)
        .attr("height", 0);
}

function createRatioBars(scene) {
    d3.select(".chart").selectAll(".ratio-group")
        .data(Object.keys(alt_data[scene]))
        .enter()
        .append("g")
        .classed("ratio-group",true)
        .attr("transform",
            function (d) {
                return "translate(" + (margin.left + (x_scale[scene].bandwidth()*5)) + ", " + margin.top + ")";
            })
        .append("rect")
        .classed("ratio-rect",true)
        .attr("x", function(d,i) {return x_scale[scene].bandwidth()*i/2;})
        .attr("y", chart_dimensions.height)
        .attr("width", x_scale[scene].bandwidth() / 2)
        .attr("height", 0)
        .attr("fill", function(d,i) {return colors[i];});
}

function showRatioBars(scene) {
    d3.selectAll(".ratio-rect")
        .data(Object.values(alt_data[scene]))
        .transition()
        .duration(1000)
        .attr("y", function (d) { if (y_alt[scene](d) >= 0) {
                                    return (chart_dimensions.height-y_alt[scene](d));}
                                  else {
                                    return chart_dimensions.height;}})
        .attr("height", function (d) { return Math.abs(y_alt[scene](d));});
}

function hideRatioBars() {
    d3.selectAll(".ratio-rect")
        .transition()
        .duration(1000)
        .attr("height", 0);
}

function removeBars() {
    d3.selectAll(".ratio-group").remove();
    d3.selectAll(".income-group").remove();
    d3.selectAll(".debt-group").remove();
}

const y_text = {"1" : "Debt ($T)", "2" : "Rate (%)", "3" : "Debt ($T)"};

const ticks = {"1" : ["Debt", "Income", "Debt:Income Ratio"],
               "2" : ["Interest Rate", "Inflation", "Effective Interest Rate"],
               "3" : scene3data.Date
              };

const text = {"1" : "Factor",
              "2" : "Factor",
              "3" : "Year"
             };

function createBottomAxis(scene) {
    const xAxis = d3.axisBottom().scale(x_ax_scale[scene])
        .tickSize(10);

    d3.select(".chart").append("g")
        .attr("id", "xAxisG")
        .classed("x axis",true)
        .attr("transform", "translate(" + margin.left + "," + (margin.top + chart_dimensions.height) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("dx", 0)
        .attr("dy", "0.35em")
        .style("text-anchor", "middle");

    d3.select(".chart").append("text")
        .attr("id", "xBottomAxisLabel")
        .attr("transform",
            "translate(" + (margin.left + chart_dimensions.width / 2) + " ," +
            (margin.top + chart_dimensions.height + 50) + ")")
        .style("text-anchor", "middle")
        .text(text[scene]);
}

function showBottomAxis(scene) {
    const xAxis = d3.axisBottom().scale(x_ax_scale[scene])
        .tickSize(10);
    d3.select("#xAxisG")
        .transition()
        .duration(1000)
        .attr("transform", "translate(" + margin.left + "," + (margin.top + chart_dimensions.height) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("dx", 0)
        .attr("dy", "0.35em")
        .style("text-anchor", "middle");
    d3.select("#xBottomAxisLabel")
        .transition()
        .duration(1000)
        .text(text[scene]);
}

function createLeftAxis(scene) {
    const left = d3.axisLeft().scale(y_left[scene])
        .tickSize(10).ticks(20);

    d3.select(".chart").append("g")
        .attr("id", "yLeftAxisG")
        .classed("y-left-axis",true)
        .attr("transform", "translate(" + margin.left + "," + (margin.top + chart_dimensions.height + margin.bottom) + ")")
        .call(left);

    d3.select("svg").append("text")
        .attr("id", "yLeftAxisLabel")
        .attr("transform",
            "translate(8," + (margin.top + chart_dimensions.height + margin.bottom + chart_dimensions.height / 2) + ")" +
            ", rotate(-90)")
        .style("text-anchor", "middle")
        .text(y_text[scene]);
}

function showLeftAxis(scene) {
    const left = d3.axisLeft().scale(y_left[scene])
        .tickSize(10).ticks(20);
    d3.select("#yLeftAxisG")
        .transition()
        .duration(1000)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(left)
        .selectAll("text")
        .attr("x", -30)
        .attr("y", 0)
        .attr("dx", 0)
        .attr("dy", "0.35em")
        .style("text-anchor", "start");
    d3.select("#yLeftAxisLabel")
        .transition()
        .duration(1000)
        .attr("transform",
            "translate(8," + (margin.top + chart_dimensions.height / 2) + ")" +
            ", rotate(-90)")
        .text(y_text[scene]);
}

function removeBotLeftAxes() {
    d3.select("#yLeftAxisG").remove();
    d3.select("#xAxisG").remove();
    d3.select("#xBottomAxisLabel").remove();
}

function createRightAxis() {
    const yRightAxis = d3.axisRight().scale(y_ratio_rev)
        .tickSize(10).ticks(20);

    d3.select(".chart").append("g")
        .attr("id", "yRightAxisG")
        .classed("y-right-axis",true)
        .attr("transform", "translate(" + (8 + margin.left + chart_dimensions.width) + "," +
            (margin.top + chart_dimensions.height + margin.bottom) + ")")
        .call(yRightAxis)
        .selectAll("text")
        .attr("x", 15)
        .attr("y", 0)
        .attr("dx", 0)
        .attr("dy", "0.35em")
        .style("text-anchor", "start");
    d3.select(".chart").append("text")
        .attr("id", "yRightAxisLabel")
        .attr("transform",
            "translate(" + (margin.left + chart_dimensions.width + 50) + ","
            + ((margin.top + chart_dimensions.height + margin.bottom) + chart_dimensions.height / 2) + "),rotate(-90)")
        .style("text-anchor", "middle")
        .text("Debt:Income Ratio (%)");
    d3.select("#yRightAxisG")
        .transition()
        .duration(1000)
        .attr("transform", "translate(" + (margin.left + chart_dimensions.width) + "," + margin.top + ")")
        .call(yRightAxis);
    d3.select("#yRightAxisLabel")
        .transition()
        .duration(1000)
        .attr("transform", "translate(" + (margin.left + chart_dimensions.width + 52) + "," +
            (margin.top + chart_dimensions.height/2) + "),rotate(-90)");
}

function removeRightAxis() {
    d3.select("#yRightAxisG")
        .remove();
    d3.select("#yRightAxisLabel").remove();
}

function showTitleIntro() {
    d3.select("#chart-div")
        .classed("invisible",false);

    const div = d3.select("#chart-div")
        .append("div");

    div.attr("id","intro-title")
        .attr("style","width: 900px; height: 500px; padding: 80px;position: relative; z-index: 2; top: 0; left: 0; background-color: rgb(158,202,225); opacity: 0");

    div.append("h4")
        .attr("align","left")
        .html("Welcome");

    div.append("p")
        .html("<p>This is my narrative visualization for data related to the current state of indebtedness in the United States. " +
            "The aim of this presentation is to explore the current and future impacts of debt in terms of both " +
            "federal debt, the amount which the federal government owes to its citizens and foreign governments, " +
            "and household debt, the amount that U.S. citizens owe to private institutions.</p>");

    div.append("p")
        .html("<p>We will follow a martini glass structure, i.e. a slideshow will be presented with the " +
            "final slide allowing user interaction.</p>");

    div.append("p")
        .html("<p>Use the right arrow button in the top left of this page to navigate to the next scene in the " +
            "narrative visualization.</p>");

    d3.select("#intro-title")
        .transition()
        .duration(1000)
        .style("opacity",0.95);

    d3.select("#chart-id")
        .transition()
        .duration(1000)
        .style("opacity",1.0);
}
function hideTitleIntro() {

    d3.select("#intro-title")
        .transition()
        .duration(500)
        .style("opacity",0)
        .remove();

}

function createScatterplot() {
    var ftip = d3.selectAll(".circle-fed")
        .data(scene3data.Debt_GDP)
        .enter()
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text(function(d) {return d;});
    console.log(ftip,ftip._groups[0],ftip._groups[0][0]);
    var htip = d3.selectAll(".circle-h")
        .data(scene3data.Debt_Income)
        .enter()
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text(function(d) {return d;});
    d3.select(".chart")
        .selectAll("circle").data(scene3data.Date)
        .enter()
        .append("g")
        .attr("id", "c")
        .attr("transform", "translate(50,0)")
        .append("circle")
        .attr("class", "circle-fed")
        .attr("cx", function(d,i) { return margin.left + x3scale(d);} )
        .attr("cy", chart_dimensions.height)
        .attr("r", 0)
        .attr("fill", "red")
        .attr("fill-opacity", "0")
        .attr("stroke-width", 0)
        .on("mouseover", function(d,i){return ftip._groups[0][i].style.visibility="visible";})
        .on("mousemove", function(d,i){ftip._groups[0][i].style.top=(d3.event.pageY-10)+"px";
                                       return ftip._groups[0][i].style.left=(d3.event.pageX+10)+"px";})
        .on("mouseout", function(d,i){return ftip._groups[0][i].style.visibility="hidden";});
    d3.selectAll("#c")
        .append("circle")
        .attr("class", "circle-h")
        .attr("cx", function(d,i) { return margin.left + x3scale(d);} )
        .attr("cy", chart_dimensions.height)
        .attr("r", 0)
        .attr("fill", "blue")
        .attr("fill-opacity", "0")
        .attr("stroke-width", 0)
        .on("mouseover", function(d,i){return htip._groups[0][i].style.visibility="visible";})
        .on("mousemove", function(d,i){htip._groups[0][i].style.top=(d3.event.pageY-10)+"px";
                                    return htip._groups[0][i].style.left=(d3.event.pageX+10)+"px";})
        .on("mouseout", function(d,i){return htip._groups[0][i].style.visibility="hidden";});
}

function showScatterplot() {
    d3.selectAll(".circle-fed")
        .data(scene3data.Federal_Debt)
        .transition()
        .duration(1000)
        .attr("cy",function(d) {return (margin.top + chart_dimensions.height-y_pred_debt(d)); })
        .attr("r", 5)
        .attr("fill-opacity","1")
        .attr("stroke-width", 3);
    d3.selectAll(".circle-h")
        .data(scene3data.Household_Debt)
        .transition()
        .duration(1000)
        .attr("cy",function(d) {return (margin.top + chart_dimensions.height-y_pred_debt(d)); })
        .attr("r",5)
        .attr("fill-opacity","1")
        .attr("stroke-width", 3);
}

function removeScatterplot() {
    d3.selectAll("circle").remove();
}

function showChartTitle( title ) {
    d3.select(".chart")
        .append("text")
        .attr("class","chart-title")
        .attr("transform",
            "translate(" + (margin.left + chart_dimensions.width / 2) + ","
            + (margin.top / 2) + ")")
        .style("text-anchor", "middle")
        .style("opacity",0)
        .text(title);

    d3.select(".chart-title")
        .transition()
        .duration(1000)
        .style("opacity",1);
}

function changeChartTitle(title) {
    d3.select(".chart-title")
        .transition()
        .duration(1000)
        .text(title);
}

function animateScene0() {

    showTitleIntro();

    initializeChartArea();
    calculateScales();

    showChartTitle("Which is more concerning?");
}
function animateScene1() {
    hideTitleIntro();
    createDebtBars("1");
    createIncomeBars("1");
    createRatioBars("1");
    showDebtBars("1");
    showIncomeBars("1");
    showRatioBars("1");
    createLegend();
    changeChartTitle("Federal and Household Debt in 2016")
    createBottomAxis("1");
    showBottomAxis("1");
    createLeftAxis("1");
    showLeftAxis("1");
    createRightAxis();

}

function animateScene2() {
    removeRightAxis();
    showDebtBars("2");
    showIncomeBars("2");
    showRatioBars("2");
    showBottomAxis("2");
    showLeftAxis("2");
    changeChartTitle("Effective Interest Rates")
}

function animateScene3() {
    hideDebtBars();
    hideIncomeBars();
    hideRatioBars();
    showLeftAxis("3");
    showBottomAxis("3");
    createScatterplot();
    showScatterplot();
    changeChartTitle("The Debt Future");
}

function deanimateScene1() {
    removeLegend();
    removeRightAxis();
    removeBars();
    removeBotLeftAxes();
    showTitleIntro();
}
function deanimateScene2() {
    showDebtBars("1");
    showIncomeBars("1");
    showRatioBars("1");
    changeChartTitle("Federal and Household Debt in 2016");
    showBottomAxis("1");
    showLeftAxis("1");
    createRightAxis();
}

function deanimateScene3() {
    removeScatterplot();
    showDebtBars("2");
    showIncomeBars("2");
    showRatioBars("2");
    showBottomAxis("2");
    showLeftAxis("2");
    changeChartTitle("Effective Interest Rates")    
}

function createLegend() {
    
   d3.select(".chart").append("g")
        .attr("id", "legend")
        .attr("transform", "translate(" + (chart_dimensions.width-50) + "," + (margin.top-40) + ")")
        .selectAll("rect")
        .data(colors)
        .enter()
        .append("rect")
        .attr("fill", function(d) {return d;})
        .attr("width", 5)
        .attr("height", 5)
        .attr("y", function(d,i) {return i*15;});
    d3.select("#legend")
        .selectAll("text")
        .data(["Federal","Household"])
        .enter()
        .append("text")
        .attr("x", 10)
        .attr("y", function(d,i) {return i*15+5;})
        .style("text-anchor", "start")
        .text(function(d) {return d;});
        
}

function removeLegend() {
    d3.select("#legend").remove();
}
