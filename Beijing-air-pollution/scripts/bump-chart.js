var w = 1000;
var h = 300;
var bump_xScale = d3.scaleTime().range([0, w - 50]);
var bump_yScale = d3.scaleLinear().range([h - 10, 0]);
var nearest_time;
const pathDistance = 2;
 
function drawPollutant(pollutant, bump_xScale, bump_yScale)
{
    return d3.area()
    .curve(d3.curveCardinal.tension(0) )
    .x((d) => bump_xScale(d.time))
    .y0(function(d) {
        for (let i = 0; i < d.pollutant.length; ++i)
        {
            if (d.pollutant[i].pollutant === pollutant)
            {
                return bump_yScale(d.pollutant[i].y0) - bump_yScale(d.total / 2) + h / 2;
            }
        }
        return 0;
    })
    .y1(function(d) {
        for (let i = 0; i < d.pollutant.length; ++i)
        {
            if (d.pollutant[i].pollutant === pollutant)
            {
                return bump_yScale(d.pollutant[i].y1) - bump_yScale(d.total / 2) + h / 2;
            }
        }
        return 0;
    });
}

function AnnotateBumpChart(dataset, bump_xScale, bump_yScale)
{
    var svg = d3.select("#bump-chart svg");
    console.log(dataset[0])
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
            return 0.5 * (bump_yScale(d.y0) + bump_yScale(d.y1)) - bump_yScale(dataset[0].total / 2) + h / 2;
        })
        .text(function(d) {
            return d.pollutant;
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
            return 0.5 * (bump_yScale(d.y0) + bump_yScale(d.y1)) - bump_yScale(totalHeight / 2) + h / 2;
        })
        .text(function(d) {
            return d.pollutant;
        });
}

function drawGrid(bump_xScale)
{
    return d3.axisBottom(bump_xScale)
    .ticks(24);
}


function DrawBumpChart(dataset)
{
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
            "#d0743c"]);
    color.domain(d3.keys(dataset[0]).filter(function(key) {
    return key === "PM2_5"
        || key === "PM10"
        || key === "SO2"
        || key === "NO2"
        || key === "CO"
        || key === "O3";
    }));
    dataset.forEach(function(d) {
        var y0 = 0;
        var order = color.domain().map(function(d) {
        return d;
        }).sort(function(a, b) {
            return (document.getElementById("doSort").value == "sort") ? +d[a] - +d[b] : 1;
            //return 1;
        })

        d.pollutant = order.map(function(pollution) {
            return {
                pollutant: pollution,
                y0: y0 += pathDistance,
                y1: y0 += +d[pollution]
            }
        });
            d.total = d.pollutant[d.pollutant.length - 1].y1;
        });
        
    // var bump_xScale = d3.scaleTime().domain([
    //     startTime, endTime
    // ]).range([0, w - 50]);
    bump_xScale.domain([startTime, endTime]);

    var maxY = d3.max(dataset, function(d) {
        return d.total;
    });
    // var bump_yScale = d3.scaleLinear()
    //                 .domain([0, maxY + 1])
    //                 .range([h - 10, 0]);

    bump_yScale.domain([0, maxY + 1]);

    BumpChart(dataset, bump_xScale, bump_yScale);
    AnnotateBumpChart(dataset, bump_xScale, bump_yScale);
}

function DrawInteractive(record, bump_xScale, bump_yScale)
{
    //console.log(record);
    var interactive = d3.select("#bump-chart #bump-interactive");
    interactive.selectAll("text").remove();
    interactive.selectAll("text")
                .data(record.pollutant)
                .enter()
                .append("text")
                .attr("class", (d) => "pollutant-label " + d.pollutant)
                //.transition()
                .attr("x", 0)
                .attr("y", function(d) {
                    return 0.5 * (bump_yScale(d.y0) + bump_yScale(d.y1)) - bump_yScale(record.total / 2) + h / 2;
                })
                .text(function(d) {
                    return d.pollutant + ": " + (d.y1 - d.y0);
                });
    interactive.append("text")
                .attr("x", 0)
                .attr("y", 20)
                .text(record.time);                
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

    var svg = d3.select("#bump-chart svg");
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
            .attr("d", drawPollutant(name, bump_xScale, bump_yScale));
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
                        "#d0743c"]);
    color.domain(d3.keys(dataset[0]).filter(function(key) {
        return key === "PM2_5"
            || key === "PM10"
            || key === "SO2"
            || key === "NO2"
            || key === "CO"
            || key === "O3";
    }));
    dataset.forEach(function(d) {
        var y0 = 0;
        var order = color.domain().map(function(d) {
            return d;
        }).sort(function(a, b) {
            return (document.getElementById("doSort").value == "sort") ? +d[a] - +d[b] : 1;
        })

        d.pollutant = order.map(function(pollution) {
            return {
                pollutant: pollution,
                y0: y0 += pathDistance,
                y1: y0 += +d[pollution]
            }
        });
        d.total = d.pollutant[d.pollutant.length - 1].y1;
    });

    var maxY = d3.max(dataset, function(d) {
        return d.total;
    });
    // var bump_yScale = d3.scaleLinear()
    //                 .domain([0, maxY + 1])
    //                 .range([h - 10, 0]);
    bump_yScale.domain([0, maxY + 1]);    

    var xAxis = d3.axisBottom().scale(bump_xScale).ticks(10);
    //var yAxis = d3.axisLeft().scale(bump_yScale).ticks(10);

    var svg = d3.select("#bump-chart")
                .append("svg")
                .attr("width", w)
                .attr("height", h)

    svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (h - 20) + ")")
    .call(xAxis);

    svg.append("g")			
    .attr("class", "grid")
    .attr("transform", "translate(0," + h + ")")
    .call(drawGrid(bump_xScale)
        .tickSize(-h)
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
        .attr("fill", color)
        .style("opacity", 0.8)
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
                    d3.selectAll("#" + otherId).attr("fill", "#DCDCDC");
                    d3.selectAll("." + otherName).style("opacity", 0.3);
                }
                else {
                    d3.select(this).attr("fill", pollutantColorCode[otherName]).transition();
                    d3.selectAll("." + otherName).style("opacity", 0.8);
                }
            }

            
        })    
    }

    svg.on("mouseout", function() {
        for (let name in pollutantColorCode) {
            let id = name + "-line";
            let color = pollutantColorCode[name];
            d3.selectAll("#" + id).attr("fill", color);//
            d3.selectAll("." + name).style("opacity", 0.8);
        }
    });

    svg.append("g")
    .attr("class", "left-annotate")
    .attr("transform", function(d) {
        return "translate(10, 0)";
    });

    svg.append("g")
    .attr("class", "right-annotate")
    .attr("transform", function(d) {
        return "translate(" + (w - 100) + ", 0)";
    });
    AnnotateBumpChart(dataset, bump_xScale, bump_yScale);

    var interactive = d3.select("#bump-chart").append("svg")
                        .attr("id", "bump-interactive")
                        .attr("class", ".bump.interactive")
                        .attr("width", h)
                        .attr("height", h);


    var bisectDate = d3.bisector(function(d) {return d.time}).left;

    svg.on("mousemove", function(d) {
        //console.log(d3.mouse(this)[0]);
        var mouse_x = d3.mouse(this)[0];
        var mouse_time = bump_xScale.invert(mouse_x);
        var i = bisectDate(dataset, mouse_time, 1);
        var time_left = dataset[i - 1];
        var time_right = dataset[i];

        if (mouse_time - time_left < time_right - mouse_time)
        {
            nearest_time = time_left;
        }
        else 
        {
            nearest_time = time_right;
        }
        //console.log(nearest_time)
        DrawInteractive(nearest_time, bump_xScale, bump_yScale);
    })

    //Interactive number
    //remember to include all data (pollutant sorted)

    
    // var times = svg.selectAll(".time")
    //                 .data(dataset)
    //                 .enter()
    //                 .append("g")
    //                 .attr("class", "g")
    //                 .attr("transform", function(d) {
    //                     return "translate(" + bump_xScale(d.time) + ", 0)";
    //                 });
    
    // times.selectAll("rect")
    //     .data(function(d) {
    //         return d.pollutant;
    //     })
    //     .enter().append("rect")
    //     .attr("width", w / dataset.length)
    //     .attr("y", function(d) {
    //         return bump_yScale(d.y1);
    //     })
    //     .attr("height", function(d) {
    //         return bump_yScale(d.y0) - bump_yScale(d.y1);
    //     })
    //     .attr("fill", (d) => color(d.pollutant));
    
    // levels.forEach(function(level) {
    //     svg.append("line")
    //     .attr("class", "baseline")
    //     .attr("x1", 0)
    //     .attr("y1", h - bump_yScale(level))
    //     .attr("x2", w)
    //     .attr("y2", h - bump_yScale(level));
    // });
    
    // svg.selectAll("rect")
    //     .data(dataset)
    //     .enter()
    //     .append("rect")
    //     .attr("x", function(d) {
    //         return bump_xScale(d.time);
    //     })
    //     .attr("y", function(d) {
    //         return h - bump_yScale(SelectPollutant(d, pollutant));
    //     })
    //     .transition()
    //     .attr("width", w / dataset.length)
    //     .attr("height", function(d) {
    //         return bump_yScale(SelectPollutant(d, pollutant));
    //     })
    //     .attr("fill", function(d) {
    //         for (let i = 0; i < levels.length; ++i)
    //         {
    //             var limit = levels[i];
    //             if (SelectPollutant(d, pollutant) <= limit) return colors[i];
    //         }
    //         return colors[colors.length - 1];
    //     });
    

}

// window.onload = Init; 