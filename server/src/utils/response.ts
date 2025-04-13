interface SuccessResponse<T> {
    success: true;
    data: T;
}

interface ErrorResponse {
    success: false;
    error: {
        message: string;
    };
}

export const successResponse = <T>(data: T): SuccessResponse<T> => ({
    success: true,
    data,
});

export const errorResponse = (message: string): ErrorResponse => ({
    success: false,
    error: {
        message,
    },
});
