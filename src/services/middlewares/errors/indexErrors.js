import EErrors from "./enums.js";

// CustomError class swith cause and code
export default (error, req, res, next) => {
    console.log(error.cause);
    switch (error.code) {
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