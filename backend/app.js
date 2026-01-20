const express = require('express');
const cors = require('cors');

// LOGGER AND ROUTERS
// const logRoutes = require();

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

// app.use("/blahblah", blahRouter) etc...

module.exports = app;