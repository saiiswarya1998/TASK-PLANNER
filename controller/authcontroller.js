const User = require('../model/user');
const Token = require('../model/Token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser, sendVerificationEmail, sendResetEmail, isTokenValid } = require('../utils');
const crypto = require('crypto');
const user = require('../model/user');



const register = async (req, res) => {
  const {username, email, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const verificationToken = crypto.randomBytes(40).toString('hex');
  const user = await User.create({ username, email, password, role, verificationToken });

  const tokenUser = createTokenUser(user);
 
  attachCookiesToResponse({ res, user: tokenUser });

  const origin = 'https://task-planner-qfru.onrender.com';

  await sendVerificationEmail({
    name: user.username,
    email : user.email,
    verificationToken: user.verificationToken,
    origin
  });

  res.status(StatusCodes.CREATED).json({ msg: 'Successful, please check email to verify account' });
};


// login controller

const login = async(req,res)=>
{

  const {email, password} = req.body

  if(!email || !password)
  {
    throw new CustomError.BadRequestError('Please provide email and password')
  }

  const user = await User.findOne({email});

  if(!user)
  {
    throw new CustomError.UnauthenticatedError('Invalid credentials');

  }

  const isPasswordCorrect = await user.comparePassword(password);

   if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  const tokenUser = createTokenUser(user);


  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
   
    if (!isValid) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
  
    refreshToken = existingToken.refreshToken;
   
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
   
    res.status(StatusCodes.OK).json({ user: tokenUser, token: refreshToken });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = {refreshToken, userAgent, ip, user : user._id};

  const token = await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser, token: refreshToken });  
};



const verifyEmail = async(req,res)=>
{
    const { verificationToken , email} = req.body

    if(!email || !verificationToken)
    {
       throw new CustomError.BadRequestError('Invalid Verification request');
    }

    if(email)
    {
        const user = await User.findOne({email});

        if(!user)
        {
            throw new CustomError.UnauthenticatedError('Verification failed');
        }

        if(user.verificationToken !== verificationToken)
        {
          throw new CustomError.UnauthenticatedError('Verification Failed')
        }

        user.verificationToken = '';
        user.isVerified = true;
        user.verified = Date.now();

        await user.save();

        res.status(StatusCodes.OK).json({ msg: 'Email Verified' });
    }
}

const resetVerifyEmail = async(req,res)=>
{
    const { verificationToken , email} = req.body

    if(!email || !verificationToken)
    {
       throw new CustomError.BadRequestError('Invalid Verification request');
    }

    if(email)
    {
        const user = await User.findOne({email});

        if(!user)
        {
            throw new CustomError.UnauthenticatedError('Verification failed');
        }

        if(user.verificationToken !== verificationToken)
        {
          throw new CustomError.UnauthenticatedError('Verification Failed')
        }

        user.verificationToken = '';
        user.isVerified = true;
        user.verified = Date.now();

        await user.save();

        res.status(StatusCodes.OK).json({ msg: 'Password is Verified' });
    }
}

const logout = async (req, res) => {
  
 
  const { refreshToken } = req.signedCookies;
 const validToken = await isTokenValid(refreshToken);
 await Token.findOneAndDelete({ user: validToken.payload.user.userId});

  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
  
};

const resetPassword = async (req, res) => {

const {email, password} = req.body;

  const resetUser = await User.findOne({ email });
  if (!resetUser) {
    throw new CustomError.BadRequestError('Sorry, User does not exist');
  }

  // create Verification Id

  const verificationToken = crypto.randomBytes(40).toString('hex');
  
  resetUser.verificationToken = verificationToken;
  resetUser.isVerified = false;
  resetUser.password=password
  resetUser.verified = '';
  await resetUser.save();


  const origin = 'https://task-planner-qfru.onrender.com';

  await sendResetEmail({
    name: resetUser.username,
    email : resetUser.email,
    verificationToken: resetUser.verificationToken,
    origin
  });

  res.status(StatusCodes.CREATED).json({ msg: 'Successful, please check email to verify reset password' });

}
  

const testverify = async(req,res)=>
{
  res.send('test')
}
module.exports = {register, verifyEmail, login, logout, resetPassword, resetVerifyEmail};