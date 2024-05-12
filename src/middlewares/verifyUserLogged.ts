import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyUserLogged(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const session_id = req.cookies.SESSION_ID;

    if(!session_id) {
       return res.status(401).send()
    }
}