const exp=require('express');
const adminapp=exp.Router();

//API
adminapp.get('/',(req,res)=>{
    res.send({message:"Admin API"})
})

module.exports=adminapp;