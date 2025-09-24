const express = require("express");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const path = require(("path"))

const app = express();
const port = 2000;


// Middlewars 
app.use(morgan("dev"));
app.use(express.static('lab2styles'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// view engine
app.use(expressLayouts);
app.set('view engine', "ejs");
app.set('views', [
    path.join(__dirname, 'views'),
]);

// Routes
const indexRouter = require('./index');
app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});