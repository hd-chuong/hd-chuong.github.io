var levels = [50, 100, 150, 200, 300];
var colors = ["green", "yellow", "orange", "red", "purple", "maroon"];
var rankings = ["good", "moderate", "unhealthy for sensitive groups", "unhealthy", "very unhealthy", "hazardous"]
var colorLength = [50, 50, 50, 50, 100, 200];
var indicator = [0, 50, 100, 150, 200, 300];

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var pollutantColorCode = {
    "PM2_5": "#EF476F",
    "PM10": "#F78C6B",
    "SO2": "#FFD166",
    "NO2": "#06D6A0",
    "CO": "purple",
    "aqi" : "#073B4C",
    "O3" : "#118AB2",
}

var air_coeff = {
    CO: 1250,
    NO2: 2050,
    SO2: 2860,
    O3: 2140,
    CO: 1250,
    PM2_5: 1,
    PM10: 1
}

var standard = {
    CO: 9,
    NO2: 0.12,
    SO2: 0.20,
    O3: 0.10,
    PM2_5: 25,
    PM10: 50
}

// var pollutantColorCode = {
//     "PM2_5": "#291720",
//     "PM10": "#820263",
//     "SO2": "#d90368",
//     "NO2": "#f75c03",
//     //"CO": "073b4c",
//     "O3" : "#04a777",
// }