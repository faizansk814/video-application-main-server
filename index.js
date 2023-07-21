const express=require('express')
const connection=require('./connection/db')
const userRouter = require('./routes/user.router')
const authrouter = require('./routes/auth.router')
const cors=require('cors')
const app=express()
app.use(express.json())
app.use(cors())
app.use("/user",userRouter)
app.use("/auth",authrouter)

app.get("/start",(req,res)=>{
    res.status(200).send({msg:"start the server"})
})
app.listen(8080,async ()=>{
    try {
        await connection
        console.log("connected") 
    } catch (error) {
        console.log(error)
    }
    console.log("running at 8080")
})