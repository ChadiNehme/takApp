import jwt from 'jsonwebtoken'
import { UnauthenticatedError } from '../errors/index.js'

const authCoach = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid')
    }

    const Ctoken = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(Ctoken, process.env.JWT_SECRET)
        req.coach = { coachId: payload.coachId, name: payload.name }
        return next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication failed')
    }
}

export default authCoach
