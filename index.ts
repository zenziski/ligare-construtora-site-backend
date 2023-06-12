import express from 'express';
import http from 'http';
import path from 'path';
const mongoose = require('mongoose');
import cors from 'cors';


require('dotenv').config();

(global as any).appRoot = path.resolve(__dirname);

const app = express();
const server = http.createServer(app);
//const loggerMiddleware = require('./middlewares/authentication')(app),

app.use(cors());
app.use(express.json());
app.use(require('./middlewares/logger')(app))

const mongoURL = process.env.MONGO_URL;
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

import resourcesMap from "./config/resources";
import loader from './config/loader';
import jobsMap from './config/jobs';

(app as any).models = loader(path.join(__dirname, 'models'));
(app as any).services = loader(path.join(__dirname, 'services'), app);
(app as any).io = require('socket.io')(server);

require('./libs/validations').registerValidator('string', 'email', (value: string) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value) ? '' : 'Email inválido';
});

jobsMap(app as any, {
    directory: path.join(__dirname, 'jobs')
});

resourcesMap(app, {
    directory: path.join(__dirname, 'resources'),
    log: null,
    authentication: require('./middlewares/authentication')(app),
    /* pipes: {
        validation: require('./middlewares/validation'),
        basic_auth: require('./middlewares/basic_authentication'),
    } */
});

const Jwt = require('./config/jwt')();

(app as any).io.on('connection', (socket: { handshake: { query: { token: any; }; }; disconnect: () => void; userId: any; join: (arg0: string) => void; on: (arg0: string, arg1: any) => void; leave: any; }) => {
    const token = socket.handshake.query.token;
    if (!token) socket.disconnect();

    const tokenData = Jwt.verify(token.split(' ')[1]);
    if (!tokenData) socket.disconnect();

    socket.userId = tokenData.id;
    socket.join(`user_${tokenData.id}`);

    socket.on('join', socket.join);
    socket.on('leave', socket.leave);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`API running on port ${port}`);
});
