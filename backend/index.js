import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import connectDB from "./db/connection.js";

dotenv.config({
    path: "backend/.env"
});

const app = express();
const port = process.env.PORT || 4000;

const __dirname = path.resolve();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)

// common middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"))

// import routes 
import productRoutes from "./routes/product.routes.js";

// routes
app.use("/api/v1/products", productRoutes);


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

connectDB().
    then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port http://localhost:${port}`);
        })
    }).catch((error) => {
        console.log(error);
        process.exit(1);
    })