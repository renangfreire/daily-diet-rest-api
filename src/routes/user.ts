import { FastifyInstance } from "fastify";
import { knex } from "../db/db"
import { z } from "zod";

const userSchema = z.object({
    name: z.string({required_error: "Name is required"}),
    password: z.string({required_error: "Password is required"}),
    cpf: z.number()
})

export async function userRoutes(app: FastifyInstance){
    app.get('/', async (req,res) => {
        const query = await knex.from("users").select("*")
        return query.map(({session_id, ...rest}) => rest)
    })

    app.post('/login', async (req,res) => {
        const { name, password, cpf } = userSchema.parse(req.body)

        const [ userExistent ] = await knex.from("users").where({name, password, cpf}).select("*")

        if(!userExistent){
            return res.status(200).send("User not found")
        }
""
        res.cookie("SESSION_ID", userExistent.session_id, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })
    
        return res.status(200).send("User Logged successfully") 
    })

    app.delete('/:userId', async (req,res) => {
        const userParamsSchema = z.object({
            userId: z.string()
        })
        
        const { userId } = userParamsSchema.parse(req.params)

        await knex.from("users").where({id: userId}).delete()
        
        return res.status(204).send()
    })
    
    app.post('/', async (req,res) => {
        const { name, password, cpf} = userSchema.parse(req.body);

        const session_id = crypto.randomUUID()

        try {
            await knex("users")
            .insert({
                name, 
                password, 
                cpf,
                session_id,
            })
        } catch (error) {
            return res.status(409).send()
        }

        res.cookie("SESSION_ID", session_id, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })

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

        return res.status(204).send()
    })
}