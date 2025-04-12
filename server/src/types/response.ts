/**
 * Standard API response format for success responses
 */
export interface SuccessResponse<T> {
    success: true;
    data: T;
    message?: string;
}

/**
 * Standard API response format for error responses
 */
export interface ErrorResponse {
    success: false;
    error: {
        code: number;
        message: string;
        details?: any;
    };
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Helper function to create a success response
 */
export const successResponse = <T>(
    data: T,
    message?: string
): SuccessResponse<T> => ({
    success: true,
    data,
    message,
});

/**
 * Helper function to create an error response
 */
export const errorResponse = (
    code: number,
    message: string,
    details?: any
): ErrorResponse => ({
    success: false,
    error: {
        code,
        message,
        details,
    },
});
