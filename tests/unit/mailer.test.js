const { sendOrderConfirmation, sendStatusUpdate } = require('../../utils/mailer');

jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue({ response: 'Success' })
    })
}));

describe('Mailer Utils Test', () => {
        const order = {
            _id: '12345',
            customerEmail: 'test@example.com',
            customerName: 'Test User',
            totalAmount: 100,
            products: []
        };

        await expect(sendOrderConfirmation(order)).resolves.not.toThrow();
    });

        const order = {
            _id: '12345',
            customerEmail: 'test@example.com',
            customerName: 'Test User',
            status: 'відправлено'
        };

        await expect(sendStatusUpdate(order)).resolves.not.toThrow();
    });
});
