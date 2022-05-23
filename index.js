import express from 'express';
import mongoose from 'mongoose';
import * as exphbs from 'express-handlebars';
import {router} from './routes/routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3002;
const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine','hbs');
app.set('views', 'views');

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(router);

async function start(){
    try{
        await mongoose.connect('mongodb+srv://admin:1q2w3e@realmcluster.gj5t0.mongodb.net/desks', {
            useNewUrlParser: true,
            useFindAndModify: false
        }).then(() => {
            console.log('MongoDB connected!');
        }).catch(err => {
            console.log('Failed to connect to MongoDB', err);
        });

        app.listen(PORT, () => {
            console.log('Server has been work at PORT ' + PORT);
        });

    } catch (e) {
        console.log(e);
    }
}

start();