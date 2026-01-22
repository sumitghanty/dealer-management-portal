const { sequelize, Dealer, Order, GoodsReceipt, User } = require('../src/models');
const { Op } = require('sequelize');

async function debugRanchiOrder() {
    try {
        console.log('--- Debugging Ranchi Dealer Orders ---');

        // 1. Find the Ranchi Dealer
        const dealers = await Dealer.findAll({
            where: {
                [Op.or]: [
                    { businessName: { [Op.iLike]: '%Ranchi%' } },
                    { city: { [Op.iLike]: '%Ranchi%' } },
                    { dealerCode: { [Op.iLike]: '%Ranchi%' } } // Just in case
                ]
            }
        });

        if (dealers.length === 0) {
            console.log('❌ No dealer found with "Ranchi" in name or city.');
            return;
        }

        for (const dealer of dealers) {
            console.log(`\n📍 Found Dealer: ${dealer.businessName} (ID: ${dealer.id})`);
            console.log(`   - City: ${dealer.city}`);
            console.log(`   - Manager ID: ${dealer.managerId}`);

            // Check Manager info
            if (dealer.managerId) {
                const manager = await User.findByPk(dealer.managerId);
                console.log(`   - Manager Name: ${manager ? manager.username : 'Unknown'} (${manager ? manager.role : 'N/A'})`);
            } else {
                console.log(`   - ⚠️ No Manager Assigned`);
            }

            // 2. Find Orders for this Dealer
            const orders = await Order.findAll({
                where: { dealerId: dealer.id },
                order: [['createdAt', 'DESC']]
            });

            console.log(`   - Total Orders: ${orders.length}`);

            if (orders.length === 0) {
                console.log('   - No orders found.');
                continue;
            }

            for (const order of orders) {
                console.log(`\n   📦 Order #${order.orderNumber} (ID: ${order.id})`);
                console.log(`      - Status: ${order.status}`);
                console.log(`      - Created At: ${order.createdAt}`);

                // 3. Find Goods Receipts for this Order
                const grs = await GoodsReceipt.findAll({
                    where: { orderId: order.id }
                });

                if (grs.length > 0) {
                    for (const gr of grs) {
                        console.log(`      📄 Goods Receipt: ${gr.receiptNumber}`);
                        console.log(`         - Status: ${gr.status}`);
                        console.log(`         - Created At: ${gr.createdAt}`);
                    }
                } else {
                    console.log(`      - ❌ No Goods Receipt found.`);
                }
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

debugRanchiOrder();
