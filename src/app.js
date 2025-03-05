import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import { upload } from './middlewares/user/fileUpload.middleware.js';
import { authRouter } from './routes/user/auth.routes.js';
import { profileRouter } from './routes/user/profile.routes.js';

export const app = express();

app.use(cors({
    origin : ["http://localhost:5173","http://localhost:5174"],
    methods : ["GET","POST","PUT","DELETE","PATCH"],
    credentials : true
}))

app.use(cookieParser());

app.use(express.urlencoded({
    extended : true
}))

app.use(express.json());

// app.use("/",express.static(path.join(__dirname, "src/data")))
// we initialize router for authentication.
app.use("/api/v1/user/auth", authRouter);

// now we define routes for handling the profile for a user.
app.use("/api/v1/user/profile", profileRouter);
app.use((err, req, res, next) => {
    const message = err.message || "Something went wrong"
    const status = err.status || 500
    res.status(status).json({
        success : false,
        message
    })
})











