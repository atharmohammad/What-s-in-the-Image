const express = require("express")
const cors = require("cors")
const { spawn } = require('child_process');
const chalk = require("chalk");
const multer = require('multer')
const delay = () => new Promise(resolve => {
    setTimeout(() => {
        resolve();
    }, 10000);
});
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/Images/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg') //Appending .jpg
    }
})

var upload = multer({ storage: storage });

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

    app.post('/api/predict',upload.single('file'),async(req,res)=>{
        try{
            const file = req.file.filename
            const pyprog = spawn('python', [__dirname + '/predict.py',file]);
            pyprog.stderr.pipe(process.stderr);
            let ans = 'Work';
            await pyprog.stdout.on('data', function(data) {
                console.log(chalk.red('-------------------------------------------------------------------------'));
                console.log(chalk.blue('Prediction About Image is :-'));
                console.log(chalk.green(data));
                ans = data
            });
            await delay()
            res.send(ans)
        }catch(e){
            res.send(e)
        }
    })

    return app;
}

module.exports = createServer