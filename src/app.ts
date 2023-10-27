import express, { NextFunction,Request, Response} from "express";
import createHttpError, { HttpError } from "http-errors";
import logger from "./config/logger";

const app=express()


// for checking error handling
// app.get("/",(req,res)=>
// {
//      const newErr=createHttpError(401,"You are not authorized");
//      throw newErr
// })

// global error handling middleware
app.use((err:HttpError,req:Request,res:Response,next:NextFunction)=>
{
    logger.error(err.message)
    const statusCode= err.statusCode || 500;
    res.status(statusCode).json({
        errors:[
            {
                type:err.name,
                msg:err.message,
                path:"",
                location:""
            }
        ]
    })
})
export default app;