import EErrors from "./enums.js";

// CustomError class switch cause and code
const errorHandler = function (error, req, res, next) {
    console.log(error.cause);
    switch (error.code) {
        case EErrors.NOT_FOUND_ERROR:
            return res.status(404).send("Not found");
        case EErrors.UNAUTHORIZED_ERROR:
            return res.status(401).send("Unauthorized");
        case EErrors.FORBIDDEN_ERROR:
            return res.status(403).send("Forbidden");
        case EErrors.BAD_REQUEST_ERROR:
            return res.status(400).send("Bad request");   
        case EErrors.ROUTING_ERROR:
            return res.status(404).send("Page not found");
        case EErrors.INVALID_TYPES_ERROR:
            return res.status(400).send("Invalid types");
        case EErrors.DATABASE_ERROR:
            return res.status(500).send("Database error");
        default:
            return res.status(500).send("Internal server error");
    }
}

export default errorHandler;