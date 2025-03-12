import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { authRouter } from './routes/user/auth.routes.js';
import { cardRouter } from './routes/user/card.routes.js';
import { cartRouter } from './routes/user/cart.routes.js';
import { profileRouter } from './routes/user/profile.routes.js';
import { wishlistRouter } from './routes/user/wishlist.routes.js';

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

app.use(express.json(
    {limit : "10mb"}
));

// app.use("/",express.static(path.join(__dirname, "src/data")))
// we initialize router for authentication.
app.use("/api/v1/user/auth", authRouter);

// now we define routes for handling the profile for a user.
app.use("/api/v1/user/profile", profileRouter);

//now we define routes for handling the card for a user.
app.use("/api/v1/user/card",cardRouter);

// now we define routes for handling the cart for a user.
app.use("/api/v1/user/cart", cartRouter);

// now we define routes for handling the wishlist for a user.
app.use("/api/v1/user/wishlist", wishlistRouter);

app.use((err, req, res, next) => {
    const message = err.message || "Something went wrong"
    const status = err.status || 500
    res.status(status).json({
        success : false,
        message
    })
})











