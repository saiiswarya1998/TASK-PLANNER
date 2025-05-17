const mongoose = require('mongoose');
const bcrypt= require('bcryptjs');
const validator = require('validator')

const UserSchema = new mongoose.Schema(
    { username:
        {
            required:[true, 'Please provide name'],
            type:String,
            minlength: 3,
            maxlength : 20

        },

    email: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 3,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },

  verificationToken : String, 

  isVerified:
  {
    type: Boolean,
    default : false
  },

  verified : Date
    }
);

UserSchema.pre('save', async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified('name'));
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);