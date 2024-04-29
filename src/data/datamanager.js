const fs = require("fs");

var settings = JSON.parse(fs.readFileSync("userdata.json")).settings;
var savedEvents = JSON.parse(fs.readFileSync("userdata.json")).savedEvents;

function saveSetting(setting, newValue) {
    switch (setting) {
        case "accentcolor":
            settings.accentColor = newValue.toString();
            break;
        case "selectedtheme":
            settings.selectedTheme = newValue.toString();
            break;
        case "firstdayofweek":
            settings.firstDayOfWeek = newValue.toString();
            break;
    };
    saveFile();
}

function saveEvent(title, startdate, endate, repeat = false, color = "#40376E") {
    const newEvent = {
        "title": title,
        "startdate": startdate,
        "enddate": endate,
        "repeat": repeat,
        "color": color
    }
    savedEvents.push(newEvent);
    saveFile();
}

function saveFile() {
    const newData = {
        "settings": settings,
        "savedEvents": savedEvents
    };
    const newDataString = JSON.stringify(newData);
    fs.writeFileSync("userdata.json", newDataString);
}