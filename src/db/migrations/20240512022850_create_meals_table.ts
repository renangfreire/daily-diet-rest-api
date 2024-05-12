import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("meals", (table) => {
        table.uuid("id").primary().notNullable().defaultTo(knex.fn.uuid());
        table.string("name").notNullable();
        table.string("description")
        table.string("created_at").defaultTo(knex.fn.now())
        table.boolean("in_diet").notNullable();
        table.uuid("user_id").references("id").inTable("users").unsigned();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("meals")
}

