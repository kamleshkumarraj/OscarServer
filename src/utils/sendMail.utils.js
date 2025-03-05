import {createTransport} from 'nodemailer'
import { emailTemplate } from '../helper/helper.js';
export const sendMail = async ({email,subject,reset_link,template}) => {
    const transport = createTransport({
        host : "smtp.gmail.com",
        port : 465,
        service : "gmail",
        auth : {
            user : process.env.SMTP_EMAIL,
            pass : process.env.SMTP_PASSWORD
        },
    
    })

    const mailOptions = {
        from : process.env.SMTP_EMAIL,
        to : email,
        subject : subject,
        html : template
    }

    await transport.sendMail(mailOptions);
}