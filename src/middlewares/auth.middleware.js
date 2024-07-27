import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

export const verifyJWT = async (req,res,next) => {
    // it will use to make secured routes
    try {
        const token = req?.cookie?.accessToken;
    
        if(!token){
            res.status(400).json({
                "message":"Unauthorized request, Invalid Token"
            });
            next();
        }
    
        const tokenInfo = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(tokenInfo._id);
    
        if(!user){
    
        }
        req.user=user;
        next();
    } catch (error) {
        throw error;
    }
}