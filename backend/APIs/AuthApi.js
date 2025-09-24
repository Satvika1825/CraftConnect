const exp=require('express');
const authapp=exp.Router();

authapp.get('/',(req,res)=>{
    res.send({message:"Auth API"})
}   )

module.exports=authapp;