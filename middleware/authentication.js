const CustomError = require('../errors');
const { isTokenValid } = require('../utils');
const Token = require('../model/Token');
const { attachCookiesToResponse } = require('../utils');
const authenticateUser = async (req, res, next) => {
  const { refreshToken } = req.signedCookies;

  try {
    
    console.log(refreshToken)
    const payload = isTokenValid(refreshToken);
    console.log(payload)
    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    console.log(existingToken)
    console.log('-----')
    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    req.user = payload.user;
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
};



module.exports = {
  authenticateUser,
  
};
