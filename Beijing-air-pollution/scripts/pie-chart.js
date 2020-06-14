// /*
// Author: Chuong Ho
// Course: COS30045 - Data Visualization
// Date created: 30/04/2020
// */

// var w = 300;
// var outerRadius = w / 2;
// var innerRadius = w / 2 - 50;
// var h = 300;

// function InitPieChart(dataset) 
// {   
//     // we need d3.arc(). To customize the size of the pie chart we can specify
//     // outer and inner radius of the pie. The outer radius will be specified
//     // according to the size of the SVG (using w).

//     var arc = d3.arc()
//                 .outerRadius(outerRadius)
//                 .innerRadius(innerRadius);
    
//     var pie = d3.pie();

//     // as per usual set up the SVG canvas
//     var svg = d3.select("#pie-chart")
//                 .append("svg")
//                 .attr("width", w)
//                 .attr("height", h);
    
//     // set yp our arcs
//     var arcs = svg.selectAll("g.arc")
//                     .data(pie(dataset))
//                     .enter()
//                     .append("g")
//                     .attr("class", "arc")
//                     .attr("transform", "translate("+outerRadius + ", " + outerRadius + ")");
    
//     var color = d3.scaleOrdinal(d3.schemeCategory10);

//     arcs.append("path")
//         .attr("fill", function(d,i) {
//             return colors[i];
//         })
//         .attr("d", function(d, i) {
//             return arc(d, i);
//         });

//     arcs.append("text")
//         .text(function(d) {
//             return d.value;
//         })
//         .attr("transform", function(d) {
//             return "translate(" + arc.centroid(d) + ")";
//         })
//         .attr("fill", function(d) {
//             return "white";
//         });
// }

// function DrawPieChart(dataset) 
// {   
//     // we need d3.arc(). To customize the size of the pie chart we can specify
//     // outer and inner radius of the pie. The outer radius will be specified
//     // according to the size of the SVG (using w).

//     var arc = d3.arc()
//                 .outerRadius(outerRadius)
//                 .innerRadius(innerRadius);
    
//     var pie = d3.pie();

//     // as per usual set up the SVG canvas
//     var svg = d3.select("#pie-chart svg")
//                 //.append("svg")
//                 .attr("width", w)
//                 .attr("height", h);
    
//     svg.selectAll("g.arc").remove();
//     svg.selectAll("path").remove();
//     svg.selectAll("text").remove();
    
//     // set up our arcs
//     var arcs = svg.selectAll("g.arc")
//                     .data(pie(dataset))
//                     .enter()
//                     .append("g")
//                     .attr("class", "arc")
//                     .attr("transform", "translate("+outerRadius + ", " + outerRadius + ")");
    
//     arcs.append("path")
        
//         .attr("fill", function(d,i) {
//             return colors[i];
//         })
//         .transition()
//         .attr("d", function(d, i) {
//             return arc(d, i);
//         });

//     arcs.append("text")
//         .text(function(d) {
//             return d.value <= 0 ? "" : d.value;
//         })
//         .attr("transform", function(d) {
//             return "translate(" + arc.centroid(d) + ")";
//         })
//         .attr("fill", function(d) {
//             return "white";
//         });


//     // set yp our arcs
//     // var arcs = svg.selectAll("g")
//     //                 .data(pie(dataset))
//     //                 // .enter()
//     //                 // .append("g")
//     //                 // .attr("class", "arc")
//     //                 // .attr("transform", "translate("+outerRadius + ", " + outerRadius + ")");
    
//     // //var color = d3.scaleOrdinal(d3.schemeCategory10);

//     // arcs.selectAll("path")//.data(pie(dataset))
//     //     .attr("fill", function(d,i) {
//     //         return colors[i];
//     //     })
//     //     .attr("d", function(d, i) {
//     //         return arc(d, i);
//     //     });

//     // arcs.selectAll("text")//.data(pie(dataset))
//     //     .text(function(d) {
//     //         return d.value;
//     //     })
//     //     .attr("transform", function(d) {
//     //         return "translate(" + arc.centroid(d) + ")";
//     //     })
//     //     .attr("fill", function(d) {
//     //         return "white";
//     //     });
// }

// // function InitPieChart()
// // {
// //     d3.csv("./resources/dataset/PRSA_Data_Guanyuan_20130301-20170228.csv", RowConverter).then(function(data) {
// //         var len = 365 * 24;
// //         for (var i = 0; i < data.length; i += len)
// //         {
// //             var dataset = data.slice(i, i + len);
// //             var freq = CalculateDistributionLevel(dataset);   
// //             PieChart(freq);
// //         }
// //     });  
// // }
