/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('files', function (table) {
            table.string('id', 16).primary().unique().notNullable();
            table.string('user_id', 16).nullable();
            table.string('name', 255).notNullable();
            table.text('url').nullable().defaultTo(null);
            table.string('type', 50).nullable().defaultTo(null);
            table.timestamp('created_at').nullable().defaultTo(knex.fn.now());
            table.timestamp('updated_at').nullable().defaultTo(knex.fn.now());
            table.timestamp('deleted_at').nullable().defaultTo(null);

            table.foreign('user_id').references('users.id').onDelete('SET NULL').onUpdate('CASCADE');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('files');
};