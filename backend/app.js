const express = require('express');
const cors = require('cors');


const logRoutes = require('./middleware/logger');

const userRouter = require('./routers/users');
const animalRouter = require('./routers/animals');
const achievementRouter = require('./routers/achievements');
const spotRouter = require('./routers/spottings');

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(express.json());
app.use(logRoutes);

app.get("/", (req, res) => {
    res.json({
        name: "API Homepage",
        description: "Nothing else here!"
    })
});

app.use("/users", userRouter);
app.use("/animals", animalRouter);
app.use("/achievements", achievementRouter);
app.use("/spottings", spotRouter);

module.exports = app;