const exp=require('express');
const userapp=exp.Router();
const expressAsyncHandler=require('express-async-handler');
const userModel=require('../Models/UserModel');
//API
userapp.post('/user',expressAsyncHandler(async(req,res)=>{
    const newuser=req.body;
    const userindb=await userModel.findOne({email:newuser.email})
    //if user exits
    if(userindb!==null){
        if(newuser.role===userindb.role){
            res.status(200).send({message:newuser,user:userindb})
        }else{
            res.status(200).send({message:"Email already registered with different role"})
        }
}else{
    const createduser=new userModel(newuser);
    let newuserdoc=await createduser.save();
    res.status(201).send({message:newuserdoc,payload:newuserdoc})
}
}) )

module.exports=userapp;