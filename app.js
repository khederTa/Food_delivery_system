// openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365  
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
require('dotenv/config');
const methodOverride = require('method-override');

// Mongo URI
const mongoURI = 'mongodb://localhost:27017/food';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

const app = express();
app.use((req, res, next) => {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});

// Middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.static('public'));


// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(
        db,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));



// Middleware
app.use(bodyParser.json());
app.set('view engine', 'ejs');


// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: false
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

const PORT = process.env.PORT || 5000
const clientRouter = require('./routes/userRouter');
app.use('/', clientRouter);
const adminRouter = require('./routes/adminRouter');
app.use('/food', adminRouter);
// Set EJS as templating engine
app.set('view engine', 'ejs');

// For parsing application/json
app.use(express.json());


app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
