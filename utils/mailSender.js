const transporter = require('../config/mail');

const mailSender = async(email, subject, body)=>{

    try{

        const info = await transporter.sendMail({

            from: `"ToDoFlow"<${process.env.MAIL_USER}>`,

            to: email,

            subject: subject,

            html: body

        });

        console.log('Mail sent successfully');
        console.log(info);

        return info;

    }
    catch(error){

        console.error('Mail error: ', error);
        throw error;

    }

}

module.exports = mailSender;