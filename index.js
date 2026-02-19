import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
// import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dealRoutes from "./routes/dealRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: "*",
    credentials: true,
}));
// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.use("/api/leads", leadRoutes);

app.use("/api/users", userRoutes);

app.use("/api/deals", dealRoutes);

app.use("/api/activities", activityRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});