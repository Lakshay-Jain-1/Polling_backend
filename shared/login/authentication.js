import express from "express"
import { UserModel } from "../../modules/models/user-schema.js"
import { generateToken } from "../Token/token.js"

const loginRouter = express.Router()

// schema mein user and password se 



loginRouter.post("/",async(req,res)=>{
    try{
    const {name,password}= req.body
    let user_data = await UserModel.find({name,password})
    console.log(user_data)
    if(user_data.length==0){
      res.cookie("success",false,{secure:true,sameSite:"none",expires:new Date(Date.now() +  10*9000), path:"/"}).json({"success":false})
    }else{
    let token =  generateToken(user_data)
      res.cookie("token",token,{secure:true,sameSite:"none",expires:new Date(Date.now() +  10*9000),path:"/"}).cookie("success",true,{secure:true,sameSite:"none",path:"/"}).json({"success":true})
    }
    }catch(err){
      console.log("failed")
          res.cookie("success",false,{secure:true,sameSite:"none",expires:new Date(Date.now() +  10*9000),path:"/"}).json({"success":false})
    }

})



export default loginRouter