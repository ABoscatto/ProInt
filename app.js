const express = require('express');
const path = require('path');
const fs = require('fs');
const methodOverride = require('method-override');
const dotenv = require('dotenv').config();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());

app.use(session({ secret: 'LoCoTiTo', resave: false, saveUninitialized: true }));

app.use(express.static('public'));
const publicPath = path.resolve(__dirname, './public');
app.use(express.static(publicPath));


const port = process.env.PORT || 3001;

app.use(cors());

/* ESPECIFICO VIEW ENGINE Y PASO ARRAY CON PATHS DE TODOS LOS MODULOS DE VIEW */
app.set('view engine', 'ejs');
app.set('views',[
    path.join(__dirname,'views/main'),
    path.join(__dirname,'views/albums'),
    path.join(__dirname,'views/pistas'),
    path.join(__dirname,'views/partials'),
]);

/* CARGA DE LOS ROUTERS */
let mainRouter = require('./routers/mainRouter');
let albumsRouter = require('./routers/albumsRouter');
let pistasRouter = require('./routers/pistasRouter');
let cartRouter = require('./routers/cartRouter'); 
let usersRouter = require('./routers/usersRouter');
let pruebasRouter = require('./routers/pruebasRouter');

/* CARGA DE LOS ROUTERS API */
let usersRouterApi = require('./routers/api/usersRouter_api');

/* CARGA DE MIDDLEWARES */
let rememberMiddleware = require('./middlewares/rememberMiddleware');
// const userMiddleware = require('./middlewares/userMiddleware');

// Middle para pasar siempre la session.loggedFirstName a todas las vistas.
app.use(function (req, res, next) {   
    if (req.session.loggedFirstName) {
        res.locals.loggedFirstName = req.session.loggedFirstName;
        }
    next();
  });


/* APP.USE PARA CADA ROUTER */
app.use('/', mainRouter);
app.use('/users', usersRouter);
app.use('/register', mainRouter);
app.use('/albums', albumsRouter);
app.use('/pistas', pistasRouter);
app.use('/cart', cartRouter);
app.use('/pruebas', pruebasRouter);

/* APP.USE PARA CADA ROUTER API */
app.use('/api/users', usersRouterApi);

/* CONECTANDO REACT A EXPRESS */
app.use(express.static(path.join(__dirname, '../dashboard/build')));
/*app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dashboard/build', 'index.html'));
  });*/

/*ERROR 404 */
app.use((req,res,next) => {
    res.status(404).render('not-found');
})


/*APP USE PARA CADA MIDDLEWARE */
app.use(rememberMiddleware);

/* SERVER EN ESCUCHA */
app.listen(3001, () => {console.log('Server funcionando 3000 OK en'+' http://localhost:3001/')});

