import jwt from 'jsonwebtoken'

import { UnauthenticatedError } from '../errors/index.js'

const authAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid')
    }
    const Atoken = authHeader.split(' ')[1]

    try {
        const paload = jwt.verify(Atoken, process.env.JWT_SECRET)
        req.user = { userId: paload.userId, name: paload.name }
        next()
    } catch (error) {
        console.log(error.message);
    }
}
export default authAdmin