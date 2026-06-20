import express from 'express';
import morgan from  'morgan';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import sessionModel from './models/session.model.js';
import cors from 'cors';


const app = express ();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/auth", authRouter)

export default app;