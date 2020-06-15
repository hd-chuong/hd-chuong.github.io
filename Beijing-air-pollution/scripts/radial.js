//
// create 15/05/2020
// inherit layout from https://bl.ocks.org/tlfrd/fd6991b2d1947a3cb9e0bd20053899d6
// target overview.html

var margin = {top: 0, right: 0, bottom: 0, left: 0};
var width = 1000 - margin.left - margin.right;
var height = 1000 - margin.top - margin.bottom;

var innerRadius = 100;
var outerRadius = 250;
var innerRadiusTemp = 280;
var outerRadiusTemp = 370;

var border = outerRadiusTemp - 100;

var x = d3.scaleTime().range([0.015 * Math.PI, 1.985 * Math.PI]);

var y = d3.scaleLinear()
    .range([innerRadius, outerRadius]);

var yTemp = d3.scaleLinear()
.range([innerRadiusTemp, outerRadiusTemp]);

var rainScale = d3.scaleSqrt().range([0, 25]);

var line = d3.lineRadial()
                .curve(d3.curveCardinal.tension(0) )
                .angle(function(d) { return x(d.time); })
                .radius(function(d) {                
                    return yTemp(d.temp); 
                });

var dewline = d3.lineRadial()
    .curve(d3.curveCardinal.tension(0) )
    .angle(function(d) { return x(d.time); })
    .radius(function(d) {                
        return yTemp(d.dew); 
});

var area = d3.areaRadial()
            .curve(d3.curveCardinal.tension(0))
            .angle(d => x(d.time))
            .innerRadius(d => yTemp(d.minTemp))
            .outerRadius(d => yTemp(d.maxTemp))

var year = parseInt(document.getElementById("year").value);
var station = document.getElementById("station").value;
var pollutant = document.getElementById("pollutant").value;
var backup_data;
var k = 1;

function DrawPollutionLegend()
{
    var legend = d3
    .select("#aqi-legend-section")
    .append("svg")
    .attr("id", "legend")
    legend.selectAll("g").remove();
    var pollutionScale = legend.append("g")
                        .attr("id", "pollutionScale");

    var y0 = 5;
    pollutionScale
    .selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("y", 20)
    .attr("x", function(d, i) {
    let y = y0;
    y0 += colorLength[i];
    return y;
    })
    .attr("height", 10)
    .attr("width", function(d, i) {
    return colorLength[i];
    })
    .attr("fill", function(d,i) {
    return d;
    })


    y0 = 0;
    pollutionScale
    .selectAll("text")
    .data(rankings)
    .enter()
    .append("text")
    .attr("writing-mode", "vertical-rl")
    .attr("y", 40)
    .attr("x", function(d, i) {
    let y = y0 + colorLength[i] / 2;
    y0 += colorLength[i];
    return y;
    })
    .text((d) => d)
    .attr("font-size", "px")

    y0 = 0;
    pollutionScale
    .selectAll(".indicator")
    .data(indicator)
    .enter()
    .append("text")
    .attr("y", 15)
    .attr("x", function(d, i) {
        let y = y0;
        y0 += colorLength[i];
        return y;
    })
    .text(function(d, i) {
    return indicator[i];
    })   
    .attr("font-size", "12px");
}

function DrawRainLegend()
{
    var legend = d3
    .select("#legend-section")
    .append("svg")
    .attr("id", "rain-legend");

    legend.append("h5")
    .text("Precipitation")
    var rainLegend = legend.append("g")
    .attr("id", "rainScale")

    var x0 = -5;
    rainLegend.selectAll("circle")
    .data(rainScale.ticks(5))
    .enter()
    .append("circle")
    .attr("transform", function(d, i) {
        let x = x0;
        x0 += 2 * rainScale(d) + 20;
        return "translate(" + (x0) + ", 30)" ;
    })
    .attr("r", (d) => rainScale(d))
    .attr("fill",  "#4099ff");

    var x0 = -25;
    rainLegend
    .selectAll("text")
    .data(rainScale.ticks(5))
    .enter()
    .append("text")
    .attr("y", 75)
    .attr("x", function(d, i) {
        let x = x0;
        console.log(x0)
        x0 += 2 * rainScale(d) + 20;
        return x0;
    })
    .text((d) => (d == 0 ? "" : d + " mm"))
    .attr("font-size", "12px")
}

// draw the legend part of the page
function DrawLegend()
{
    d3.selectAll("#legend-section svg").remove();

    DrawPollutionLegend();
    if (document.getElementById("rainOption").checked == true)
    {
        $("#rain-legend-title").text("Precipitation Level");
        DrawRainLegend();
    }
    else 
    {
        $("#rain-legend-title").text("");
    }
}

// draw the running scale 
// help users read data on circle without difficulties
function DrawSupplementaryScale(d)
{
    let angle = ( x(d.time) * 360 / ( 2 * Math.PI));

    angle = (angle > 180) ? angle + 10 : angle - 10;
    let tooClose =  (angle > 345 || angle < 15 )


    d3.selectAll(".bottomYAxis")
    .attr("transform", "rotate(" + angle + " )")
    .attr("opacity", tooClose ? 0 : 0.5)
    .attr("writing-mode", angle > 180 ? "vertical-lr" : "none")
    .style("font-size", 8 / Math.sqrt(k) + "px")
}

// interactive detail-on-demands
function DrawToolTip(d)
{
    var interactive = d3.select("#tooltip");
    $("#tooltip").append(
        "<h3>" + displayTime(d.time) + "</h3><br/>"
    )
    $("#tooltip").append(
        + "<table class='index' style='border: none'>"  
        + "<tr>"
        +  "<td>AQI</td>"
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
        +  "<td>Avg. temp</td>"
        +  "<td>" + Number(parseFloat(d.temp)).toFixed(1) + "&#176;C </td>"
        + "</tr>"
        + "<tr>"
        + "<tr>"
        +  "<td>Precipitation</td>"
        +  "<td>" + Number(parseFloat(d.rain)).toFixed(1) + " mm</td>"
        + "</tr>"
        + "<tr>"
        +  "<td>Avg. dew</td>"
        +  "<td>" + Number(parseFloat(d.dew)).toFixed(1) + "&#176;C </td>"
        + "</tr>"
      + "</table>"
    )
}

// draw the temperature line
function DrawTemperature(pollutant_data)
{
    var temperature = document.getElementById("tempOption").checked;
    var dew = document.getElementById("dewOption").checked;
    var shouldDisplayBaseLine = dew || temperature;

    var yAxis = d3.select(".yAxis-temp")

    yAxis.selectAll("g").remove();
    var yTick = yAxis.selectAll("g")
                    .data(yTemp.ticks(4))
                    .enter().append("g");
    
    yTick.append("circle")
        .attr("fill", "none")
        .style("stroke-width", shouldDisplayBaseLine ? "0.01rem" : "0rem")
        .attr("class", "baseline temp")
        .attr("r", yTemp);

    var labels = yTick.append("text")
            .attr("class", "topYAxis")
            .attr("y", function(d) { return -yTemp(d); })
            .attr("dy", "0.35em")
            .text(function(d) { return shouldDisplayBaseLine ? d : ""; });
    
    var tempPlot = d3.select("#avg-temp")
    .datum(pollutant_data)
    .attr("fill", "none")
    .attr("stroke", function() {
        // not showing when 
        return temperature ? "red" : "none";
    })
    .attr("d", line)

    var tempRegion = d3.select("#region-temp")
    .datum(pollutant_data)
    .attr("fill", function() { 
        return temperature ? "steelblue" : "none";
    })
    .attr("d", area)
    //.attr("fill", "#4099ff")
    .attr("fill-opacity", 0.1);

    var dewPlot = d3.select("#avg-dew")
    .datum(pollutant_data)
    .attr("fill", "none")
    .attr("stroke", function() {
        // not showing when 
        return dew ? "blue" : "none";
    })
    .attr("d", dewline)
}

function DrawRain(pollutant_data)
{
    // Add bars
    var precipitation = document.getElementById("rainOption").checked;
    var rain = d3.select("#rain");
    rain.selectAll("circle").remove();
    rain.selectAll("circle")
    .data(pollutant_data)
    .enter()
    .append("circle")
    .attr("class", "rain")
    .attr("transform", function(d) {
        let minRadius = y.range()[0];
        let maxRadius = y.range()[1];

        let new_x = polarToX(x(d.time), 0.5 * (minRadius + maxRadius));
        let new_y = polarToY(x(d.time), 0.5 * (minRadius + maxRadius));
        return "translate(" + new_x + "," + new_y + ")";
    
    }).attr("r", function(d) {
        return rainScale(parseFloat(d.rain)) / k;
    })
    .attr("opacity" ,0.5)
    .attr("fill", precipitation ? "#4099ff" : "none")
    .on("mouseover", function(d) {
        d3.selectAll("path").attr("opacity", 0.1);
        d3.selectAll("#rain circle").attr("opacity", 0.2);
        d3.select(this).attr("opacity", 0.95);
        DrawToolTip(d);
    })
    .on("mouseout", function() {
        d3.selectAll("path").attr("opacity", 0.95);
        d3.selectAll("rain").attr("opacity", 0.5);
        document.getElementById("tooltip").innerHTML = "";
    }); 

}

function ZoomRadial(data)
{
    d3.select("#radial-chart svg #radial-g").attr("transform", d3.event.transform);
    DrawRain(backup_data);
}

function DrawRadial(data) 
{
    var year = parseInt(document.getElementById("year").value);
    var pollutant = document.getElementById("pollutant").value;
    pollutant_data = data.filter(function(d, i) {
        var upper_limit = new Date(year + 1, 2);
        var lower_limit = new Date(year, 2);

        return d.time.getTime() < upper_limit.getTime() && d.time.getTime() >= lower_limit.getTime();
    })

    backup_data = pollutant_data.slice();
    var svg = d3.select("#radial-chart svg")
    .call(d3.zoom().on("zoom", function(data) {
        k = d3.event.transform.k;
        ZoomRadial(data);
    }));
    var g = svg.select("#radial-g");

    x.domain(d3.extent(pollutant_data, function(d) { return d.time; }));
    y.domain(d3.extent(pollutant_data, function(d) { return SelectPollutant(d, pollutant); }));
    
    yTemp.domain(d3.extent(
        [].concat(pollutant_data.map(function (item) {
            return (item.minTemp);
        }), pollutant_data.map(function (item) {
            return (item.maxTemp);
        }), pollutant_data.map(function (item) {
            return (item.dew);
        }))));
    
    rainScale.domain(d3.extent(pollutant_data, (d) => (d.rain)));

    DrawTemperature(pollutant_data);
    DrawRain(pollutant_data, rainScale);

    svg.select("#bars")
        .selectAll("path")
        .data(pollutant_data)
        // .enter()
        // .append("path")
        .attr("fill", function(d) {            
            for (let i = 0; i < levels.length; ++i)
            {
                var limit = levels[i];
                if (SelectPollutant(d, pollutant) <= limit) return colors[i];
            }
            return colors[colors.length - 1];
        })
        .attr("opacity", 0.95)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .attr("d", d3.arc()     // imagine your doing a part of a donut plot
        .innerRadius(innerRadius)
        .outerRadius(function(d) { return y(SelectPollutant(d, pollutant)); })
        .startAngle(function(d) { return x(d.time) })
        .endAngle(function(d) { return x(d.time) + 2 * Math.PI / pollutant_data.length; })
        .padAngle(0.002)
        .padRadius(innerRadius))
        .on("mouseover", function(d) {
            d3.selectAll("path").attr("opacity", 0.1);
            d3.select(this).attr("opacity", 1);
            var time = d.time;
            DrawToolTip(d);
            DrawSupplementaryScale(d);
        })
        .on("mouseout", function() {
            d3.selectAll("path").attr("opacity", 0.95);
            document.getElementById("tooltip").innerHTML = "";
        }); 
    // 

    svg.select(".yAxis").remove();

    var yAxis = g.append("g")
                    .attr("text-anchor", "middle")
                    .attr("class", "yAxis")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var yTick = yAxis.selectAll("g")
                    .data(y.ticks(7))
                    .enter().append("g");

    yTick.append("circle")
        .attr("fill", "none")
        .attr("class", "baseline")
        .attr("r", y);

    var labels = yTick.append("text")
            .attr("class", "topYAxis")
            .attr("y", function(d) { return -y(d); })
            .attr("dy", "0.35em")
            .text(function(d) { return d; })
            .style("font-size", 10 / Math.sqrt(k) + "px")

    yTick.append("text")
    .attr("class", "bottomYAxis")
    .attr("y", function(d) { return -y(d); })
    .attr("dy", "0.35em")
    .attr("transform", "rotate(-180)")
    .text(function(d) { return d; });

    var xAxis = svg.select("#xAxis");
    //xAxis.selectAll("g").remove();
    
    var xTick = xAxis
                .selectAll("g")
                .data(x.ticks(12))
                .enter().append("g")
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                    return "rotate(" + ((x(d)) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)";
                });

    xTick.append("line")
    .attr("class", "baseline")
    .attr("x2", -5)
    .attr("x1", border);

    d3.selectAll(".bottomYAxis").attr("transform", "rotate(180)");
    var xAxis = g.select("#xAxis");
                
    var xTick = xAxis
                .selectAll("g")
                .data(x.ticks(12))
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                return "rotate(" + ((x(d)) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)";
                });
    
    xTick.selectAll("line")
        .attr("x2", -5)
        .attr("x1", border)
        .attr("stroke", "#DDD");

    xTick.selectAll("month")
    .attr("transform", function(d) { 
        var angle = x(d);
        return ((angle < Math.PI / 2) || (angle > (Math.PI * 3 / 2))) ? "rotate(90)translate(0,22)" : "rotate(-90)translate(0, -15)"; 
    })
    .text(function(d) { 
        return months[d.getMonth()];
    })
    .style("font-size", 10)
    .attr("opacity", 1);
    
    var title = g.select(".title")
                .attr("class", "title")
                .attr("dy", "-0.2em")
                .attr("text-anchor", "middle")
                .text(data[0].station)
    
    var subtitle = g.select(".subtitle")
                    .attr("dy", "1em")
                    .attr("text-anchor", "middle")
                    .text("Mar " + year + " - Feb " + (year + 1)); 

    DrawLegend();
}

function InitRadial() 
{
    var pollutant = document.getElementById("pollutant").value;
    var precipitation = document.getElementById("rainOption").checked;
    var temperature = document.getElementById("tempOption").checked;

    var svg = d3.select("#radial-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", "radial-g");

    d3.select("#radial-chart svg")
                .call(d3.zoom().on("zoom", function () {
                    d3.select("#radial-chart svg #radial-g").attr("transform", d3.event.transform);
                    k = d3.event.transform.k;
            }));
    var g = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            
    d3.csv("./resources/dataset/PRSA_Data_Aotizhongxin_20130301-20170228.csv" , RowConverter, function(error, data) {
        var data = ProcessDailyData(data);
        
        if (error) throw error;
        
        pollutant_data = data.filter(function(d, i) {
            var upper_limit = new Date(year + 1, 2);
            var lower_limit = new Date(year, 2);
    
            return d.time.getTime() < upper_limit.getTime() && d.time.getTime() >= lower_limit.getTime();
        })
    
        night_data = data.filter(function(d, i) {
            var upper_limit = new Date(year + 1, 2);
            var lower_limit = new Date(year, 2);
    
            return d.time.getTime() < upper_limit.getTime() && d.time.getTime() >= lower_limit.getTime();  
        })

        x.domain(d3.extent(pollutant_data, function(d) { return d.time; }));
        y.domain(d3.extent(pollutant_data, function(d) { return SelectPollutant(d, pollutant); }));
        yTemp.domain(d3.extent(
            [].concat(pollutant_data.map(function (item) {
                return (item.minTemp);
            }), pollutant_data.map(function (item) {
                return (item.maxTemp);
            }), pollutant_data.map(function (item) {
                return (item.dew);
            }))));

        rainScale.domain(d3.extent(pollutant_data, (d) => (d.rain)));
        
        var tempRegion = g.append("path")
                          .attr("id", "region-temp");
    
        var tempPlot = g.append("path")
        .datum(pollutant_data)
        .attr("id", "avg-temp")
        .attr("fill", "none")
        .attr("stroke", temperature?"red":"none")
        .attr("d", line)
        .attr("opacity", 0.9);
        
        var dewPlot = g.append("path")
        .datum(pollutant_data)
        .attr("id", "avg-dew")
        .attr("fill", "none")
        .attr("stroke", temperature? "blue":"none")
        .attr("d", dewline)
        .attr("opacity", 0.9);

        // Add rain data
        var rain = g
        .append("g")
        .attr("id", "rain");
        
        rain.selectAll("circle")
        .data(pollutant_data)
        .enter()
        .append("circle")
        .attr("class", "rain")
        .attr("transform", function(d) {
            let minRadius = y.range()[0];
            let maxRadius = y.range()[1];
    
            let new_x = polarToX(x(d.time), 0.5 * (minRadius + maxRadius));
            let new_y = polarToY(x(d.time), 0.5 * (minRadius + maxRadius));
            return "translate(" + new_x + "," + new_y + ")";
        
        }).attr("r", function(d) {
            return rainScale(parseFloat(d.rain)) / k;
        })
        .attr("opacity" ,0.5)
        .attr("fill", precipitation ? "#4099ff" : "none")
        .on("mouseover", function(d) {
            d3.selectAll("path").attr("opacity", 0.1);
            d3.selectAll("#rain circle").attr("opacity", 0.2);
            d3.select(this).attr("opacity", 0.95);
            DrawToolTip(d);
        })
        .on("mouseout", function() {
            d3.selectAll("path").attr("opacity", 0.95);
            d3.selectAll("rain").attr("opacity", 0.5);
            document.getElementById("tooltip").innerHTML = "";
        }); 
    

        var yAxis = g.append("g")
            .attr("text-anchor", "middle")
            .attr("class", "yAxis")
        
        var yTick = yAxis.selectAll("g")
                        .data(y.ticks(7))
                        .enter().append("g");
        
        
        var yTick2 = yAxis
                    .selectAll("g")
                    .data(y.ticks(7))
                    .enter().append("g").attr("class", "bottomYAxis")
                    .attr("transform", "rotate(-90)");
    
        yTick.append("circle")
            .attr("fill", "none")
            //.attr("opacity", 1)
            .attr("class", "baseline")
            .attr("r", y);
        
        var labels = yTick.append("text")
                .attr("class", "topYAxis")
                .attr("y", function(d) { return -y(d); })
                .attr("dy", "0.35em")
                .text(function(d) { return d; });
        
                
        var yAxisTemp = g.append("g")
        .attr("text-anchor", "middle")
        .attr("class", "yAxis-temp")

        var xAxis = svg
                    .append("g")
                    .attr("id", "xAxis")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        var xTick = xAxis
        .selectAll("g")
        .data(x.ticks(12))
        .enter().append("g")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
            return "rotate(" + ((x(d)) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)";
            });
        
        xTick.append("line")
        .attr("class", "baseline")
        .attr("x2", -5)
        .attr("x1", border);
    
        xTick.append("text")
        .attr("class", "month")
        .attr("transform", function(d) { 
        var angle = x(d);
        return ((angle < Math.PI / 2) || (angle > (Math.PI * 3 / 2))) ? "rotate(90)translate(0,22)" : "rotate(-90)translate(0, -15)"; })
        .text(function(d) { 
            return months[d.getMonth()];
        })
        
        var pollutant = "aqi";
        
        svg.append("g")
        .attr("id", "bars")
        .selectAll("path")
        .data(pollutant_data)
        .enter()
        .append("path")
        .attr("fill", function(d) {            
            for (let i = 0; i < levels.length; ++i)
            {
                var limit = levels[i];
                if (SelectPollutant(d, pollutant) <= limit) return colors[i];
            }
            return colors[colors.length - 1];
        })
        .attr("opacity", 0.95)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .attr("d", d3.arc()     // imagine your doing a part of a donut plot
        .innerRadius(innerRadius)
        .outerRadius(function(d) { return y(SelectPollutant(d, pollutant)); })
        .startAngle(function(d) { return x(d.time) })
        .endAngle(function(d) { return x(d.time) + 2 * Math.PI / pollutant_data.length; })
        .padAngle(0.002)
        .padRadius(innerRadius))
        .on("mouseover", function(d) {
            d3.selectAll("path").attr("opacity", 0.1);
            d3.select(this).attr("opacity", 1);
            var time = d.time;
            DrawToolTip(d);
            DrawSupplementaryScale(d);
        })
        .on("mouseout", function() {
            d3.selectAll("path").attr("opacity", 0.95);
            document.getElementById("tooltip").innerHTML = "";
        }); 

        var title = g.append("g")
        .append("text")
        .attr("class", "title")
        .attr("dy", "-0.2em")
        .attr("text-anchor", "middle")
        .text("Aotizhongxin")
    
        var subtitle = g.append("text")
        .attr("class", "subtitle")
        .attr("dy", "1em")

        .attr("text-anchor", "middle")
        .text("Mar " + year + " - Feb " + (year + 1));  
    
        DrawLegend();
    });
}


