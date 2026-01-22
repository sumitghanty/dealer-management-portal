const { sequelize, Order } = require('../src/models');
const { Op } = require('sequelize');

async function fixRanchiOrderStatus() {
    try {
        console.log('--- Reverting Ranchi Delivered Orders to Shipped ---');

        // 1. Find Orders for Ranchi Dealer that are 'Delivered' but have NO GR (we assume no GR based on previous check)
        // For safety, we will just target the specific order if known, or all Delivered ones for this dealer.
        // Let's first search for them.

        // We need to find the dealer ID first effectively.
        // Assuming we know it's the "Ranchi" one.
        const dealers = await sequelize.models.Dealer.findAll({
            where: { businessName: { [Op.iLike]: '%Ranchi%' } }
        });

        if (dealers.length === 0) {
            console.log('❌ Ranchi dealer not found');
            return;
        }
        const dealerId = dealers[0].id;
        console.log(`📍 Targeting Dealer: ${dealers[0].businessName} (${dealerId})`);

        const orders = await Order.findAll({
            where: {
                dealerId: dealerId,
                status: 'Delivered'
            }
        });

        console.log(`   Found ${orders.length} 'Delivered' orders.`);

        for (const order of orders) {
            console.log(`   🔄 Reverting Order #${order.orderNumber} (ID: ${order.id}) from 'Delivered' to 'Shipped'`);
            order.status = 'Shipped';
            await order.save();
            console.log(`      ✅ Done.`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

fixRanchiOrderStatus();
