const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOrderConfirmation = async (order) => {
    const mailOptions = {
        from: `${process.env.STORE_NAME} <${process.env.STORE_EMAIL}>`,
        to: order.customerEmail,
        subject: `Замовлення ${order._id} підтверджено`,
        html: `
            <h1>Дякуємо за ваше замовлення!</h1>
            <p>Шановний(а) ${order.customerName},</p>
            <p>Ваше замовлення було успішно оформлено.</p>
            
            <h2>Деталі замовлення:</h2>
            <p><strong>Номер замовлення:</strong> ${order._id}</p>
            <p><strong>Статус:</strong> ${order.status}</p>
            <p><strong>Сума:</strong> ${order.totalAmount} ₴</p>
            
            <h3>Товари:</h3>
            <ul>
                ${order.products.map(item => `
                    <li>${item.product.name} x ${item.quantity} - ${item.product.price * item.quantity} ₴</li>
                `).join('')}
            </ul>
            
            <h3>Інформація про доставку:</h3>
            <p><strong>Спосіб доставки:</strong> ${order.deliveryMethod}</p>
            <p><strong>Адреса:</strong> ${order.address}</p>
            ${order.deliveryDetails ? `<p><strong>Деталі доставки:</strong> ${order.deliveryDetails}</p>` : ''}
            
            <p>Ми повідомимо вас про зміну статусу замовлення.</p>
            
            <p>З повагою,<br>Команда ${process.env.STORE_NAME}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Order confirmation email sent to ${order.customerEmail}`);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
};

const sendStatusUpdate = async (order) => {
    const statusMessages = {
        'прийнято': 'Ваше замовлення прийнято та готується до обробки',
        'оплачено': 'Оплату за ваше замовлення отримано',
        'в обробці': 'Ваше замовлення зараз обробляється',
        'відправлено': 'Ваше замовлення відправлено',
        'доставлено': 'Ваше замовлення доставлено'
    };

    const mailOptions = {
        from: `${process.env.STORE_NAME} <${process.env.STORE_EMAIL}>`,
        to: order.customerEmail,
        subject: `Оновлення статусу замовлення ${order._id}`,
        html: `
            <h1>Оновлення статусу замовлення</h1>
            <p>Шановний(а) ${order.customerName},</p>
            <p>${statusMessages[order.status] || `Статус вашого замовлення змінено на: ${order.status}`}</p>
            
            <h2>Деталі замовлення:</h2>
            <p><strong>Номер замовлення:</strong> ${order._id}</p>
            <p><strong>Новий статус:</strong> ${order.status}</p>
            
            <p>Якщо у вас виникли питання, будь ласка, зв'яжіться з нами.</p>
            
            <p>З повагою,<br>Команда ${process.env.STORE_NAME}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Status update email sent to ${order.customerEmail}`);
    } catch (error) {
        console.error('Error sending status update email:', error);
    }
};

module.exports = {
    sendOrderConfirmation,
    sendStatusUpdate
};