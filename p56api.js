const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS']
}));
const port = 8000;

const mysql = require('mysql2');
var pool = mysql.createPool({
    host: "localhost",
    port: "8443",
    user: "root",
    password: "mypassword",
    database: "mydb"
}).promise()

// function injectionCheck(username){
//     return /^[A-Za-z0-9]{8}$/.test(username);
// }

async function getLogin(username){
    const [rows] = await pool.execute("SELECT password FROM authentication WHERE username = ?",[username]);
    return rows[0];
}

async function getUserID(username){
    const [rows] = await pool.execute("SELECT userID FROM authentication WHERE username = ?",[username]);
    return rows[0];
}

async function checkExist(username){
    const [rows] = await pool.execute("SELECT username FROM authentication WHERE username = ?",[username]);
    if(rows[0].username == username){
        return 1;
    }
    else{
        return 0;
    }
}

async function setLogTime(username){
    var date = new Date();
    date.setHours(date.getHours() /*+ 2*/);

    const userIDReturn = await getUserID(username);
    const userID = userIDReturn.userID;

    let mysql =  "INSERT INTO accesLog (logDate, userID) VALUES (?, ?)";
    let values = [date, userID];
    const [rows] = await pool.execute(mysql, values);
    return rows;
}


app.post('/api/authentication', async (req,res) => {
    const filledUsername = req.body.uname;
    const filledPassword = req.body.passwd;

    try{
        const exists = await checkExist(filledUsername);
        if(exists == 1){
            const passwordQuery = await getLogin(filledUsername);
            if(filledPassword == passwordQuery.password){
                res.status(200).json({'message' : 'password OK'});
                setLogTime(filledUsername);
            }
            else if(filledPassword != passwordQuery.password){
                res.status(401).json({'message' : 'invalid password'});
                //loggen maar dat het niet gelukt is?
            }
           
        }
        else{ //registered as an error
            res.status(404).json({'message' : 'invalid username'});
        } //moet account geblokkeerd wordt bij x aantal pogingen?
    } catch(error){
        console.log(error);
        res.status(500).json({'message' : 'error'});
    }
});

app.post('/api/sensors', async (req,res) => {
    try{

    } catch(error){
        console.log(error);
        res.status(500).json({'message' : 'error'});
    }
});


app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
  });