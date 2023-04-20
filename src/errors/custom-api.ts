import { StatusCodes } from 'http-status-codes';

class CustomAPIError extends Error {
  statusCodes: StatusCodes;
  constructor(message: string) {
    super(message);
    this.statusCodes = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

export default CustomAPIError;
