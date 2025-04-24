// utils/response.js

 const sendSuccess = (res, data = {}, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };
  
 const sendError = (res, error = {}, message = "Internal Server Error", statusCode = 500) => {
    return res.status(statusCode).json({
      success: false,
      message,
      error
    });
  };
  
export {
  sendSuccess,
  sendError
}