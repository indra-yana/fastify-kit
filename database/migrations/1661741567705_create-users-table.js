/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('users', {
        id: {
            type: 'varchar(16)',
            primaryKey: true,
            unique: true,
            notNull: true,
        },
        name: {
            type: 'varchar(255)',
            notNull: false,
        },
        username: {
            type: 'varchar(191)',
            notNull: false,
            unique: true,
        },
        email: {
            type: 'varchar(191)',
            unique: true,
            notNull: true,
        },
        password: {
            type: 'text',
            notNull: true,
        },
        avatar: {
            type: 'text',
            notNull: false,
            default: null,
        },
        email_verified_at: {
            type: 'timestamp',
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
        deleted_at: {
            type: 'timestamp',
            notNull: false,
            default: null,
        },
    });

    pgm.createIndex('users', ['id']);
};

exports.down = (pgm) => {
    pgm.dropTable('users');
};