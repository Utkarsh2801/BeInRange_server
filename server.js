require("dotenv").config();
const express = require("express");
const morgan = require('morgan');
const roam = require("roam-js")
const { getDBInstance } = require("./src/utils/connectin.utils");

const pk = process.env.ROAM_KEY;

const appRouter = require("./src/routes/app.routes")

// Express app
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, key, Content-Type, Accept, access-control-allow-origin, Authorization, userid"
    );
    res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PATCH,DELETE,OPTIONS,PUT")
    next();
});

// Logging
app.use(morgan('dev'));
app.use('/', appRouter)

// Server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT ${process.env.PORT}`);
});