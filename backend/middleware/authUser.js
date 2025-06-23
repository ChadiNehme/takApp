import jwt from 'jsonwebtoken'

import { UnauthenticatedError } from '../errors/index.js'

const authUser = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid')
    }
    const token = authHeader.split(' ')[1]

    try {
        const paload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { userId: paload.userId, name: paload.name }
        next()
    } catch (error) {
        console.log(error.message);
        

    }
}
export default authUser