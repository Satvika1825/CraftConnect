const exp=require('express');
const orderapp=exp.Router();

orderapp.get('/',(req,res)=>{
    res.send({message:"Orders API"})
}   )
module.exports=orderapp;