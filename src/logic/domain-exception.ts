import { Exception, ExceptionCode } from "../utils/exceptions";

export class DomainException extends Exception {
  constructor(
    message: string,
    private code: ExceptionCode = "PRECONDITION_FAILED",
    cause?: unknown
  ) {
    super(message, cause);
  }
  toTRPCError = () => this.toTRPCErrorWithCode(this.code);
}
