/*
    Line chart 
    target: linechart.html
    Author: Chuong Ho
    Course: COS30045 - Data Visualization
    Date created: 06/05/2020
*/

var x_padding = 50;
var y_padding = 20;
var w = 1000;
var h = w / 2;
var offsetUp = 40;
var bump_xScale = d3.scaleTime().range([0, w - 100]);
var bump_yScale = d3.scaleLinear().range([h - 10, 0]);
var nearest_time;
const pathDistance = 2;

var dailyData; 

var xAxis = d3.axisBottom().scale(bump_xScale).ticks(10);
var yAxis = d3.axisLeft().scale(bump_yScale).ticks(10);

// number of x, y ticks
//
// function LineChart(dataset) 
// {
//     var startTime = d3.min(dataset, function(d) {
//         return d.time;
//     });

//     var endTime = d3.max(dataset, function(d) {
//         return d.time;
//     });

//     var xScale = d3.scaleTime()
//                     .domain([
//                         startTime, endTime
//                     ])
//                     .range([0, w - x_padding]);

//     var maxAQI = d3.max(dataset, function(d) {
//         return d.aqi;
//     });

//     var yScale = d3.scaleLinear()
//                     .domain([0, maxAQI])
//                     .range([h - y_padding, 0]);
    
//     var xAxis = d3.axisBottom().scale(xScale).ticks(dataset.length / 48);
//     var yAxis = d3.axisLeft().scale(yScale).ticks(10);
    
//     var line = d3.line()
//                 .curve(d3.curveCardinal.tension(0) )
//                 .x(function(d) {
//                     return xScale(d.time) + x_padding;
//                 })
//                 .y(function(d) {
//                     return yScale(d.aqi);
//                 });

//     var svg = d3.select("#line-chart")
//                 .append("svg")
//                 .attr("width", w)
//                 .attr("height", h);
    
//     svg.append("path")
//        .datum(dataset)
//        .attr("class", "line")
//        .attr("d", line);

//     svg.append("g").attr("transform", "translate(" + x_padding +" , " + (h - y_padding) +")").call(xAxis);
//     svg.append("g").attr("transform", "translate(" + x_padding + ", 0)").call(yAxis);
// }

// function InitLineChart()
// {
//     d3.csv("./resources/dataset/mock.csv", RowConverter).then(function(data) {
//         var dataset = data.slice(0,50);
//         LineChart(dataset);
//         console.log(dataset);
//     });
// }

function drawPollutant(pollutant, bump_xScale, bump_yScale)
{
    return d3.line()
    .curve(d3.curveCardinal.tension(0) )
    .x((d) => bump_xScale(d.time))
    .y((d) => bump_yScale(SelectPollutant(d, pollutant)));
}

function AnnotateBumpChart(dataset, bump_xScale, bump_yScale)
{
    var svg = d3.select("#bump-chart svg #line-chart-region");
    var leftLabels = svg.select(".left-annotate");
    leftLabels.selectAll("text").remove();

    // annotate at the left hand side of the chart
    leftLabels.selectAll("text")
        .data(dataset[0].pollutant)
        .enter()
        .append("text")
        .attr("class", (d) => "pollutant-label " + d.pollutant)
        .transition()
        .attr("x", 0)
        .attr("y", function(d) {
            //return 0.5 * (bump_yScale(d.y0) + bump_yScale(d.y1)) - bump_yScale(dataset[0].total / 2) + h / 2;
            return bump_yScale(d.y1 - d.y0) + 5;
        })
        .text(function(d) {
            return d.pollutant;
        })
        .style("display", function(d) {
            return document.getElementById(d.pollutant + "Option").checked ? "block":"none";
        });

    var rightLabels = svg.select(".right-annotate");
    rightLabels.selectAll("text").remove();

    // annotate at the right hand side of the chart
    rightLabels.selectAll("text")
        .data(dataset[dataset.length - 1].pollutant)
        .enter()
        .append("text")
        .attr("class", (d) => "pollutant-label " + d.pollutant)
        .transition()
        .attr("x", 0)
        .attr("y", function(d) {
            var totalHeight = dataset[dataset.length - 1].total;
            //return 0.5 * (bump_yScale(d.y0) + bump_yScale(d.y1)) - bump_yScale(totalHeight / 2) + h / 2;
            return bump_yScale(d.y1 - d.y0) + 5;
        })
        .text(function(d) {
            return d.pollutant;
        })
        .style("display", function(d) {
            return document.getElementById(d.pollutant + "Option").checked ? "block":"none";
        });
}

function DrawVerticalGrid(bump_xScale)
{
    return d3.axisBottom(bump_xScale)
    .ticks(15);
}

function DrawHorizontalGrid(bump_yScale)
{
    return d3.axisLeft(bump_yScale)
    .ticks(10);
}

function DrawCirclePoint(d)
{    
    let timePosition = bump_xScale(d.time);
    
    d3.select("#line-chart-region")
    .selectAll("circle.aidPoint").remove();

    d3.select("#line-chart-region")
    .selectAll("circle.aidPoint")
    .data(d.pollutant)
    .enter().append("circle")
    .attr("class", function(d) {
        return "aidPoint " + d.pollutant;
    })
    .attr("r", 5)
    .attr("cx", function(d) { return timePosition; })
    .attr("cy", function(d) { 
        return bump_yScale(d.y1 - d.y0); })
    .attr("fill", function(d) { return pollutantColorCode[d.pollutant]})
    .style("display", function(d) {
        return document.getElementById(d.pollutant + "Option").checked ? "block":"none";
    })
}


function DrawBumpChart(dataset)
{
    dailyData = dataset;
    var x_padding = 50;
    var y_padding = 20;

    var startTime = d3.min(dataset, function(d) {
        return d.time;
    });

    var endTime = d3.max(dataset, function(d) {
        return d.time;
    });
    

    var color = d3.scaleOrdinal()
    .range(["#98abc5", 
            "#8a89a6", 
            "#7b6888", 
            "#6b486b", 
            "#a05d56", 
            "purple",
            "#d0743c",
            ]);
    color.domain(d3.keys(dataset[0]).filter(function(key) {
    return key === "PM2_5"
        || key === "PM10"
        || key === "SO2"
        || key === "NO2"
        || key === "CO"
        || key === "O3"
        || key === "aqi";
    }));
    dataset.forEach(function(d) {
        var y0 = 0;
        var order = color.domain().map(function(d) {
        return d;
        }).sort(function(a, b) {
            //return (document.getElementById("doSort").value == "sort") ? +d[a] - +d[b] : 1;
            return +d[a] - +d[b];
        })

        d.pollutant = order.map(function(pollution) {
            return {
                pollutant: pollution,
                y0: y0 += pathDistance,
                y1: y0 += +d[pollution]
            }
        });
            d.total = d.pollutant[d.pollutant.length - 1].y1;
            d.max = d.pollutant[d.pollutant.length - 1].y1 - d.pollutant[d.pollutant.length - 1].y0;
        });
        
    bump_xScale.domain([startTime, endTime]);

    var maxY = d3.max(dataset, function(d) {
        return d.max;
    });
    bump_yScale.domain([0, maxY + offsetUp]);

    // svg.append("g")
    // .attr("class", ".xAxis")
    // .attr("transform", "translate(0," + (h - 20) + ")")
    // .call(xAxis);

    // svg.append("g")			
    // .attr("class", "grid vertical")
    // .attr("transform", "translate(0," + h + ")")
    // .call(DrawVerticalGrid(bump_xScale)
    //     .tickSize(-h)
    //     .tickFormat("")
    // )

    d3.select("#line-chart-region .yAxis")
    .transition()   
    .call(yAxis);

    d3.select("#line-chart-region .grid.horizontal")
    .transition()
    .call(DrawHorizontalGrid(bump_yScale)
        .tickSize(-(w - 100))
        .tickFormat("")
    )

    BumpChart(dataset, bump_xScale, bump_yScale);
    AnnotateBumpChart(dataset, bump_xScale, bump_yScale);
    document.getElementById("aqi-title").innerText = "Air quality in " + $("#station").val() + " on " + $("#dateOption").val();

}

// function DrawInteractive(record, bump_xScale, bump_yScale)
// {
//     var interactive = d3.select("#bump-interactive");
//     interactive.selectAll("text").remove();
//     interactive.selectAll("text")
//                 .data(record.pollutant)
//                 .enter()
//                 .append("text")
//                 .attr("class", (d) => "pollutant-label " + d.pollutant)
//                 //.transition()
//                 .attr("x", 0)
//                 .attr("y", function(d) {
//                     return 0.5 * (bump_yScale(d.y0) + bump_yScale(d.y1)) - bump_yScale(record.total / 2) + h / 2;
//                 })
//                 .text(function(d) {
//                     return d.pollutant + ": " + (d.y1 - d.y0);
//                 });
//     interactive.append("text")
//                 .attr("x", 0)
//                 .attr("y", 20)
//                 .text(record.time);                
// }

function DrawToolTip(d, bump_xScale, bump_yScale)
{
    document.getElementById("bump-interactive").innerHTML="";
    var interactive = d3.select("#bump-interactive");
    
    $("#bump-interactive").append(
        "<h3>" + displayTime(d.time, true) + "</h3><br/>"
    )
    $("#bump-interactive").append(
        + "<table class='index' style='border: none'>"  
        + "<tr>"
        +  "<td>Overall AQI</td>"
        +  "<td>" + parseInt(d.aqi) + "</td>"
        + "</tr>"
        + "<tr>"
        +  "<td>PM2.5</td>"
        +  "<td>" + parseInt(d.PM2_5) + "</td>"
        + "</tr>"
        + "<tr>"
        +  "<td>PM10</td>"
        +  "<td>" + parseInt(d.PM10) + "</td>"
        + "</tr>"
        + "<tr>"
        +  "<td>CO</td>"
        +  "<td>" + parseInt(d.CO) + "</td>"
        + "</tr>"
        + "<tr>"
        +  "<td>NO<sub>2</sub></td>"
        +  "<td>" +parseInt(d.NO2) + "</td>"
        + "</tr>"
        + "<tr>"
        +  "<td>SO<sub>2</sub></td>"
        +  "<td>" + parseInt(d.SO2) + "</td>"
        + "</tr>"
        + "<tr>"
        +  "<td>O<sub>3</sub></td>"
        +  "<td>" + parseInt(d.O3) + "</td>"
        + "</tr>"
        + "<tr>"
        + "<tr>"
        +  "<td></td>"
        +  "<td></td>"
        + "</tr>"
        + "<tr>"
        +  "<td>Temperature</td>"
        +  "<td>" + Number(parseFloat(d.temp)).toFixed(1) + "&#176;C </td>"
        + "</tr>"
        + "<tr>"
        + "<tr>"
        +  "<td>Precipitation</td>"
        +  "<td>" + Number(parseFloat(d.rain)).toFixed(1) + " mm</td>"
        + "</tr>"
        + "<tr>"
        +  "<td>Dew point</td>"
        +  "<td>" + Number(parseFloat(d.dew)).toFixed(1) + "&#176;C </td>"
        + "</tr>"
      + "</table>"
    )
}


function BumpChart(dataset, bump_xScale, bump_yScale)
{    
    // var xAxis = d3.axisBottom().scale(bump_xScale).ticks(dataset.length / 48);
    // var yAxis = d3.axisLeft().scale(bump_yScale).ticks(10);

    //console.log(dataset[0].pollutant);

    // var svg = d3.select("#bump-chart")
    //             .append("svg")
    //             .attr("width", w)
    //             .attr("height", h);

    var svg = d3.select("#bump-chart svg #line-chart-region");
    for (let name in pollutantColorCode)
    {
        if (pollutantColorCode.hasOwnProperty(name))
        {
            let id = "#" + name + "-line";
            let color = pollutantColorCode[name];
            svg.select(id)
            .datum(dataset)
            .transition(d3.easeCircleIn)
            .duration(800)
            .attr("d", drawPollutant(name, bump_xScale, bump_yScale))
            .style("display", document.getElementById(name + "Option").checked ? "block":"none");
        }
    }
}

function InitBumpChart(dataset)
{
    var x_padding = 50;
    var y_padding = 20;
    var startTime = d3.min(dataset, function(d) {
        return d.time;
    });

    var endTime = d3.max(dataset, function(d) {
        return d.time;
    });
    
    // var bump_xScale = d3.scaleTime().domain([
    //     startTime, endTime
    // ]).range([0, w - 50]);

    bump_xScale.domain([startTime, endTime])

    var color = d3.scaleOrdinal()
                .range(["#98abc5", 
                        "#8a89a6", 
                        "#7b6888", 
                        "#6b486b", 
                        "#a05d56", 
                        "purple",
                        "#d0743c"
                        ]);
    color.domain(d3.keys(dataset[0]).filter(function(key) {
        return key === "PM2_5"
            || key === "PM10"
            || key === "SO2"
            || key === "NO2"
            || key === "O3"
            || key === "aqi";
    }));
    dataset.forEach(function(d) {
        var y0 = 0;
        var order = color.domain().map(function(d) {
            return d;
        })
        .sort(function(a, b) {
            //return (document.getElementById("doSort").value == "sort") ? +d[a] - +d[b] : 1;
            return +d[a] - +d[b];
        })

        d.pollutant = order.map(function(pollution) {
            return {
                pollutant: pollution,
                y0: y0 += pathDistance,
                y1: y0 += +d[pollution]
            }
        });
        d.total = d.pollutant[d.pollutant.length - 1].y1;
        d.max = d.pollutant[d.pollutant.length - 1].y1 - d.pollutant[d.pollutant.length - 1].y0;
    });

    var maxY = d3.max(dataset, function(d) {
        return d.max;
    });
    // var bump_yScale = d3.scaleLinear()
    //                 .domain([0, maxY + offsetUp])
    //                 .range([h - 10, 0]);
    bump_yScale.domain([0, maxY + offsetUp]);    

    var svg = d3.select("#bump-chart")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
    
    svg = svg.append("g")
            .attr("id", "line-chart-region")
            .attr("transform", "translate(50, 0)");

    svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (h - 20) + ")")
    .call(xAxis);

    svg.append("g")			
    .attr("class", "grid vertical")
    .attr("transform", "translate(0," + (h - 10) + ")")
    .call(DrawVerticalGrid(bump_xScale)
        .tickSize(-h)
        .tickFormat("")
    )

    svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", "translate(0,0)")
    .call(yAxis);

    svg.append("g")			
    .attr("class", "grid horizontal")
    .attr("transform", "translate(0,0)")
    .call(DrawHorizontalGrid(bump_yScale)
        .tickSize(-(w-100))
        .tickFormat("")
    )

    
    for (let name in pollutantColorCode)
    {
        let id = name + "-line";
        let color = pollutantColorCode[name];
        svg.append("path")
        .datum(dataset)
        .attr("id", id)
        .attr("class", name)
        .attr("d", drawPollutant(name, bump_xScale, bump_yScale))
        .attr("stroke", color)
        .style("opacity", 1)
        .style("display", document.getElementById(name+ "Option").checked ? "block":"none");
    }

    for (let name in pollutantColorCode)
    {  
        svg.selectAll("path")
        .datum(dataset)
        .on("mouseover", function(d) {
            for (let otherName in pollutantColorCode)
            {
                let otherId = otherName + "-line";
                if (otherId != this.id) {
                    //d3.selectAll("#" + otherId).attr("fill", "#DCDCDC");
                    d3.selectAll("." + otherName).style("opacity", 0.1  );
                }
                else {
                    d3.select(this).attr("stroke", pollutantColorCode[otherName]).transition();
                    d3.selectAll("." + otherName).style("opacity", 1);
                }
            }
        })    
    }

    svg.on("mouseout", function() {
        for (let name in pollutantColorCode) {
            let id = name + "-line";
            let color = pollutantColorCode[name];
            d3.selectAll("#" + id).attr("stroke", color);//
            d3.selectAll("." + name).style("opacity", 1);
        }
    });

    svg.append("g")
    .attr("class", "left-annotate")
    .attr("transform", function(d) {
        return "translate(5, 0)";
    });

    svg.append("g")
    .attr("class", "right-annotate")
    .attr("transform", function(d) {
        return "translate(" + (w - 100) + ", 0)";
    });
    AnnotateBumpChart(dataset, bump_xScale, bump_yScale);

    // var interactive = d3.select("#bump-chart").append("svg")
    //                     .attr("id", "bump-interactive")
    //                     .attr("class", ".bump.interactive")
    //                     .attr("width", h)
    //                     .attr("height", h);


    var bisectDate = d3.bisector(function(d) {return d.time}).left;

    dailyData = dataset;

    svg.on("mousemove", function(d) {
        //console.log(d3.mouse(this)[0]);
        var mouse_x = d3.mouse(this)[0];
        var mouse_time = bump_xScale.invert(mouse_x);
        var i = Math.min(bisectDate(dailyData, mouse_time, 1), dailyData.length - 1);
        i = Math.max(i, 0);

        var time_left = dailyData[i - 1];
        var time_right = dailyData[i];

        if (mouse_time - time_left.time < time_right.time - mouse_time)
        {
            nearest_time = time_left;
        }
        else 
        {
            nearest_time = time_right;
        }
        console.log(nearest_time);
        DrawToolTip(nearest_time, bump_xScale, bump_yScale);
        DrawCirclePoint(nearest_time);
    })
    
    var description = document.createElement("h3");
    description.setAttribute("id", "aqi-title")
    description.innerText = "Air quality in " + $("#station").val() + " on " + $("#dateOption").val();
    document.getElementById("bump-chart").appendChild(description);
}

// window.onload = Init; 