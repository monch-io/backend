import { TRPCError } from "@trpc/server";

export abstract class Exception extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
  }

  abstract toTRPCError: () => TRPCError;

  protected toTRPCErrorWithCode = (code: TRPCError["code"]): TRPCError =>
    new TRPCError({
      code,
      message: this.message,
      cause: this.cause || this.stack,
    });
}

export class NotFoundException extends Exception {
  toTRPCError = () => this.toTRPCErrorWithCode("NOT_FOUND");
}

export class BadRequestException extends Exception {
  toTRPCError = () => this.toTRPCErrorWithCode("BAD_REQUEST");
}
