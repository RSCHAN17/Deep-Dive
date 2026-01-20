const express = require('express');
const cors = require('cors');


// const logRoutes = require();
const userRouter = require('./routers/users');

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

module.exports = app;