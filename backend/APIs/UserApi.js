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
// ---------------- GET /users/:id → Get profile details ----------------
userapp.get('/users/:id', expressAsyncHandler(async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));

// ---------------- PUT /users/:id → Update profile info ----------------
userapp.put('/users/:id', expressAsyncHandler(async (req, res) => {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // returns updated doc + validates schema
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));

// ---------------- DELETE /users/:id → Delete account ----------------
userapp.delete('/users/:id', expressAsyncHandler(async (req, res) => {
    try {
        const deletedUser = await userModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));

module.exports=userapp;