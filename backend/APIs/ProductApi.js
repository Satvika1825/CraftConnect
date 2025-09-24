const exp=require('express');
const productapp=exp.Router();

productapp.get('/',(req,res)=>{
    res.send({message:"Product API"})
}   )
module.exports=productapp;