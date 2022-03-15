const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../models')
const User = db.user;
const emailSend = require('../config/email.config')

exports.getAllUsers = async (req, res) => {
  try {
      const users = await User.find()
      res.json({users})
  } catch (err){
      res.status(500).json({message: err.message})
  }
}

exports.getUser = async (req, res) => {
  let user = res.user
  try {
    res.status(200).json({user})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

exports.removeUser = async (req, res) => {
  let user = res.user
  let cart = res.cart
  let { email, username } = res.user
      
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Account Removed',
    text: `
Hi ${username}

Your account has been successfully removed. Thanks for shopping!
    `
  };
  try {
    await user.remove()
    await cart.remove()
      
    emailSend.transporter.sendMail(mailOptions, function(error){
      if (error) {
        console.log(error);
        res.status(400).send({msg: "Email not sent"})
      }
    });
    res.status(201).json({message: "User removed!"})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

exports.editUser = async (req, res) => {
  let { username, email, password} = req.body
  let userEmail = res.user.email
  const salt = await bcrypt.genSalt()
      
  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: 'Account Edited',
    text: `
Hi ${res.user.username}. 

You Account has been edited.
    `
  };
  try {
      if(username) {
          res.user.username = username
      }
      if(email) {
          res.user.email = email
      }
      if(password) {
          res.user.password = bcrypt.hashSync(req.body.password, salt)
      }
      
      emailSend.transporter.sendMail(mailOptions, function(error){
        if (error) {
          console.log(error);
          res.status(400).send({msg: "Email not sent"})
        }
      });
      
      let token = jwt.sign({ id: res.user._id }, process.env.SECRET, {
        expiresIn: 86400 // 24 hours
      });

      const upadatedUser = await res.user.save()
      res.status(201).json({upadatedUser, accessToken: token})
  } catch (error) {
      res.status(500).json({message: error.message})
  }
}