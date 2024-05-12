import { FastifyInstance } from "fastify";
import { knex } from "../db/db"
import { z } from "zod";

const userSchema = z.object({
    name: z.string({required_error: "Name is required"}),
    password: z.string({required_error: "Password is required"}),
    cpf: z.number()
})

interface MealsExpandSchema {
    id: string,
    name: string,
    cpf: number,
    password: string,
    created_at: string,
    session_id: string,
    description: string,
    in_diet: boolean,
    user_id: string,
    "users.created_at": string,
    "users.name": string
}

export async function userRoutes(app: FastifyInstance){
    app.get('/', async (req,res) => {
        const query = await knex.from("users").select("*")

        const data = query.map(({session_id, ...rest}) => rest)

        return {
            users: data
        }
    })

    // ROUTE WITH EXPAND (Bastante role fazer na mão com query builder)
    app.get('/meals', async (req,res) => {
        const responseQuery: MealsExpandSchema[] = await knex.from("users").innerJoin("meals", "users.id", "=", "meals.user_id").select(["*", "users.created_at as users.created_at", "users.name as users.name"])

        const dataSchema = z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                created_at: z.string(),
                cpf: z.number(),
                meals: z.array(
                    z.object({
                        id: z.string(),
                        name: z.string(),
                        created_at: z.string(),
                        description: z.string(),
                        in_diet: z.boolean(),
                    })
                ),
            })
        )

        const data = responseQuery.reduce((acc, query) => {
            const userExist = acc.find(value => {
                if(query.user_id){
                   return value.id === query.user_id
                }
            })

            if(userExist){
                const { name, created_at, description, in_diet, id} = query
                userExist.meals.push(
                    { 
                        name, 
                        created_at, 
                        description, 
                        in_diet, 
                        id
                    }
                )

                return acc
            }

            const data = {
                id: query.user_id,
                name: query['users.name'],
                created_at: query["users.created_at"],
                cpf: query.cpf,
                meals: [
                    {
                        id: query.id,
                        name: query.name,
                        description: query.description,
                        created_at: query.created_at,
                        in_diet: query.in_diet,
                    }
                ]
            }

            acc.push(data)
            return acc
        }, dataSchema.parse([]))

        return {
            users: data
        }
    })

    app.post('/login', async (req,res) => {
        const { name, password, cpf } = userSchema.parse(req.body)

        const [ userExistent ] = await knex.from("users").where({name, password, cpf}).select("*")

        if(!userExistent){
            return res.status(200).send("User not found")
        }
        
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