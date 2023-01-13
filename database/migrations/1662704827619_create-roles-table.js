/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('roles', {
        id: {
            type: 'varchar(16)',
            primaryKey: true,
            unique: true,
            notNull: true,
        },
        name: {
            type: 'varchar(191)',
            notNull: false,
            default: null,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.createIndex('roles', ['id']);
};

exports.down = (pgm) => {
    pgm.dropTable('roles');
};