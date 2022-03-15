const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    },
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
  });
 