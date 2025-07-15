import { Request, Response, NextFunction } from "express";
import { UserPayload } from "../Types";
 import  jwt, { VerifyErrors,JwtPayload }  from "jsonwebtoken";
function verifyUser(req: Request, res: Response, next: NextFunction) {
    const { authToken }= req.cookies
    if(!authToken){
        res.status(401).json({message:'Unauthorised. Kindly log in'})
        return
    }
jwt.verify(authToken,process.env.JWT_SECRET !,(err: VerifyErrors|null ,
    
    decoded :JwtPayload|string|undefined)=>{
        if(err){
            res.status(401).json({message:'unauthorised .Kinly log in'})
            return
        }
        req.user=decoded as UserPayload
        next();
    }) 
 
}

export default verifyUser;
