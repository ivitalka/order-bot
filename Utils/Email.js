require('dotenv').config({ path: __dirname + '/.env' });
const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
})

async function sendMail(result) {
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: process.env.EMAIL,
        cc: process.env.CC,
        subject: 'Заявка на перезвон',
        text: `Номер телефона ${result.phone}, Время ${result.time}`,
        html:
            `<h2>Заявка на перезвон</h2>
            <ul>
            <li>Номер телефона: ${result.phone}</li>
            <li>Номер заявки: ${result.order}</li>
            <li>Время: ${result.time}</li>
            </ul>
            <p><i>Сообщение отправлено с помощью <a href="${proccess.env.BOT_LINK}">${proccess.env.BOT_NAME}</a></i></p>`,
    })
}

module.exports = { sendMail };
