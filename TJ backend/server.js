require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const connectDB = require('./config/dbCon');
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

connectDB();

app.use(
    cors({
        origin: [
            "http://192.168.152.142:5173",
            "http://localhost:5173",
            "https://tradeledger-ch.vercel.app",
        ],
        credentials: true,
    })
);


app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/forgot-password', require('./routes/forgotPassword'));
app.use('/reset-password', require('./routes/resetPassword'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use("/verify-email", require("./routes/verifyEmail"));

app.use(verifyJWT);
app.use('/trades', require('./routes/api/tradeRoutes'));
app.use('/dashboard', require('./routes/api/dashboardRoutes'));
app.use('/analytics', require('./routes/api/analyticsRoutes'));
app.use('/goals', require('./routes/api/goals'));
app.use('/notes', require('./routes/api/notes'));
app.use('/change-password', require('./routes/changePassword'));




const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
