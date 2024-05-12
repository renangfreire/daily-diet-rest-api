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

    app.put('/:mealId', async (req,res) => {
        const session_id = req.cookies.SESSION_ID

        const paramsSchema = z.object({
            mealId: z.string()
        })

        const { mealId } = paramsSchema.parse(req.params)

        const mealsUpdateSchema = z.object({
            name: z.string({required_error: "Name is required"}),
            description: z.string(),
            in_diet: z.boolean({required_error: "Diet status is required"}),
        })
        
        const { description, in_diet, name} = mealsUpdateSchema.parse(req.body)

        await knex.from("meals")
        .where({id: mealId})
        .whereIn("user_id", function () {this.select("id").from("users").where({session_id})})
        .update({
            description, 
            in_diet, 
            name
        })

        return res.status(204).send()
    })

    app.delete('/:mealId', async (req,res) => {
        const session_id = req.cookies.SESSION_ID

        const paramsSchema = z.object({
            mealId: z.string()
        })

        const { mealId } = paramsSchema.parse(req.params)

        await knex.from("meals")
        .where({id: mealId})
        .whereIn("user_id", function () {this.select("id").from("users").where({session_id})})
        .delete()

        return res.status(204).send()
    })
}