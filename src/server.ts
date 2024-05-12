import { fastify } from "fastify";
import fastifyCookie from "@fastify/cookie";

import { env } from "./env";
import { userRoutes } from "./routes/user";
import { mealsRoutes } from "./routes/meals";

const app = fastify()

app.register(fastifyCookie)

app.register(userRoutes, {
    prefix: "users"
})

app.register(mealsRoutes, {
    prefix: "meals",
})

app.get("/", (req, res) => {
    return res.status(404).send({message: "Query not found in routes"})
})

app.setErrorHandler((error, req, res) => {
    const errorPossibleJSON = JSON.parse(error.message)
    if(errorPossibleJSON){
        error.message = errorPossibleJSON
    }

    res.status(400).send({message: error.message})
})

app.listen({
    port: env.PORT
}, () => {
    console.log("listening on port " + env.PORT)
})