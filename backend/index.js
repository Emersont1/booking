import express from 'express';
import cors from 'cors';
import dav from 'dav';
import {
    Calendar
} from 'dav';
import ical from "ical.js";


var url = process.env.DAV_URL;

var xhr = new dav.transport.Basic(
    new dav.Credentials({
        username: process.env.DAV_USER,
        password: process.env.DAV_PASS
    })
);

function calendarfunc(f) {
    return async (req, res) => {
        let data = await dav.createAccount({
                server: url,
                xhr: xhr,
                loadCollections: true,
                loadObjects: true
            })
            .then(function (account) {
                // account instanceof dav.Account
                var calendar = account.calendars.find(c => (c.url == url));
                return f(calendar, req);
            });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    };
}
const app = express();
app.use(cors());

app.get('/', calendarfunc(async (calendar, req) => {
    return calendar.objects.map(e => {
        var cal_d = e.data.props.calendarData;
        var jcal = ical.parse(cal_d);
        var comp = new ical.Component(jcal);
        var vevent = comp.getFirstSubcomponent("vevent");
        var event = new ical.Event(vevent);
        return {
            start: event.startDate.toString(),
            end: event.endDate.toString(),
            classNames: "tentative",
        };
    });
}));

app.listen(process.env.PORT || 4000, () =>
    console.log(`Example app listening on port ${process.env.PORT||4000}!`),
);