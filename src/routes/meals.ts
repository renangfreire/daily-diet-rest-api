import { verifyUserLogged } from "../middlewares/verifyUserLogged";
import { FastifyInstance } from "fastify";
import { knex } from "../db/db";
import { z } from "zod";

const mealsBodySchema = z.object({
    name: z.string({required_error: "Name is required"}),
    description: z.string(),
    in_diet: z.boolean({required_error: "Diet status is required"}),
    user_id: z.string({required_error: "User assigned is required"})
})

export async function mealsRoutes(app: FastifyInstance){
    app.addHook("preHandler", verifyUserLogged)
    
    app.get('/', async (req,res) => {
        return await knex.from("meals").select("*")
    })

    app.post('/', async (req,res) => {
        const { description, in_diet, name, user_id} = mealsBodySchema.parse(req.body)

        await knex.from("meals").insert({
            description,
            in_diet, 
            name, 
            user_id
        })

        return res.status(201).send()
    })
}