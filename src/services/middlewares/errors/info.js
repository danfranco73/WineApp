// middlewares for error handling and error messages generation
export const generateUserErrorInfo = (user) => {
    return `One or more porperties were incomplete or not valid.
    List o frequied properties:
    * first_name: needs to be a string, received ${user.first_name}
    *last_name: needs to be a  string, received ${user.last_name}
    *email: needs to be a string, received ${user.email}`
}