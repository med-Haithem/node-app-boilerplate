import { Server } from "http";
import express, { Express } from "express";
import app from "./src/app";
import errorHandler from "@utils/error-handler";
import logger from "@utils/logger";

const PORT = process.env.PORT || 3175;

const server: Server = app.listen(PORT, (): void => {
  logger.info(`The server is running on port ${PORT}`);
});

const exitHandler = (): void => {
  if (app as Express) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error): void => {
  errorHandler.handleError(error);
  if (!errorHandler.isTrustedError(error)) {
    exitHandler();
  }
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", (reason: Error) => {
  throw reason;
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
