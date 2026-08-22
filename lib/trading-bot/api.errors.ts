 /* -------------------------------------------------------------------------- */
/*                           Trading Bot API Errors                            */
/* -------------------------------------------------------------------------- */

export interface TradingBotApiErrorShape {
  code: string;
  message: string;
  statusCode?: number;
}

export class TradingBotApiError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number,
    code: string = "API_ERROR"
  ) {
    super(message);

    this.name = "TradingBotApiError";
    this.code = code;
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, TradingBotApiError.prototype);
  }

  toJSON(): TradingBotApiErrorShape {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                            API Error Handler                                */
/* -------------------------------------------------------------------------- */

export function handleApiError(
  response: Response,
  body?: unknown
): TradingBotApiError {
  const statusCode = response.status;

  if (
    body &&
    typeof body === "object" &&
    "error" in body &&
    body.error &&
    typeof body.error === "object"
  ) {
    const apiError = body.error as {
      code?: string;
      message?: string;
    };

    return new TradingBotApiError(
      apiError.message ?? "API request failed",
      statusCode,
      apiError.code ?? "API_ERROR"
    );
  }

  return new TradingBotApiError(
    response.statusText || "API request failed",
    statusCode,
    "API_ERROR"
  );
}