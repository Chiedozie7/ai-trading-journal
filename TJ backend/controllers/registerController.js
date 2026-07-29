const User = require('../model/User');
const bcrypt = require('bcrypt');

const NewUser = async (req, res) => {
    const {name, email, password} = req.body;
    if (!name || !email || !password) return res.status(400).json({'message': 'Name, email, and password are required'});

    const normalizedEmail = email.toLowerCase();

    //check for duplicate emails in the db
    const duplicate = await User.findOne({ email: normalizedEmail }).exec();
    if (duplicate) return res.status(409).json({'message': 'Email already exists'}); //conflict

    if(password.length < 4) return res.status(400).json({'message': 'Password must be at least 4 characters long'});

    try {
    //encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //create and store the new user
    const result = await User.create({
        "name": name,
        "email": normalizedEmail,
        "password": hashedPassword
    });
   
     console.log(result);
     res.status(201).json({'success': `New user ${name} created.`})

    } catch (err) {
        res.status(500).json({'message': err.message}); //server error
    }
}


module.exports = {NewUser};

