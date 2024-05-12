import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("users", (table) => {
        table.unique(["cpf"])
    })
}

export async function down(knex: Knex): Promise<void> {
     await knex.schema.alterTable("users", (table) => {
            table.dropUnique(["cpf"])
    })
}

