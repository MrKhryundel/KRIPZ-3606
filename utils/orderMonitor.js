const schedule = require('node-schedule');
const Order = require('../models/Order');
const { sendStatusUpdate } = require('./mailer');

const updateOrderSchema = async () => {
    try {
        await Order.collection.updateMany(
            {},
            { 
                $set: { 
                    systemStatus: {
                        'прийнято': true,
                        'оплачено': false,
                        'в обробці': false,
                        'відправлено': false,
                        'доставлено': false
                    }
                } 
            },
            { upsert: true }
        );
    } catch (error) {
        console.error('Error updating order schema:', error);
    }
};

const monitorOrders = async () => {
    try {
        const orders = await Order.find({
            status: { $ne: 'доставлено' }
        });

        for (const order of orders) {
            const timeSinceCreation = Date.now() - order.createdAt.getTime();
            const hoursElapsed = timeSinceCreation / (1000 * 60 * 60);

            let newStatus = order.status;

            if (hoursElapsed >= 0 && order.status !== 'прийнято') {
                newStatus = 'прийнято';
            }
            if (hoursElapsed >= 1 && order.status !== 'оплачено') {
                newStatus = 'оплачено';
            }
            if (hoursElapsed >= 2 && order.status !== 'в обробці') {
                newStatus = 'в обробці';
            }
            if (hoursElapsed >= 3 && order.status !== 'відправлено') {
                newStatus = 'відправлено';
            }
            if (hoursElapsed >= 4 && order.status !== 'доставлено') {
                newStatus = 'доставлено';
            }

            if (newStatus !== order.status) {
                await Order.updateOne(
                    { _id: order._id },
                    { 
                        $set: { 
                            status: newStatus,
                            lastStatusUpdate: new Date()
                        },
                        $push: {
                            statusHistory: {
                                status: newStatus,
                                timestamp: new Date(),
                                note: 'Статус оновлено автоматично'
                            }
                        }
                    }
                );
                
                const updatedOrder = await Order.findById(order._id);
                await sendStatusUpdate(updatedOrder);
            }
        }
    } catch (error) {
        console.error('Error monitoring orders:', error);
    }
};

const startMonitoring = () => {
    updateOrderSchema();
    schedule.scheduleJob('*/30 * * * * *', monitorOrders);
    console.log('Order monitoring started');
};

module.exports = {
    startMonitoring
};