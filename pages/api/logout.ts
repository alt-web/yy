import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session'

export default withIronSessionApiRoute(
    async function logoutRoute(req, res) {
        req.session.destroy()
        res.send({ ok: true })
    }, 
    sessionOptions
);
