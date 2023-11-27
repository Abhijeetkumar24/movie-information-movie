export enum MSG {
    VERIFICATION_OTP = "Otp Verification",
    USER_REGISTER = "Your account registration otp: "
}


export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    AMBIGUOUS = 300,
    MOVED_PERMANENTLY = 301,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
}


export enum HttpStatusMessage {

    OK = "OK",
    CREATED = "CREATED",
    ACCEPTED = "ACCEPTED",
    NO_CONTENT = "NO_CONTENT",
    AMBIGUOUS = "AMBIGUOUS",
    MOVED_PERMANENTLY = "MOVED_PERMANENTLY",
    FOUND = "FOUND",
    BAD_REQUEST = "BAD_REQUEST",
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    NOT_FOUND = "NOT_FOUND",
    CONFLICT = "CONFLICT",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
    BAD_GATEWAY = "BAD_GATEWAY",
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
    
}


export enum ExceptionMessage {


    NOT_FOUND = "NOT_FOUND",
    EMAIL_ALREADY_EXIST = "EMAIL_ALREADY_EXIST",
    ERROR_IN_REGISTRATION = "Error in signup",
    VERIFICATION_FAILED = "VERIFICATION_FAILED",
    EMAIL_NOT_EXISTS = "EMAIL_NOT_EXISTS",
    LOGIN_FAILED = "LOGIN_FAILED",
    SOMETHING_WENT_WRONG = "SOMETHING_WENT_WRONG",
    WRONG_ROLE = "wrong role",
    ERROR_IN_MOVIE_ADDING = 'Error in adding the movie',
    ERROR_IN_COMMENT_ADDING = 'Error in adding the comment',
    MOVIE_ALREADY_EXIST = "Movie already exist",
    TOKEN_NOT_FOUND = "Token not found",
    ERROR_IN_MOVIE_FETCHING = "Error in fetching movie",
    ERROR_IN_MOVIE_UPDATING = "Error in updating movie",
    MOVIE_NOT_FOUND = "Movie not found",
    ERROR_IN_MOVIE_UPDATE = "Error in movie update",
    ERROR_IN_MOVIE_DELETE = "Error in movie delete",
    ERROR_IN_COMMENTS_RETRIEVAL = "Error in comment retrieval",
    COMMENTS_NOT_FOUND = "Comments not found",
    ERROR_IN_COMMENT_UPDATE = "Error in comment update",
    COMMENT_NOT_FOUND = "Comment not found",
    ERROR_IN_COMMENT_DELETE = "Error in comment delete",
    ERROR_IN_MOVIE_SEARCH = "Error in movie search",
    MOVIE_LIST_ERROR = "Error in fetching movies list",
    USER_NOT_EXISTS = "USER_NOT_EXISTS",
    USER_ALREADY_EXIST = "USER_ALREADY_EXIST",
    OTP_EXPIRED = "OTP_EXPIRED",
    SESSION_NOT_FOUND = "SESSION_NOT_FOUND",
    INVALID_REQUEST = "INVALID_REQUEST",
    INCORRECT_OTP = "INCORRECT_OTP",
    INVALID_OTP = "INVALID_OTP",
    INVALID_PASSWORD = "INVALID_PASSWORD",
    UNAUTHORIZED = "UNAUTHORIZED",
    INVALID_MOVIE_ID = "Invalid movie id",
    NO_MOVIES_FOUND = "Movie Not Found",
    USER_DATA_NOT_FOUND = "USER_DATA_NOT_FOUND",
    INVALID_COMMENT_ID = "INVALID_COMMENT_ID",
    INVALID_SEARCH_QUERY = "INVALID_SEARCH_QUERY",
    NO_SEARCH_RESULTS = "NO_SEARCH_RESULTS"
}


export enum SuccessMessage {
    USER_REGISTRATION_MAIL = "OTP Send to entered email address",
    USER_SIGNUP_SUCCESS = "User signup successfully",
    ADD_MOVIE_SUCCESSFULLY = "Movie added successfully",
    ADD_COMMENT_SUCCESSFULLY = "Comment added successfully",
    MOVIE_FETCH_SUCCESSFULLY = "Movie fetch successfully",
    MOVIE_UPDATE_SUCCESSFULLY = "Movie udpate successfully",
    MOVIE_DELETE_SUCCESSFULLY = "Movie delete successfully",
    COMMENTS_RETRIEVED_SUCCESSFULLY = "Comments retrieved successfully",
    COMMENT_UPDATED_SUCCESSFULLY = "Comment update successfully",
    COMMENT_DELETE_SUCCESSFULLY = "Comment delete successfully",
    MOVIE_SEARCH_SUCCESSFULLY = "Movie search successfully",
    GET_MOVIES_SUCCESS = "Movies fetch successfully",
}


export enum Role {
    User = 'user',
    Admin = 'admin',
}