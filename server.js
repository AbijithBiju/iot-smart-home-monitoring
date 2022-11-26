const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
const corsOptions = {
    origin: '*',
    methods: ['GET','POST',],
    allowedHeaders: ['Content-Type'],
  }
app.use(cors(corsOptions))

app.get('/', (req, res) => {
    fs.readFile('data.json',(error,data)=>{
        if(error)
            console.log(error)
        else{
            const readings = JSON.parse(data)
            res.status(200)
            res.json({
              status: "SUCCESS",
              count: readings.length,
              data: Array.from(readings).reverse(),
            });
        }
    })
})
app.post('/', async(req, res) => {
    console.log(req.body)
    if(req.body){
        fs.readFile('data.json',(err,data)=>{
            if(err){
                console.log(err)
            }else{
                if(req.body.clearAll){
                    fs.writeFileSync('data.json',JSON.stringify([],null,4))
                    res.status(200)
                    res.json({status : "SUCCESS",message:'data cleared'});
                }else{
                    let fileContent = JSON.parse(data)
                    const arr = Array.from(fileContent)
                    req.body['time']=new Date()
                    arr.push(req.body)
                    fs.writeFileSync('data.json',JSON.stringify(arr,null,4))
                    res.status(200)
                    res.json({status : "SUCCESS",message:'data added'});
                }
            }
        })
    }else{
        res.status(400)
        res.json({status : 'FAILED'})
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})