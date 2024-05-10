import { FastifyInstance } from "fastify";
import { knex } from "../db/db"
import { z } from "zod";

const userSchema = z.object({
    name: z.string({required_error: "Name is required"}),
    password: z.string({required_error: "Password is required"}),
    cpf: z.string()
})

export async function userRoutes(app: FastifyInstance){
    app.get('/', async (req,res) => {
        return await knex.from("users").select("*")
    })

    app.delete('/:userId', async (req,res) => {
        return await knex.from("sqlite_master").select("*")
    })
    
    app.post('/', async (req,res) => {
        const { name, password, cpf} = userSchema.parse(req.body);

        await knex.from("users")
        .insert({
            name, 
            password, 
            cpf
        })
        .onConflict('cpf')
        .ignore();
       
        return res.status(201).send()
    })

    app.put('/:userId', async (req,res) => {
        const userParamsSchema = z.object({
            userId: z.string()
        })

        const { userId } = userParamsSchema.parse(req.params);
        const { name, password, cpf } = userSchema.parse(req.body);

        await knex
        .from("users")
        .where({
            id: userId
        })
        .update({
            name, 
            password, 
            cpf
        })

        return res.status(200).send()
    })
}