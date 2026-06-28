import {Resend} from 'resend'
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.RESEND_API_KEY) {
    console.log("Provide RESEND_API in side the .env file");
}

const resend = new Resend(process.env.RESEND_API_KEY)
const sendEmail = async ({name, sendTo, html, subject}) => {
    try {

        const {data, error} = await resend.emails.send({
            from : "My-task <onboarding@resend.dev>",
            subject : subject,
            to : sendTo,
            html : html
        })
        if (error) {
            return console.log(error);    
        }
        return data
        
    } catch (error) {
        console.log(error.message); 
    }
}
 export default sendEmail
