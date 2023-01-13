/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('files', {
        id: {
            type: 'varchar(16)',
            primaryKey: true,
            unique: true,
            notNull: true,
        },
        user_id: {
            type: 'varchar(16)',
            notNull: false,
        },
        name: {
            type: 'text',
            notNull: false,
            default: null,
        },
        type: {
            type: 'varchar(50)',
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

    pgm.createIndex('files', ['id']);
    pgm.addConstraint('files', 'fk_files.users.id', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users(id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
    });
};

exports.down = (pgm) => {
    pgm.dropConstraint('files', 'fk_files.users.id');
    pgm.dropTable('files');
};