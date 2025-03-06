import { ErrorRequestHandler } from "express";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  //setting default values
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  type TErrorSources = {
    path: string | number;
    message: string;
  }[];
  const errorSources: TErrorSources = [
    {
      path: "",
      message: "Something wrong",
    },
  ];
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
  });
};

export default globalErrorHandler;
