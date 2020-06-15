/*
    Temperature chart 
    target: dashboard.html
    Author: Chuong Ho
    Course: COS30045 - Data Visualization
    Date created: 06/05/2020
*/

var x_padding = 50;
var y_padding = 20;
var w_temp = 1000;
var h_temp = 300;
var offsetTemp = 5;
var temp_xScale = d3.scaleTime().range([0, w_temp - 100]);
var temp_yScale = d3.scaleLinear().range([h_temp - 10, 0]);

var dailyTemp; 

var temp_xAxis = d3.axisBottom().scale(temp_xScale).ticks(10);
var temp_yAxis = d3.axisLeft().scale(temp_yScale).ticks(10);


function drawTemperature(temp_xScale, temp_yScale)
{
    return d3.line()
    .curve(d3.curveCardinal.tension(0) )
    .x((d) => temp_xScale(d.time))
    .y((d) => temp_yScale(d.temp));
}

function drawDew(temp_xScale, temp_yScale)
{
    return d3.line()
    .curve(d3.curveCardinal.tension(0) )
    .x((d) => temp_xScale(d.time))
    .y((d) => temp_yScale(d.dew));
}

function DrawCirclePointTemp(d)
{
    let timePosition = temp_xScale(d.time);

    d3.select("#temp-chart-region")
    .selectAll("circle.aidPoint").remove();

    d3.select("#temp-chart-region")
    .selectAll("circle.aidPoint")
    .data(d.pollutant)
    .enter().append("circle")
    .attr("class", function(d) {
        return "aidPoint " + d.pollutant;
    })
    .attr("r", 5)
    .attr("cx", function(d) { return timePosition; })
    .attr("cy", function(d) { return temp_yScale(d.y1 - d.y0); })
    .attr("fill", function(d) { return pollutantColorCode[d.pollutant]})
    .style("display", function(d) {
        return document.getElementById(d.pollutant + "Option").checked ? "block":"none";
    })
}


function DrawTempChart(dataset)
{
    dailyTemp = dataset;
    var x_padding = 50;
    var y_padding = 20;

    console.log(dataset);
    var startTime = d3.min(dataset, function(d) {
        return d.time;
    });

    var endTime = d3.max(dataset, function(d) {
        return d.time;
    });
    
        
    temp_xScale.domain([startTime, endTime]);

    var maxY = d3.max(dataset, function(d) {
        return Math.max(d.temp, d.dew);
    });
    var minY = d3.min(dataset, function(d) {
        return Math.min(d.temp, d.dew);
    });

    temp_yScale.domain([minY - offsetTemp, maxY + offsetTemp]);

    d3.select("#temp-line")
        .datum(dataset)
        .attr("d", drawTemperature(temp_xScale, temp_yScale));

    d3.select("#dew-line")
    .datum(dataset)
    .attr("d", drawDew(temp_xScale, temp_yScale));
    d3.select(".temp_yAxis")
    .transition()   
    .call(temp_yAxis);

    document.getElementById("temp-title").innerText = "Daily temperature in " + $("#station").val() + " on " + $("#dateOption").val();

}

function InitTempChart(dataset)
{
    var x_padding = 50;
    var y_padding = 20;
    var startTime = d3.min(dataset, function(d) {
        return d.time;
    });

    var endTime = d3.max(dataset, function(d) {
        return d.time;
    });
    
    temp_xScale.domain([startTime, endTime])


    var maxY = d3.max(dataset, function(d) {
        return Math.max(d.temp, d.dew);
    });
    var minY = d3.min(dataset, function(d) {
        return Math.min(d.temp, d.dew);
    });

    temp_yScale.domain([minY - offsetTemp, maxY + offsetTemp]);    

    var svg = d3.select("#temp-chart")
                .append("svg")
                .attr("width", w_temp)
                .attr("height", h_temp)
    
    svg = svg.append("g")
            .attr("id", "temp-chart-region")
            .attr("transform", "translate(50, 0)");

    svg.append("g")
    .attr("class", "temp_xAxis")
    .attr("transform", "translate(0," + (h_temp - 20) + ")")
    .call(temp_xAxis);

    svg.append("g")			
    .attr("class", "grid vertical")
    .attr("transform", "translate(0," + (h_temp - 10) + ")")
    .call(DrawVerticalGrid(temp_xScale)
        .tickSize(-h_temp)
        .tickFormat("")
    )

    svg.append("g")
    .attr("class", "temp_yAxis")
    .attr("transform", "translate(0,0)")
    .call(temp_yAxis);

    svg.append("g")			
    .attr("class", "grid horizontal")
    .attr("transform", "translate(0,0)")
    .call(DrawHorizontalGrid(temp_yScale)
        .tickSize(-(w_temp-100))
        .tickFormat("")
    )

    svg.append("path")
    .datum(dataset)
    .attr("id", "temp-line")
    .attr("d", drawTemperature(temp_xScale, temp_yScale))
    .attr("stroke", "red")
    .style("opacity", 0.8)

    svg.append("path")
    .datum(dataset)
    .attr("id", "dew-line")
    .attr("d", drawDew(temp_xScale, temp_yScale))
    .attr("stroke", "blue")
    .style("opacity", 0.8)


    var description = document.createElement("h3");
    description.setAttribute("id", "temp-title")
    description.innerText = "Daily temperature in " + $("#station").val() + " on " + $("#dateOption").val();
    document.getElementById("temp-chart").appendChild(description);
}