const exp=require('express');
const userapp=exp.Router();

//API
userapp.get('/',(req,res)=>{
    res.send({message:"User API"})
})

module.exports=userapp;