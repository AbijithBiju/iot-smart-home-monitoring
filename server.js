const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("./config/db");
const Data = require("./data");
const Actuation = require("./switch");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"], 
  allowedHeaders: ["Content-Type"],
  credentials:true,
}; 
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  Data.find({}, (err, result) => {
    if (err) {  
      console.log("ERROR");
    } else {
      res.header('Content-Type', 'text/event-stream')
      res.status(200);
      res.json({
        status: "SUCCESS",
        data  : result.splice(-20)
      })
    } 
  });
});

app.post("/", async (req, res) => {
  console.log(req.body);
  let { temp, humi, sound} = req.body;
  const data = new Data({
    temp: temp,
    humidity: humi,
    sound: sound,
    time: new Date().getTime(),
  });
  data.save(function (err) {
    if (err) {
      console.log("error saving data");
      res.status(500);
      res.json({
        status: "FAILED",
        message: err.message,
      }); 
    } else {
      console.log("saved data successfully");
      res.status(200);
      res.json({
        status: "SUCCESS",
        message: "successful",
      });
    }
  });
});

app.post('/switch',(req,res)=>{
  Actuation.updateOne({}, {switch: req.body.switch}).then(()=>{
    console.log('switch updated to => ',req.body.switch)
    res.status(200)
    res.json({
      status: "SUCCESS",
      message: "successful", 
      updatedTo : req.body.switch
    })
  })
})

app.get('/switch',(req,res)=>{
  console.log(req.body)
  Actuation.findOne({},(error,result)=>{
    if(error){
      res.status(400)
    }else{
      if(result.switch){
        res.send('1')
      }else{
        res.send('0')
      }
      console.log("findOne result => ",result.switch) 
    }
  })
})

app.listen(port, () => {
  console.log(`smart home monitoring app listening on port ${port}`); 
});
