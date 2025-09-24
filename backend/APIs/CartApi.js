const exp=require('express');
const cartapp=exp.Router();

cartapp.get('/',(req,res)=>{
    res.send({message:"Cart API"})
}   )
module.exports=cartapp;