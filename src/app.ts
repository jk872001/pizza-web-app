import "reflect-metadata"
import express, { NextFunction,Request, Response} from "express";
import  { HttpError } from "http-errors";
import logger from "./config/logger";
import authRouter from "./routes/auth"
import tenantRouter from "./routes/tenant";
import cookieParser from "cookie-parser";
const app=express()

// to accept the json data we have to use this middleware
app.use(express.json())

app.use(cookieParser());
app.use(express.static("public"));


// for checking error handling
// app.get("/",(req,res)=>
// {
//      const newErr=createHttpError(401,"You are not authorized");
//      throw newErr
// })

app.get('/',(req,res)=>
{
    res.send("Welcome in Auth Service")
})

app.use("/auth",authRouter)
app.use("/tenants", tenantRouter);

// global error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err:HttpError,req:Request,res:Response,next:NextFunction)=>
{
    logger.error(err.message)
    const statusCode= err.statusCode || err.status || 500;
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



