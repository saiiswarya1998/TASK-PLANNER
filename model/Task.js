const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema(
    {
        name:
        {type:String,
         trim:true,
         required: [true, 'A Task must be entered'],
         maxlength : [20, ' Task is of longer length']
        },
        completed:
        {type:Boolean,
            default:false,
        },
        createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
    },

    },

    
    {timestamps:true},
)

module.exports = mongoose.model('Task', TaskSchema)