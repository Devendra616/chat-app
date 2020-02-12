const PORT = process.env.PORT ||3000;
const express = require('express');
const app = express();

//tell express to use static content from public
app.use(express.static(__dirname+'/public'));

app.listen(PORT, ()=>{
    console.log(`Server started at port: ${PORT}`);
})