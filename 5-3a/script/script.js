/*
D3 Transitions
target: L5-2.html
Author: Chuong Ho
Course: COS30045 - Data Visualization
Date created: 30/03/2020
*/

var maxValue = 20;
var dataset = [1,2];
var data_len = 30;
var w = 500;
var h = 500;

var xScale = d3.scaleBand().domain(d3.range(dataset.length)).rangeRound([0, w]).paddingInner(0.05);
var yScale= d3.scaleBand().domain(d3.range(maxValue + 1)).rangeRound([0, h]);
    
function add()
{
    var newNumber = Math.floor(Math.random() * maxValue);
    dataset.push(newNumber);
    
    var xScale = d3.scaleBand().domain(d3.range(dataset.length)).rangeRound([0, w]).paddingInner(0.05);
    var yScale= d3.scaleBand().domain(d3.range(maxValue + 1)).rangeRound([0, h]);
    
    
    var svg = d3.select("svg");
    // bars  
    var bars = svg.selectAll("rect").data(dataset);

    bars.enter()
    .append("rect")
    .attr("x", function(d, i) {
        return xScale(i);
    })
    .attr("y", (d) => (h))
    .merge(bars)
    .transition(d3.easeSin)
    .duration(500)
    .attr("x", function(d, i) {
        return xScale(i);
    })
    .attr("y", (d) => (h - yScale(d)))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => yScale(d)) ;

    document.getElementById("data").innerHTML = dataset;
}

function remove()
{
    dataset.shift();

    var xScale = d3.scaleBand().domain(d3.range(dataset.length)).rangeRound([0, w]).paddingInner(0.05);
    var yScale= d3.scaleBand().domain(d3.range(maxValue + 1)).rangeRound([0, h]);
    
    var svg = d3.select("svg");
    // bars  
    var bars = svg.selectAll("rect").data(dataset);

    bars.exit()
    .transition()
    .duration(500)
    .attr("x", w)
    .remove();
    bars.transition()
    .duration(500).attr("x", function(d, i) {
        return xScale(i);
    })
    .attr("y", (d) => (h - yScale(d)))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => yScale(d));
        
    

    document.getElementById("data").innerHTML = dataset;
}

function init()
{
    var xScale = d3.scaleBand().domain(d3.range(dataset.length)).rangeRound([0, w]).paddingInner(0.05);
    var yScale= d3.scaleBand().domain(d3.range(maxValue + 1)).rangeRound([0, h]);
    
    d3.select("#addButton").on("click", () => add());
    // 
    d3.select("#removeButton").on("click", () => remove());
    var svg = d3.select("#chart").append("svg").attr("width", w).attr("height", h);
    
    svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d, index) {
        return xScale(index);
    })
    .attr("y", function(d) {
        return h - yScale(d);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) {
        return yScale(d);
    }); 
}

window.onload = init;