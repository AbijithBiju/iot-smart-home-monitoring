uri = 'mongodb+srv://iot_smart_home:OgAMxbNv2p7keCWx@cluster0.gdyk8yu.mongodb.net/?retryWrites=true&w=majority'
require('dotenv').config()
const mongoose = require('mongoose')

// place MONGODB_URI in your .env file
// eg: MONGODB_URI = URI_FOR_MONGODB
// Always add .env to your .gitignore since it can contain sensitive information
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB Connected") 
}).catch((err) => console.log(err))