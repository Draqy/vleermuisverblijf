const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['POST']
}));
const port = 8080;

const path = require('path');
const multer = require('multer');
const uploads = multer({ dest: __dirname + '/../csvuploads' });

app.post('/api/upload', uploads.single('file'), (req,res) => {  
  if(!req.file) {
    res.status(400).json({'message' : 'no file'});
  } 
  else{
    res.status(200).json({'message' : 'OK'});
  }
});

app.listen(port, () => {
  console.log(`API running at port ${port}`);
});
