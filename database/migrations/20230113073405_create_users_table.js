/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.string('id', 16).primary().unique().notNullable();
            table.string('name', 255).notNullable();
            table.string('username', 191).unique().notNullable();
            table.string('email', 191).unique().notNullable();
            table.text('password').notNullable();
            table.string('avatar', 255).nullable().defaultTo(null);
            table.timestamp('email_verified_at').nullable().defaultTo(null);
            table.timestamp('created_at').nullable().defaultTo(knex.fn.now());
            table.timestamp('updated_at').nullable().defaultTo(knex.fn.now());
            table.timestamp('deleted_at').nullable().defaultTo(null);
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('users');
};