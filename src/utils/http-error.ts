function httpError(status: number, message: string, details: unknown = undefined) {
  const error = new Error(message) as Error & {
    status?: number;
    details?: unknown;
  };
  error.status = status;
  error.details = details;
  return error;
}

module.exports = { httpError };
