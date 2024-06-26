import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.string("name").notNullable()
        table.integer("cpf", 11).notNullable()
        table.string("password").notNullable()
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now())
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("users")
}

