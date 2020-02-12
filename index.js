const PORT = process.env.PORT ||3000;
const express = require('express');
const app = express();

app.use(express.static(__dirname+'/public'));

app.listen(PORT, ()=>{
    console.log(`Server started at port: ${PORT}`);
})