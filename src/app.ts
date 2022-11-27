import express from "express";
import cors from "cors";
import { getRoutes } from "./loaders/routes";
import errorHandling from "middlewares/error";
import notFoundRouter from "@features/not-found/not-Found.route";

const app = express();

// enable cors
app.use(cors());

// parse json body
app.use(express.json());

// load routes
getRoutes(app);

//handle Uknown Routes
app.use(notFoundRouter);


// catch all errors
app.use(errorHandling);

export default app;
