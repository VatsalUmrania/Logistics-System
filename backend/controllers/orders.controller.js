const db = require('../config/database');

const getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.query(
            'SELECT * FROM orders ORDER BY created_at DESC'
        );
        res.json(orders);
    } catch (error) {
        console.error('Error in getAllOrders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const [order] = await db.query(
            'SELECT * FROM orders WHERE id = ?',
            [req.params.id]
        );

        if (order.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const [orderItems] = await db.query(
            `SELECT oi.*, i.item_name, i.unit_price 
             FROM order_items oi 
             JOIN inventory i ON oi.inventory_id = i.id 
             WHERE oi.order_id = ?`,
            [req.params.id]
        );

        res.json({
            ...order[0],
            items: orderItems
        });
    } catch (error) {
        console.error('Error in getOrderById:', error);
        res.status(500).json({ message: 'Error fetching order' });
    }
};

const createOrder = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { customer_name, shipping_address, items } = req.body;
        let total_amount = 0;

        for (const item of items) {
            const [inventory] = await connection.query(
                'SELECT quantity, unit_price FROM inventory WHERE id = ? FOR UPDATE',
                [item.inventory_id]
            );

            if (inventory.length === 0) {
                throw new Error(`Item ${item.inventory_id} not found`);
            }

            if (inventory[0].quantity < item.quantity) {
                throw new Error(`Insufficient quantity for item ${item.inventory_id}`);
            }

            total_amount += item.quantity * inventory[0].unit_price;
        }

        const [orderResult] = await connection.query(
            'INSERT INTO orders (customer_name, shipping_address, total_amount, status) VALUES (?, ?, ?, "pending")',
            [customer_name, shipping_address, total_amount]
        );

        for (const item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, inventory_id, quantity, unit_price) VALUES (?, ?, ?, (SELECT unit_price FROM inventory WHERE id = ?))',
                [orderResult.insertId, item.inventory_id, item.quantity, item.inventory_id]
            );

            await connection.query(
                'UPDATE inventory SET quantity = quantity - ? WHERE id = ?',
                [item.quantity, item.inventory_id]
            );
        }

        await connection.commit();
        res.status(201).json({
            message: 'Order created successfully',
            orderId: orderResult.insertId
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error in createOrder:', error);
        res.status(500).json({ message: error.message });
    } finally {
        connection.release();
    }
};

const updateOrder = async (req, res) => {
    try {
        const { status } = req.body;
        const [result] = await db.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Order updated successfully' });
    } catch (error) {
        console.error('Error in updateOrder:', error);
        res.status(500).json({ message: 'Error updating order' });
    }
};

const deleteOrder = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [orderItems] = await connection.query(
            'SELECT inventory_id, quantity FROM order_items WHERE order_id = ?',
            [req.params.id]
        );

        for (const item of orderItems) {
            await connection.query(
                'UPDATE inventory SET quantity = quantity + ? WHERE id = ?',
                [item.quantity, item.inventory_id]
            );
        }

        await connection.query(
            'DELETE FROM order_items WHERE order_id = ?',
            [req.params.id]
        );

        const [result] = await connection.query(
            'DELETE FROM orders WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            throw new Error('Order not found');
        }

        await connection.commit();
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error in deleteOrder:', error);
        res.status(500).json({ message: error.message });
    } finally {
        connection.release();
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};