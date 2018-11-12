const exphbs = require('express-handlebars');
const express = require('express');
const app = express();
const factoryFunction = require('./waiter-function');
// const dataFunction = require('./waiter-dataFunction');
const waiterRoutes = require('./routes/routes');

const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const pg = require('pg');
const Pool = pg.Pool;

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/waiter_app';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

const waiterAppFactory = factoryFunction(pool);
const routes = waiterRoutes(waiterAppFactory);

app.use(session({
    secret: '<add a secret string here>',
    resave: false,
    saveUninitialized: true
}));

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(flash());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));
app.get('/waiter/:username', routes.home);
app.post('/waiter/:username', routes.gettingWaiterDays);
app.post('/login', routes.login);
app.get('/', routes.index);
app.get('/shifts', routes.owner);
app.get('/clear', routes.clearDataBaseWaiter);

app.use(express.static('public'));
let PORT = process.env.PORT || 4020;

app.listen(PORT, function () {
    console.log('App starting port' + PORT);
});
