import { fastify } from "fastify";
import { env } from "./env";
import { userRoutes } from "./routes/user";

const app = fastify()

app.register(userRoutes, {
    prefix: "users"
})

app.get("/", (req, res) => {
    return res.status(404).send({message: "Query not found in routes"})
})

app.listen({
    port: env.PORT
}, () => {
    console.log("listening on port " + env.PORT)
})