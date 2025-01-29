const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['POST']
}));
const port = 8080;

const multer = require('multer');
const uploads = multer({ dest: __dirname + '/../csvuploads' });


const authenticatie = (req, res, next) => {
  const authToken = req.headers.auth;

  console.log(req.headers);
  console.log(authToken);
 
  if(!authToken || authToken != 3701) { //als env variable
    console.log('balls');
    return res.status(401).json({'message' : 'go fuck yourself'});
  }
  next();
};

app.post('/api/upload', authenticatie, uploads.any(), (req,res) => {
  if(!req.file) {
    return res.status(400).json({'message' : 'no file received'});
  }
  else{
    return res.status(200).json({'message' : 'file received'});
  }
});


app.get('/api/health', (req, res) => {
    console.log('api healthy');
    res.status(200).json({'status': 'OK'});
});


app.listen(port, () => {
  console.log(`API running at port ${port}`);
});
