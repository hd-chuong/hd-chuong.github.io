// // still use aqi, change soon
// function DrawBarChart(dataset, pollutant)
// {
//     var w = 1000;
//     var h = 500;
//     var x_padding = 50;
//     var y_padding = 20;
//     var startTime = d3.min(dataset, function(d) {
//         return d.time;
//     });

//     var endTime = d3.max(dataset, function(d) {
//         return d.time;
//     });
    
//     var xScale = d3.scaleTime().domain([
//         startTime, endTime
//     ]).range([0, w - 50]);

//     var maxY = d3.max(dataset, function(d) {
//         return SelectPollutant(d, pollutant);
//     });
    
//     var yScale = d3.scaleLinear()
//                     .domain([0, maxY])
//                     .range([0, h]);
    

//     var xAxis = d3.axisBottom().scale(xScale).ticks(dataset.length / 48);
//     var yAxis = d3.axisLeft().scale(yScale).ticks(10);

//     var svg = d3.select("#bar-chart svg");//.attr("width", w).attr("height", h);

//     // levels.forEach(function(level) {
//     //     svg.append("line")
//     //     .attr("class", "baseline")
//     //     .attr("x1", 0)
//     //     .attr("y1", h - yScale(level))
//     //     .attr("x2", w)
//     //     .attr("y2", h - yScale(level));
//     // });
    
//     svg.selectAll("rect")
//         .data(dataset)
//         .transition(d3.easeCircleIn)
//         .duration(800)
//         .delay(function(d, i) {
//             return i / dataset.length * 300; 
//         })
//         .attr("x", function(d) {
//             return xScale(d.time);
//         })
//         .attr("y", function(d) {
//             return h - yScale(SelectPollutant(d, pollutant));
//         })
//         .attr("width", w / dataset.length)
//         .attr("height", function(d) {
//             return yScale(SelectPollutant(d, pollutant));
//         })
//         .attr("fill", function(d) {
//             for (let i = 0; i < levels.length; ++i)
//             {
//                 var limit = levels[i];
//                 if (SelectPollutant(d, pollutant) <= limit) return colors[i];
                
//             }
//             return colors[colors.length - 1];
//         });
// }

// function InitBarChart(dataset, pollutant)
// {
//     var w = 1000;
//     var h = 500;
//     var x_padding = 50;
//     var y_padding = 20;
//     var startTime = d3.min(dataset, function(d) {
//         return d.time;
//     });

//     var endTime = d3.max(dataset, function(d) {
//         return d.time;
//     });
    
//     var xScale = d3.scaleTime().domain([
//         startTime, endTime
//     ]).range([0, w - 50]);

//     var maxY = d3.max(dataset, function(d) {
//         return SelectPollutant(d, pollutant);
//     });
    
//     var yScale = d3.scaleLinear()
//                     .domain([0, maxY])
//                     .range([0, h]);
    

//     var xAxis = d3.axisBottom().scale(xScale).ticks(dataset.length / 48);
//     var yAxis = d3.axisLeft().scale(yScale).ticks(10);

//     var svg = d3.select("#bar-chart").append("svg").attr("width", w).attr("height", h);

//     // levels.forEach(function(level) {
//     //     svg.append("line")
//     //     .attr("class", "baseline")
//     //     .attr("x1", 0)
//     //     .attr("y1", h - yScale(level))
//     //     .attr("x2", w)
//     //     .attr("y2", h - yScale(level));
//     // });
    
//     svg.selectAll("rect")
//         .data(dataset)
//         .enter()
//         .append("rect")
//         .attr("x", function(d) {
//             return xScale(d.time);
//         })
//         .attr("y", function(d) {
//             return h - yScale(SelectPollutant(d, pollutant));
//         })
//         .transition()
//         .attr("width", w / dataset.length)
//         .attr("height", function(d) {
//             return yScale(SelectPollutant(d, pollutant));
//         })
//         .attr("fill", function(d) {
//             for (let i = 0; i < levels.length; ++i)
//             {
//                 var limit = levels[i];
//                 if (SelectPollutant(d, pollutant) <= limit) return colors[i];
//             }
//             return colors[colors.length - 1];
//         });

// }

// // window.onload = Init; 