import { withIronSessionApiRoute } from "iron-session/next"
import { NextApiRequest, NextApiResponse } from "next"

import { sessionOptions } from "lib/session"
import { prisma } from "lib/prisma"

export type DeleteAPI = {
    ok: boolean
}

export default withIronSessionApiRoute(handle, sessionOptions)

async function handle(req: NextApiRequest, res: NextApiResponse<DeleteAPI>) {
    try {
        // Check request method
        if (req.method !== "POST") throw new Error("Wrong request method")

        // Check auth
        const user = req.session.user
        if (!user) throw new Error("You are not authorized")

        // Check body
        if (!req.body.id) throw new Error("Please provide photo id")

        // Delete post
        const deletedPhoto = await prisma.photo.delete({
            where: {
                id: req.body.id,
            },
        })
        if (!deletedPhoto) throw new Error("Cannot delete photo")

        res.send({ ok: true })
    } catch (err) {
        console.error(
            err instanceof Error ? err.message : "/api/delete: Unknown error"
        )
        res.send({ ok: false })
    }
}
