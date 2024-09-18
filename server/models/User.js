const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be blank!']
    },
/*hashed*/password: {
        type: String,
        required: [true, 'Username cannot be blank!']
    }

})

userSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username });
    console.log(`found user: ${foundUser}`);
    if (!foundUser) return false; // If no user is found, return false immediately.
    console.log(`plain pass: ${password}, hashed pass: ${foundUser.password}`); 
    const isValid = await bcrypt.compare(password, foundUser.password);
    console.log(`is valid: ${isValid}`);
    return isValid ? foundUser : false;
};


userSchema.pre('save', async function (next) { // 'this' refers to an instance
    if (!this.isModified('password')) return next(); // so that password does not re-hash on username change
    this.password = await bcrypt.hash(this.password, 12);
    next()
})
module.exports = mongoose.model('User', userSchema);

