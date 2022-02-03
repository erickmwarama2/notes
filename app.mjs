import { default as express } from 'express';
import { default as hbs } from 'hbs';
import * as path from 'path';
import { default as logger } from 'morgan';
import { default as cookieParser } from 'cookie-parser';
import { default as bodyParser } from 'body-parser';
import * as http from 'http';
import { approotdir } from './approotdir.mjs';
import { InMemoryNotesStore } from './models/notes-memory.mjs';
const __dirname = approotdir;

//import * as favicon from 'serve-favicon';

import {
  normalisePort, onError, onListening, handle404, basicErrorHandler
} from './appsupport.mjs';

import { router as indexRouter } from './routes/index.mjs';
import { router as notesRouter } from './routes/notes.mjs';

export const NotesStore = new InMemoryNotesStore();
export const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'partials'));

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/notes', notesRouter);

// catch 404 and forward to error handler
app.use(handle404);
app.use(basicErrorHandler);

export const port = normalisePort(process.env.PORT || '3000');
app.set('port', port);

export const server = http.createServer(app);

server.listen(port, onListening);
//server.on('listen', onListening);
server.on('error', onError);
