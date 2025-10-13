const exp=require('express');
const app=exp();
require('dotenv').config();//config takes the var and place in the process.env
const userapp = require('./APIs/UserApi');
const adminapp = require('./APIs/AdminApi');
const artisanapp = require('./APIs/ArtisanApi');
const authapp = require('./APIs/AuthApi');
const productapp = require('./APIs/ProductApi');
const cartapp = require('./APIs/CartApi');
const orderapp = require('./APIs/OrdersApi');   
const reviewapp = require('./APIs/reviewApi');
const likeapp = require('./APIs/LikeApi');

const port=process.env.PORT ;

const mongoose=require('mongoose');
const { activityapp } = require('./APIs/ActivityApi');

//connect to db
mongoose.connect(process.env.DBURL)
.then(()=>{
    app.listen(port,()=>console.log(`server is running on port ${port}....`))
    console.log("connected to db");
})
    
.catch(err=>console.log("error in db connection",err));

app.use(exp.json());//to convert all incoming req data to json format

//APIs
app.use('/user-api',userapp)
app.use('/admin-api',adminapp)
app.use('/artisan-api',artisanapp)
app.use('/auth-api',authapp)
app.use('/product-api',productapp)
app.use('/cart-api',cartapp)
app.use('/order-api',orderapp)
app.use('/review-api',reviewapp)
app.use('/like-api',likeapp)
app.use('/activity-api',activityapp)