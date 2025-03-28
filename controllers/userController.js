const bcrypt=require('bcrypt');
const pool=require('../confiq/db');

// registeration page controller

const registerUser=async(req,res)=>{
    const {username, email, password}= req.body;

    // validate the input, username, email, password
    if(!username || !email || ! password){
        return res.status(400).send('All Fields are required.');
    }

    // Creating and hashing the password
    try{
        const hashedPassword=await bcrypt.hash(password, 10);
        // Inserting user into the database;

        const sql='INSERT INTO user (username, email, password) VALUES (?, ?, ?)';
        try{
            const[result]=await pool.query(sql,[username, email, hashedPassword]);
            res.status(200).send('User Created Successfully.');
        }
        catch (err){
            // check for duplicate entry error
            if(err.code==='ER_DUP_ENTRY'){
                return res.status(409).send('User Already Exist.');
            }
            console.error('Databse Error:', errr);
            return res.status(500).send('Database Error.');

        }
    }catch (err){
        console.error('Error processing requrest:', err);
        res.status(500).send('Interal Server Error');
    }
};

module.exports=registerUser;