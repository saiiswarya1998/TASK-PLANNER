const User = require('../model/user');
const Token = require('../model/Token');
const Task = require('../model/Task');
const { StatusCodes } = require('http-status-codes');
const { createCustomError } = require('../errors/custom-error')
const { attachCookiesToResponse, createTokenUser, sendVerificationEmail, isTokenValid } = require('../utils');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


// validate Cookie

const taskList = async(req,res)=>
{
    const { refreshToken } = req.signedCookies;
    const validToken = await isTokenValid(refreshToken);
    const  tokenData = await User.findOne({_id: validToken.payload.user.userId});
   
   
    const tasks = await Task.find({createdBy:tokenData._id})

    
    console.log(tokenData)
    console.log(tasks)

   res.status(StatusCodes.OK).json({tokenData, tasks});
}

const createTask = async (req, res) => {
   const task = await Task.create(req.body)
  res.status(StatusCodes.CREATED).json({ task })
}

const deleteTask = async (req, res, next) => {

const { id: taskID } = req.params

const task = await Task.findOneAndDelete({ _id: taskID})
if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404))
}
res.status(200).json({ task })

}

const getTask = async (req, res, next) => {
  const { id: taskID } = req.params
  const task = await Task.findOne({ _id: taskID })
  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404))
  }

  res.status(200).json({ task })
}

const updateTask = async (req, res, next) => {
  const { id: taskID } = req.params

  const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
    new: true,
    runValidators: true,
  })

  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404))
  }

  res.status(200).json({ task })
}


module.exports = {taskList, createTask, deleteTask, getTask, updateTask}
