const express = require('express');
const server = express();
const bodyParser = require('body-parser');
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
const handlebars = require('express-handlebars');

const hbs = handlebars.create({ // Create an instance of handlebars
    extname: 'hbs',
    helpers: { 
        //equals to comparator for hbs
        eq: function (a, b, options) {
            if (a === b) {
                return options.fn(this);
            } else {
                if (options.inverse)
                    return options.inverse(this);
                else
                    return '';
            }
        },
        compareTime: function(reservationTime, timeRange, options) {
            return reservationTime === timeRange ? options.fn(this) : options.inverse(this);
        },
        ifEquals: function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },
        // Custom helper to check if a value is in an array
        inArray: function(value, array, options) {
            if (array.indexOf(value) !== -1) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        // Register your custom helpers here
        isSeatUpToA4: function (index) {
            return index < 4;
        },
        isSeatUpA5ToA8: function (index) {
            return index >= 4 && index < 8;
        },
        isSeatUpToB4: function (index) {
            return index >= 8 && index < 12;
        },
        isSeatUpB5ToB8: function (index) {
            return index >= 12 && index < 16;
        },
        isSeatUpToC4: function (index) {
            return index >= 16 && index < 20;
        },
        isSeatUpC5ToC8: function (index) {
            return index >= 20 && index < 24;
        },
        isSeatUpToA3: function (index) {
            return index < 3;
        },
        isSeatUpA4ToA6: function (index) {
            return index >= 3 && index < 6;
        },
        isSeatUpA7ToA9: function (index) {
            return index >= 6 && index < 9;
        },
        isSeatUpToB3: function (index) {
            return index >= 9 && index < 12;
        },
        isSeatUpB4ToB6: function (index) {
            return index >= 12 && index < 15;
        },
        isSeatUpB7ToB9: function (index) {
            return index >=15 && index < 18;
        },
        isSeatUpToC3: function (index) {
            return index >= 18 && index < 21;
        },
        isSeatUpC4ToC6: function (index) {
            return index >= 21 && index < 24;
        },
        isSeatUpC7ToC9: function (index) {
            return index >=24 && index < 27;
        },
    }
});

server.engine('hbs', hbs.engine);
server.set('view engine', 'hbs');
server.use(express.static('public'));

const controllers = ['auth-routes', 'profile-routes', 'reserve-routes', 'users-routes'];
for (var i = 0; i < controllers.length; i++) {
    const ctrl = require('./controllers/' + controllers[i]);
    ctrl.add(server);
}

const port = process.env.PORT | 9090;
server.listen(port, function () {
    console.log('Listening at port ' + port);
});

function signalHandler() {
    console.log("Closing MongoDB Connection...")
    client.close();
    process.exit();
}

process.on("SIGINT", signalHandler)
process.on("SIGTERM", signalHandler)
process.on("SIGQUIT", signalHandler) 