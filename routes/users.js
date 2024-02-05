const mongoose = require('mongoose');
const plm=require("passport-local-mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/dataassoction', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {

    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  dp: {
    type: String // You can use String to store the file path or URL of the profile picture
  }
});
userSchema.plugin(plm);
module.exports= mongoose.model('User', userSchema);
