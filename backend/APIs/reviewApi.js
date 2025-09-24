const exp=require('express');
const reviewapp=exp.Router();
reviewapp.get('/',(req,res)=>{
    res.send({message:"Review API"})
}   )
module.exports=reviewapp;