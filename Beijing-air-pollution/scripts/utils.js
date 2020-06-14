/*
Utils 
target: dashboard.html
Author: Chuong Ho
Course: COS30045 - Data Visualization
Date created: 06/05/2020
*/

function ToInt(a)
{
    return (a === "NA") ? null : parseInt(a);
}

function ToFloat(a)
{
    return (a === "NA") ? null : parseFloat(a);
}
function PeriodPicker(dataset)
{

}

function CalculateDistributionLevel(dataset, pollutant)
{
    var freq = new Array(colors.length).fill(0);
        
    for (var rowIndex = 0; rowIndex < dataset.length; ++rowIndex)
    {
        var rowAQI = SelectPollutant(dataset[rowIndex], pollutant);

        if (rowAQI > levels[levels.length-1]) 
        {
            freq[levels.length] += 1;
            continue;
        }
        for (var levelIndex = 0; levelIndex < levels.length; ++levelIndex)
        {
            var levelLimit = levels[levelIndex];
            if (rowAQI <= levelLimit) 
            {
                freq[levelIndex] += 1;
                break;
            }    
        }
    }
    return freq;
}

function RowConverter(row)
{
    var PM2_5 = ToInt(row.PM2_5);
    var PM10  = ToInt(row.PM10);
    var SO2 = ToInt(row.SO2);
    var NO2 = ToInt(row.NO2);
    var CO = ToInt(row.CO);
    var O3 = ToInt(row.O3);
    var temp = (row.TEMP == "NA") ? null : ToFloat(row.TEMP);
    var pres = ToInt(row.PRES);
    var dew = ToFloat(row.DEWP);
    var rain = ToFloat(row.RAIN);
    // miss wind direction
    var wind_speed = parseInt(row.WSPM);


    // var aqi = Math.max(...[PM2_5, PM10, SO2, NO2, CO, O3]);
    var aqi = Math.max(...[PM2_5, PM10, SO2, NO2, O3]);
    return {
        id: parseInt(row.No),
        time: new Date(+row.year, row.month - 1, row.day, row.hour),
        PM2_5: PM2_5,
        PM10: PM10,
        SO2: SO2,
        NO2: NO2,
        CO: CO,
        O3: O3,
        temp: temp,
        pres: pres,
        dew: dew,
        rain: rain,
        wind_direction: row.wd,
        wind_speed: wind_speed,
        station: row.station,
        aqi: aqi,
    }
}

function SelectPollutant(row, pollutionName)
{
    switch(pollutionName)
    {
        case "PM2_5":
            return row.PM2_5;
        case "PM10":
            return row.PM10;
        case "SO2":
            return row.SO2;
        case "NO2":
            return row.NO2;
        case "CO":
            return row.CO;
        case "O3":
            return row.O3;
        default:
            return row.aqi;
    }
}

// convert from polar coordinate to x,y coordinate
function polarToX(angle, radius) {
    // change to clockwise
    let a = Math.PI * 2 - angle
    // start from 12 o'clock
    return - radius * Math.sin(a)
  }

function polarToY(angle, radius) {
    // change to clockwise
    let a = Math.PI * 2 - angle
    // start from 12 o'clock
    return - radius * Math.cos(a)
}

function convertToStandard(record)
{

}


function ProcessDailyData(data) {
    var result = new Array();
    var index = 0;
    var i = 0;
    while (i < data.length)
    {
        var refDate = data[i].time;
        var record = {
            id: index,
            CO: 0,
            NO2: 0,
            O3: 0,
            PM2_5: 0,
            PM10: 0,
            SO2: 0,
            aqi: 0,
            station: data[i].station,
            temp: 0,
            minTemp: 1000,
            maxTemp: -1000,
            dew: 0,
            rain: 0,
            time: refDate
        }
        var dayCollection = new Array();

        while ( i < data.length 
            &&  data[i].time.getDate() === refDate.getDate() 
            &&  data[i].time.getMonth() === refDate.getMonth()
            &&  data[i].time.getYear() === refDate.getYear()
            )
        {
            dayCollection.push(data[i]);
            ++i;
        }
        for (let j = 0; j < dayCollection.length; ++j)
        {
            record.CO = Math.max(record.CO, dayCollection[j].CO);
            record.NO2 = Math.max(record.NO2, dayCollection[j].NO2);
            record.O3 = Math.max(record.O3, dayCollection[j].O3);
            record.SO2 = Math.max(record.SO2, dayCollection[j].SO2);
            record.minTemp = Math.min(record.minTemp, dayCollection[j].temp);
            record.maxTemp = Math.max(record.maxTemp, dayCollection[j].temp);
            //record.PM2_5 = Math.max(record.PM2_5, data[i].PM2_5);
            //record.PM10 = Math.max(record.PM10, data[i].PM10);
            record.rain += dayCollection[j].rain;
        }
        var countPM2_5 = 0, countPM10 = 0;
        var sumPM2_5 = 0, sumPM10 = 0;
        var sumTemp = 0, countTemp = 0;
        var sumDew = 0, countDew = 0;
        for (let j = 0; j < dayCollection.length; ++j)
        {
            if (dayCollection[j].PM2_5 > 0)
            {
                sumPM2_5 += dayCollection[j].PM2_5;
                countPM2_5 += 1;
            }

            if (dayCollection[j].PM10 > 0)
            {
                sumPM10   += dayCollection[j].PM10;
                countPM10 += 1;
            }

            if (dayCollection[j].temp != null)
            {
                sumTemp += dayCollection[j].temp;
                countTemp += 1;
            }

            if (dayCollection[j].dew != null)
            {
                sumDew += dayCollection[j].dew;
                countDew += 1;
            }
        }

        record.PM2_5 = countPM2_5 > 0 ? sumPM2_5 / countPM2_5 : 0;
        record.PM10 = countPM10 > 0 ? sumPM10 / countPM10 : 0;
        record.temp = countTemp > 0 ? sumTemp / countTemp : null;
        record.dew = countDew > 0 ? sumDew / countDew : null;
        record.CO = COToAQI(record.CO);
        record.NO2 = NO2ToAQI(record.NO2);
        record.SO2 = SO2ToAQI(record.SO2);
        record.O3 = O3ToAQI(record.O3);
        record.PM2_5 = PM2_5ToAQI(record.PM2_5);
        record.PM10 = PM10ToAQI(record.PM10);
        record.aqi = Math.max(record.CO, record.NO2, record.SO2, 
                            record.O3, record.PM2_5, record.PM10);
        result.push(record)
        index+=1;
    }
    return result;
}

function FilterDateData(data, refDate)
{
    var result = [];
    for (let i = 0; i < data.length; ++i)
    {
        if ( data[i].time.getDate() === refDate.getDate() 
            &&  data[i].time.getMonth() === refDate.getMonth()
            &&  data[i].time.getYear() === refDate.getYear())
        {
            result.push(data[i]);
        }
    }
    return result;
}

function ConvertRawToAQI(raw)
{
    // var result = {
    //     id: record.id,
    //     CO: COToAQI(record.CO),
    //     NO2: NO2ToAQI(record.NO2),
    //     O3: 0,
    //     PM2_5: 0,
    //     PM10: 0,
    //     SO2: 0,
    //     aqi: 0,
    //     station: data[i].station,
    //     temp: 0,
    //     minTemp: 1000,
    //     maxTemp: -1000,
    //     dew: 0,
    //     rain: 0,
    //     time: refDate
    // }
    var result = [...raw];
    
    raw.forEach(function(record, i) {
        result[i].CO = COToAQI(record.CO);
        
        result[i].NO2 = NO2ToAQI(record.NO2);
        result[i].SO2 = SO2ToAQI(record.SO2);
        result[i].O3 = O3ToAQI(record.O3);
        result[i].PM2_5 = PM2_5ToAQI(record.PM2_5);
        result[i].PM10 = PM10ToAQI(record.PM10);
        result[i].aqi = Math.max(result[i].CO, result[i].NO2, result[i].SO2, 
                            result[i].O3, result[i].PM2_5, result[i].PM10);
    })

    return result;
}

function COToAQI(raw)
{
    return raw / air_coeff.CO / standard.CO * 100;
}

function NO2ToAQI(raw)
{
    return raw / air_coeff.NO2 / standard.NO2 * 100;
}

function SO2ToAQI(raw)
{
    return raw / air_coeff.SO2 / standard.SO2 * 100;
}

function O3ToAQI(raw)
{
    return raw / air_coeff.O3 / standard.O3 * 100;
}

function PM2_5ToAQI(raw)
{
    return raw / air_coeff.PM2_5 / standard.PM2_5 * 100;
}

function PM10ToAQI(raw)
{
    return raw / air_coeff.PM10 / standard.PM10 * 100;
}


function displayTime(d, needHour = false)
{
    var day = days[d.getDay()];
    var hr = d.getHours();
    var min = d.getMinutes();
    if (min < 10) {
        min = "0" + min;
    }
    var ampm = "am";
    if( hr > 12 ) {
        hr -= 12;
        ampm = "pm";
    }
    var date = d.getDate();
    var month = months[d.getMonth()];
    var year = d.getFullYear();
    if (needHour) 
    {
        return (hr + " " + ampm + " " + day + " " + date + " " + month + " " + year);
    }
    else 
    {
        return day + " " + date + " " + month + " " + year;
    }
}