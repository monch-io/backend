import mongoose from "mongoose";
import {
  BadRequestException,
  Exception,
  NotFoundException,
  UnexpectedException,
} from "../../utils/exceptions";

export const mongooseErrorToException = (err: mongoose.Error): Exception => {
  if (err instanceof mongoose.Error.DocumentNotFoundError) {
    return new NotFoundException("Could not find specified record", err);
  } else if (
    err instanceof mongoose.Error.ValidationError ||
    err instanceof mongoose.Error.CastError ||
    err instanceof mongoose.Error.ValidatorError
  ) {
    return new BadRequestException("Error while validating request", err);
  } else {
    // Rest are internal errors:
    // Error.DivergentArrayError
    // Error.MissingSchemaError
    // Error.MongooseServerSelectionError
    // Error.OverwriteModelError
    // Error.ParallelSaveError
    // Error.StrictModeError
    // Error.VersionError
    return new UnexpectedException("Unexpected exception from mongoose", err);
  }
};

export const handleMongooseError = async <T>(
  operation: () => Promise<T>
): Promise<T> => {
  try {
    return await operation();
  } catch (err) {
    if (err instanceof mongoose.Error) {
      throw mongooseErrorToException(err);
    }
    throw err;
  }
};
