import { TRPCError } from "@trpc/server";

export type ExceptionCode = TRPCError["code"];

export abstract class Exception extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
  }

  abstract toTRPCError: () => TRPCError;

  protected toTRPCErrorWithCode = (code: ExceptionCode): TRPCError =>
    new TRPCError({
      code,
      message: this.message,
      cause: this,
    });
}

export class UnexpectedException extends Exception {
  toTRPCError = () => this.toTRPCErrorWithCode("INTERNAL_SERVER_ERROR");
}

export class NotFoundException extends Exception {
  toTRPCError = () => this.toTRPCErrorWithCode("NOT_FOUND");
}

export class BadRequestException extends Exception {
  toTRPCError = () => this.toTRPCErrorWithCode("BAD_REQUEST");
}
