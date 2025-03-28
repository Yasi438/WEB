const bcrypt=require('bcrypt');
const pool=require('../confiq/db');
const jwt=require('jsonwebtoken');
const SECRET_KEY = 'fornow';


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
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send('All fields required.');

    try {
        const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).send('Invalid credentials.');

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).send('Invalid credentials.');

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).send('Server Error.');
    }
};
const getProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await pool.query('SELECT username, email FROM user WHERE id = ?', [userId]);
        if (rows.length === 0) return res.status(404).send('User not found.');
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Profile Error:', err);
        res.status(500).send('Database Error');
    }
};

module.exports={registerUser, loginUser, getProfile};