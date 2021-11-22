const express = require("express")
const cors = require("cors")

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

    app.post('/api/predict',async(req,res)=>{
        
    })

    return app;
}

module.exports = createServer