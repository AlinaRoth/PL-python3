var request = require('request');
var fs = require('fs');

var country = "us"
var category_id="34"
var city="New York"
var state="NY"
var url = "https://api.meetup.com/2/concierge?key=687717166a6b43701f1c6b103822620&sign=true&photo-host=public&country=" + country + '&city=' + city + '&category_id=' + category_id + '&state=' + state;

var adressRegex = /^$|"address_1":"([\w\ \.\&]+)"/igm;
var eventsGerex = /"name":"[\w\d\ \(\)\:\&\,\.\@\!\#\'\+\/\-]+","id":"[\w ]+","time":([\d]+)/ig;

request(url, function (err,res,body) 
{
    if (err) {
        //throw err;
    }
    else {
        var events = JSON.parse(body).results;
        var now = new Date().getTime();
        var eventsMarkup = "<body><html>";

        for (j = 0; j < 7; j++){
            for (i = 0; i < events.length; i++) {
                if (events[i].time<((j+1)*86400000+now) && events[i].time>(j*86400000+now)) {
                    var date = new Date(events[i].time);
                    var year = date.getFullYear();
                    var months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
                    var month = months[date.getMonth()];
                    var date = date.getDate();
                    var formattedTime = year + '-' + month + '-' + date;
                    
                    var eventHtml = "not";
                    if (typeof events[i].venue === 'undefined') {
                        var eventHtml = '<li>' + formattedTime + ',<br> ' + events[i].name + ',<br> ' + "No address" + '</li>\n';
                    }
                    else {
                        var eventHtml = '<li>' + formattedTime + ',<br> ' + events[i].name + ',<br> ' + events[i].venue.address_1 + '</li>\n';
                    }
                    eventsMarkup += eventHtml;
                }
            }
        }
    }

    eventsMarkup += '</body></html>';
    fs.writeFile("events.html", eventsMarkup, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
});