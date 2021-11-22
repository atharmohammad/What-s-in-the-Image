const port = process.env.PORT || 8000;
const createServer = require('./server');
const app = createServer();

app.listen(port,()=>console.log("Server is up and running at port: " + port));