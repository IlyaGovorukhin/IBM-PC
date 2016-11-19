import exspress from 'express';
import url from 'url';
import fetch from 'isomorphic-fetch';
import prom from "bluebird";
import path from "path";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import favicon from 'serve-favicon';
import mongoose from 'mongoose';
import _ from 'lodash';
const users = require('./users');
const app = exspress();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

mongoose.Promise = global.Promise;

const BaseUrl = "https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json"

app.get('/', async function(req, res, next){
   const BaseData = await fetch(BaseUrl)


    console.log(req.params)
   res.json(await BaseData.json())
});


const re = new RegExp(/^([^?]+)(\?.*?)?(#.*)?$/)

app.get( re , async function(req, res, next){
    const BaseData = await fetch(BaseUrl)
    const result = await BaseData.json();
    //const resultparam =req.params;
    const urlPars = url.parse(req.url, true);
    const urlP = urlPars.pathname.split('/')
    if(urlP[1] == 'volumes'){
        const BaseData = await fetch(BaseUrl)
        const result = await BaseData.json();
        const popd = _.pick(result, ['hdd']);
        const drop = _.get(popd, ['hdd'])
        const rop = _.filter(drop, {"volume": "C:"});
        const ropsd = _.filter(drop, {"volume": "D:"});
        const yui = rop[0].size + rop[1].size + 'B'
        //return res.json(ropsd[0].size)
        return res.json({
            "C:": yui,
            "D:": ropsd[0].size + 'B'
    }) } else
    if (urlP.length == 2) {
        const popd = _.pick(result, urlP[1]);
        //const gopo = _.get(popd, urlP[1]);
        return res.json( _.get(popd, urlP[1]))
    }
     else if(urlP.length > 2){
        try {
            const result2 = _.pick(result, urlP[1]);
            const pop = _.get(result2, urlP[1]);
             const uiui = _.pick(pop, urlP[2])
            // console.log(uiui)
            // console.log(result2.uiui)
            // return res.send('Ok')
            return res.json( _.get(uiui, urlP[2]))
        } catch(err){
            console.log('Error222 ' + err)
        }
    }
});

app.get( '/hdd/0/vendor' , async function(req, res, next){
    const BaseData = await fetch(BaseUrl)
    const result = await BaseData.json();
    const popd = _.pick(result, ['hdd']);
    const drop = _.get(popd, ['hdd'])
    const rop = _.filter(drop, {"volume": "C:"});
    const ropsd = _.filter(drop, {"volume": "D:"});
    const yui = rop[0].size + rop[1].size + 'B'
    //return res.json(ropsd[0].size)
    return res.json({
        "C": yui,
        "D": ropsd[0].size + 'B'
    })

});


app.use('/users', users);




app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send('Error ' + err)
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send('Error')
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});