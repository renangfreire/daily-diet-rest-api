import { knex as setupKnex, Knex} from 'knex'
import { env } from '../env'

export const knexConfig: Knex.Config = {
    client: env.DATABASE_PROVIDER,
    connection: {
        filename: env.DATABASE_URL
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: "./src/db/migrations"
    }
}

export const knex = setupKnex(knexConfig)
