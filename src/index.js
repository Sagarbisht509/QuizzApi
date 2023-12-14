const express = require("express");
const userRoute = require("./routes/userRoutes");
const quizRoute = require("./routes/quizRoutes");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const mongoose = require("mongoose");

app.use(express.json()); // convert request body into json

app.use(cors());

app.use("/users", userRoute);
app.use("/quiz", quizRoute);

app.get('/', function (req, res) {
    res.send("Hello");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log("working fine on PORT:" + PORT);
        });
    })
    .catch((error) => {
        console.log(error);
    })