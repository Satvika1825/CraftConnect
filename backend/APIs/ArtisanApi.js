const exp=require('express');
const artisanapp=exp.Router();

artisanapp.get('/',(req,res)=>{
    res.send({message:"Artisan API"})
}   )

module.exports=artisanapp;