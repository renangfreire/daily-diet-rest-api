import { config } from 'dotenv'
import { z } from 'zod'

config()

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
    PORT: z.coerce.number(),
    DATABASE_URL: z.string(),
    DATABASE_PROVIDER: z.enum(['sqlite', 'pg'])
})

const _env = envSchema.safeParse(process.env)

if(!_env.success){
    console.log("ERROR IN DOTENV ON RUN SERVER: ", _env.error.format())
    throw new Error("Error on RUN SERVER")
}

export const env = _env.data