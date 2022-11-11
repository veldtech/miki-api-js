import { AxiosError } from "axios";
import { ApiError } from "./ApiError";

type ValidationErrorObject = {
  type: string;
  title: string;
  status: number;
  traceId?: string;
  errors: Record<string, string[]>;
};

export class ValidationError extends Error {
  public code: number;
  public title: string;
  public traceId?: string;
  public errors: Record<string, string[]>;

  constructor(axiosError: AxiosError<ValidationErrorObject>) {
    super(
      "One or more validation errors occurred while processing your request."
    );

    this.code = axiosError.response?.data?.status ?? 50000;
    this.title = axiosError.response?.data?.title ?? "Unknown error";
    this.traceId = axiosError.response?.data?.traceId ?? undefined;
    this.errors = axiosError.response?.data?.errors ?? {};
  }

  public toString() {
    return `ValidationError ${this.code}: ${this.title}\n${JSON.stringify(
      this.errors
    )}`;
  }
}
