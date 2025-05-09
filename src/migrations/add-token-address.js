'use strict';

/**
 * Migration to add tokenAddress field to crypto-projects collection
 */
module.exports = {
  async up(knex) {
    // Add tokenAddress column to the crypto_projects table
    await knex.schema.alterTable('crypto_projects', table => {
      table.string('token_address').after('chain_type');
    });
  },

  async down(knex) {
    // Drop tokenAddress column in case of rollback
    await knex.schema.alterTable('crypto_projects', table => {
      table.dropColumn('token_address');
    });
  }
};