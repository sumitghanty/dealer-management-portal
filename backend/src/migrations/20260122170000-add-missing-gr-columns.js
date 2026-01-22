'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const table = 'goods_receipts';

        // Helper to add column safely
        const addCol = async (colName, definition) => {
            try {
                await queryInterface.addColumn(table, colName, definition);
            } catch (e) {
                console.log(`Skipping addition of ${colName}, might already exist.`);
            }
        };

        await addCol('poNumber', { type: Sequelize.STRING, allowNull: true });
        await addCol('poItem', { type: Sequelize.STRING, allowNull: true });
        await addCol('supplierId', { type: Sequelize.STRING, allowNull: true });
        await addCol('materialCode', { type: Sequelize.STRING, allowNull: true });
        await addCol('quantity', { type: Sequelize.FLOAT, allowNull: true });
        await addCol('unit', { type: Sequelize.STRING, allowNull: true });
        await addCol('netPrice', { type: Sequelize.FLOAT, allowNull: true });
        await addCol('plant', { type: Sequelize.STRING, allowNull: true });
        await addCol('storageLocation', { type: Sequelize.STRING, allowNull: true });
        await addCol('batch', { type: Sequelize.STRING, allowNull: true });
        await addCol('costCenterId', { type: Sequelize.STRING, allowNull: true });
        await addCol('grDate', { type: Sequelize.DATE, allowNull: true });
        await addCol('status', { type: Sequelize.STRING, allowNull: false, defaultValue: 'pending' });
        await addCol('mblnr', { type: Sequelize.STRING, allowNull: true });
    },

    async down(queryInterface, Sequelize) {
        const table = 'goods_receipts';
        await queryInterface.removeColumn(table, 'poNumber');
        await queryInterface.removeColumn(table, 'poItem');
        await queryInterface.removeColumn(table, 'supplierId');
        await queryInterface.removeColumn(table, 'materialCode');
        await queryInterface.removeColumn(table, 'quantity');
        await queryInterface.removeColumn(table, 'unit');
        await queryInterface.removeColumn(table, 'netPrice');
        await queryInterface.removeColumn(table, 'plant');
        await queryInterface.removeColumn(table, 'storageLocation');
        await queryInterface.removeColumn(table, 'batch');
        await queryInterface.removeColumn(table, 'costCenterId');
        await queryInterface.removeColumn(table, 'grDate');
        await queryInterface.removeColumn(table, 'status');
        await queryInterface.removeColumn(table, 'mblnr');
    }
};
