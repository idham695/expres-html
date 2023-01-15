require('dotenv').config();
const Express = require("express");
const cors = require("cors");
const listRoute = require('./route/list');
const authRoute = require('./route/auth');



const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*'
}));

const port = process.env.PORT || 3000;

app.use('/list', listRoute);
app.use('/auth', authRoute);


app.listen(port, () => {
    console.log(`Aplikasi berjalan di port ${port}`);
})