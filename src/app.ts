import express, { Application } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import router from "./app/rotues";
import cookieParser from "cookie-parser";
const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5173"] }));

//application routes
app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
