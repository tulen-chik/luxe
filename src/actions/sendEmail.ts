'use server'

import nodemailer from 'nodemailer';

export async function sendEmail(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const files = formData.getAll('files') as File[]; // Получаем все файлы как массив

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error("SMTP credentials are not set in environment variables");
        return { success: false, message: 'Ошибка конфигурации сервера. Пожалуйста, свяжитесь с администратором.' };
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        await transporter.verify();
        console.log("Server is ready to take our messages");
    } catch (error) {
        console.log("Error verifying transporter:", error);
        return { success: false, message: 'Ошибка конфигурации сервера. Пожалуйста, свяжитесь с администратором.' };
    }

    const mailData: any = {
        from: `"Лампы сайт" <${process.env.SMTP_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        subject: "Новое сообщение с сайта ламп",
        text: `Имя: ${name}\nEmail: ${email}\nТелефон: ${phone || 'Не указан'}\nСообщение: ${message}`,
        html: `<p><strong>Имя:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Телефон:</strong> ${phone || 'Не указан'}</p>
               <p><strong>Сообщение:</strong> ${message}</p>`,
        attachments: []
    };

    // Обрабатываем каждый файл в цикле
    if (files && files.length > 0) {
        for (const file of files) {
            // Пропускаем пустые файлы, которые могут быть отправлены, если инпут пуст
            if (file.size > 0) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                mailData.attachments.push({
                    filename: file.name,
                    content: buffer,
                    contentType: file.type,
                });
            }
        }
    }

    try {
        const info = await transporter.sendMail(mailData);
        console.log("Message sent: %s", info.messageId);
        return { success: true, message: 'Email успешно отправлен!' };
    } catch (err) {
        console.error("Error sending email:", err);
        return { success: false, message: 'Не удалось отправить email. Пожалуйста, попробуйте еще раз.' };
    }
}