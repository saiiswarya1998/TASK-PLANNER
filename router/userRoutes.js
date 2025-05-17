const express = require('express')
const router = express.Router()

const {taskList, createTask, deleteTask, getTask, updateTask} = require('../controller/usercontroller');


router.route('/taskDetails').get(taskList).post(createTask)
router.route('/:id').delete(deleteTask).get(getTask).patch(updateTask)

module.exports = router