
// Define Margin
var margin = {left: 80, right: 80, top: 50, bottom: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Define Color
var colors = d3.scale.category20();

// Define Tooltip
var tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .classed("hidden", true);

// Define Tooltip fields
tooltip.append("p").attr("id", "country");
tooltip.append("p").attr("id", "population");
tooltip.append("p").attr("id", "gdp");
tooltip.append("p").attr("id", "epc");
tooltip.append("p").attr("id", "total");

// Define Scales   
var xScale = d3.scale.linear()
    .domain([0, 16]) //Need to redefine this after loading the data
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain([-10, 400]) //Need to redfine this after loading the data
    .range([height, 0]);

// Define Tooltip here


// Define Axis
var xAxis = d3.svg.axis().scale(xScale)
    .orient("bottom")
    .tickPadding(2);

var yAxis = d3.svg.axis().scale(yScale)
    .orient("left")
    .tickPadding(2);

// Define Zoom
function zoomed() {
    svg.selectAll(".dot").attr("transform", "translate(" + d3.event.translate[0] + "," + d3.event.translate[1] + ") scale(" + d3.event.scale + ")");
    svg.selectAll(".text").attr("transform", "translate(" + d3.event.translate[0] + "," + d3.event.translate[1] + ") scale(" + d3.event.scale + ")");
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);
}

var zoom = d3.behavior.zoom()
    .x(xScale)
    .y(yScale)
    .scaleExtent([1, 32])
    .on("zoom", zoomed);

// Define SVG
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);


// Define Tooltip Show/Hide behavior
var tooltipOn = function (d) {
    // Get this bar's x/y values, then augment for the tooltip
    var xPosition = parseFloat(d3.select(this).attr("cx")) 
                 || parseFloat(d3.select(this).attr("x")),
        yPosition = parseFloat(d3.select(this).attr("cy"))
                 || parseFloat(d3.select(this).attr("y"));

    // Update the tooltip position and text fields
    d3.select("#tooltip")
        .style("left", xPosition + "px")
        .style("top",  yPosition + "px");

    d3.select("#country")   .text(d.country);
    d3.select("#population").text("Population: " + d.population + " million");
    d3.select("#gdp")       .text("GDP: $" + d.gdp + " trillion");
    d3.select("#epc")       .text("EPC: " + d.epc + " million BTUs");
    d3.select("#total")     .text("Total: " + d.total + " trillion BTUs");

    // Show the tooltip
    d3.select("#tooltip").classed("hidden", false);
};
var tooltipOff = function () {
    // Hide the tooltip
    d3.select("#tooltip").classed("hidden", true);
};

// Get Data
// Define domain for xScale and yScale
d3.csv("scatterdata.csv", function (error, data) {
    if (error) { throw error; }
    console.log(data);
    
    xScale.domain([0, 3+d3.max(data, function (d) { return parseInt(d.gdp); })]);
    yScale.domain([d3.min(data, function (d) { return parseInt(d.epc)-parseInt(d.total); }),
                   d3.max(data, function (d) { return parseInt(d.epc)+parseInt(d.total); })]);
    
    //Draw Scatterplot
    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function (d) { return Math.sqrt(d.total) / 0.2; })
        .attr("cx", function (d) { return xScale(d.gdp); })
        .attr("cy", function (d) { return yScale(d.epc); })
        .style("fill", function (d) { return colors(d.country); })
        .on("mouseover", tooltipOn)
        .on("mouseout", tooltipOff);

// Scale Changes as we Zoom
// Call the function d3.behavior.zoom to Add zoom

    //Draw Country Names
    svg.selectAll(".text")
        .data(data)
      .enter().append("text")
        .attr("class", "text")
        .style("text-anchor", "start")
        .attr("x", function (d) {return xScale(d.gdp); })
        .attr("y", function (d) {return yScale(d.epc); })
        .style("fill", "black")
        .text(function (d) {return d.country; })
        .on("mouseover", tooltipOn)
        .on("mouseout", tooltipOff);

});

// x-axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .append("text")
    .attr("class", "label")
    .attr("y", 40)
    .attr("x", width / 2)
    .style("text-anchor", "end")
    .attr("font-size", "16px")
    .text("GDP (in Trillion US Dollars) in 2010");


// y-axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("x", -50)
    .attr("y", 3)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .attr("font-size", "16px")
    .text("Energy Consumption per Capita (in Million BTUs per person)");


 // draw legend colored rectangles
svg.append("rect")
    .attr("x", width - 250)
    .attr("y", height - 190)
    .attr("width", 220)
    .attr("height", 180)
    .attr("fill", "lightgrey")
    .style("stroke-size", "1px");

svg.append("circle")
    .attr("r", 5)
    .attr("cx", width - 100)
    .attr("cy", height - 175)
    .style("fill", "white");

svg.append("circle")
    .attr("r", 15.8)
    .attr("cx", width - 100)
    .attr("cy", height - 150)
    .style("fill", "white");

svg.append("circle")
    .attr("r", 50)
    .attr("cx", width - 100)
    .attr("cy", height - 80)
    .style("fill", "white");

svg.append("text")
    .attr("class", "label")
    .attr("x", width - 150)
    .attr("y", height - 172)
    .style("text-anchor", "end")
    .text("1 Trillion BTUs");

svg.append("text")
    .attr("class", "label")
    .attr("x", width - 150)
    .attr("y", height - 147)
    .style("text-anchor", "end")
    .text("10 Trillion BTUs");

svg.append("text")
    .attr("class", "label")
    .attr("x", width - 150)
    .attr("y", height - 77)
    .style("text-anchor", "end")
    .text("100 Trillion BTUs");

svg.append("text")
    .attr("class", "label")
    .attr("x", width - 150)
    .attr("y", height - 15)
    .style("text-anchor", "middle")
    .style("fill", "Green")
    .attr("font-size", "20px")
    .text("Total Energy Consumption");
