const express = require('express');
const cors = require('cors');


// const logRoutes = require();
const userRouter = require('./routers/users');
const animalRouter = require('./routers/animals');
const achievementRouter = require('./routers/achievements');

const app = express();
app.use(cors());
app.use(express.json());
// app.use(logRoutes);

app.get("/", (req, res) => {
    res.json({
        name: "API Homepage",
        description: "Nothing else here!"
    })
});

app.use("/users", userRouter);
app.use("/animals", animalRouter);
app.use("/achievements", achievementRouter);


module.exports = app;