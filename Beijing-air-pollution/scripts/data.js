var levels = [33, 66, 99, 149, 200];
var colors = ["#31add3", "#99b964", "#ffd236", "#ec783a", "#d04730", "#782d49"];

// for legend purposes
var rankings = ["very good", "good", "fair", "poor", "very poor", "hazardous"]
var colorLength = [33, 33, 33, 50, 51, 100];
var indicator = [0, 33, 66, 99, 149, ">200"];

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

// coeff to normalize the existing raw data
var air_coeff = {
    CO: 1250,
    NO2: 2050,
    SO2: 2860,
    O3: 2140,
    CO: 1250,
    PM2_5: 1,
    PM10: 1
}

// the standard level of pollution which is equivalent to AQI of 100.
var standard = {
    CO: 9,
    NO2: 0.12,
    SO2: 0.20,
    O3: 0.10,
    PM2_5: 25,
    PM10: 50
}