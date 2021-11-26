const express = require("express")
const cors = require("cors")
const { spawn } = require('child_process');
const pyprog = spawn('python', ['predict.py']);
const fetchData = async()=>{
    return pyprog.stdout.on('data', function(data) {
        console.log(data)
        return data
    });
}
const createServer = ()=>{
    const app = express();

    app.use(
        cors({
            "origin": '*',
            "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
            "preflightContinue": false,
            "optionsSuccessStatus": 200
        })
      );
      
    app.use(express.json());

    app.get('/',(req,res,next)=>{
        return res.status(200).send("Index Page")
    })

    app.get('/api/predict',async(req,res)=>{
        try{
            console.log('2st')
            const data = await fetchData()
            res.send(data)
        }catch(e){
            res.send(e)
        }
    })

    return app;
}

module.exports = createServer