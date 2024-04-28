import { FastifyInstance } from "fastify";
import { knex } from "../db/db"

export async function userRoutes(app: FastifyInstance){
    app.get('/', async (req,res) => {
        return await knex.from("sqlite_master").select("*")
    })
}