const nodemailer = require('nodemailer');

const sendEmail = async options =>{
    //1 Create Transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USERNAME,
            PASS: process.env.EMAIL_PASSWORD
        }
        // Activate in gmail  "less secure app" option
    });

    //2 Define the email option
    const mailOptions = {
        from : 'Jonas Schmedtmann <admin@gmail.com>',
        to : options.email,
        subject : options.subject,
        text : options.message
        //html
    };
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;