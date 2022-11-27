import httpStatus from "http-status";
import { Router, Request, Response } from "express";

const notFoundRouter: Router = Router();
const resBody = httpStatus[httpStatus.NOT_FOUND];
notFoundRouter.all("*", (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json(resBody);
});

export default notFoundRouter;
