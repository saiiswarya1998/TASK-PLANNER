const { createJWT, attachCookiesToResponse, isTokenValid} = require('./jwt');
const createTokenUser = require('./createToken');

const sendVerificationEmail = require('./sendVerificationEmail');
const  sendResetEmail  = require('./sendResetEmail');
module.exports = 
{
    createJWT, attachCookiesToResponse, isTokenValid, createTokenUser, sendVerificationEmail, sendResetEmail
}