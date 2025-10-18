'use server'

import nodemailer from 'nodemailer';

export async function sendEmail(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error("SMTP credentials are not set in environment variables");
        return { success: false, message: 'Ошибка конфигурации сервера. Пожалуйста, свяжитесь с администратором.' };
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true для 465, false для других портов
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // Verify connection configuration
    await new Promise((resolve, reject) => {
        transporter.verify((error: any, success: any) => {
            if (error) {
                console.log("Error verifying transporter:", error);
                reject(error);
            } else {
                console.log("Server is ready to take our messages");
                resolve(success);
            }
        });
    });

    const mailData = {
        from: `"Портфолио сайт" <${process.env.SMTP_USER}>`,
        to: process.env.RECIPIENT_EMAIL, // Замените на ваш email
        subject: "Новое сообщение с сайта портфолио",
        text: `Имя: ${name}\nEmail: ${email}\nСообщение: ${message}`,
        html: `<p><strong>Имя:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Сообщение:</strong> ${message}</p>`,
    };

    // Send mail
    await new Promise((resolve, reject) => {
        transporter.sendMail(mailData, (err: any, info: any) => {
            if (err) {
                console.error("Error sending email:", err);
                reject(err);
            } else {
                console.log("Message sent: %s", info.messageId);
                resolve(info);
            }
        });
    });

    return { success: true, message: 'Email успешно отправлен!' };
}