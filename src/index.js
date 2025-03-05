import dotenv from 'dotenv';
dotenv.config({
    path : "src/.env"
})
import { app } from "./app.js";
import { connectDB } from "./db/connection.db.js";
import { cloudinaryConfig } from './config/config.js';

cloudinaryConfig();

app.get('/', (req, res) => {
    res.json({
        success : true,
        data : "Every thing is okk."
    })
})

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log(`We can't start server because database connection is failed due to this error : ${err}`);
})

