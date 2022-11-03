import { type AxiosError } from "axios";

export type ErrorObject = {
  code: number;
  message: string;
};

export class ApiError extends Error {
  public code: number;
  public message: string;

  constructor(axiosError: AxiosError<ErrorObject>) {
    super(axiosError.message);
    this.code = axiosError.response?.data?.code ?? 50000;
    this.message = axiosError.response?.data?.message ?? "Unknown error";
  }

  public toString() {
    return `ApiError ${this.code}: ${this.message}`;
  }
}

export class ImpossibleError extends Error {
  public cause: Error;

  constructor(cause: Error) {
    super(
      "This should never happen, please report this to https://github.com/veldtech/miki-api-js."
    );
    this.cause = cause;
  }

  public toString() {
    return `${this.message} -- Caused by:\n${this.cause.message}\n${this.cause.stack}`;
  }
}
