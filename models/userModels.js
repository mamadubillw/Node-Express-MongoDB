const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); //encriptar password
// name, email, password, confirmPassword

const userSchema = new mongoose.Schema({ 
        name :{
                type:String,
                required: [true, 'Please tell us your name']
        },
        email:{
                type:String,
                required: [true , 'Please provide you email'],
                unique:true,
                lowercase:true,
                validate: [validator.isEmail, 'Provide valid email']
        },
        photo: String,
        password:{
                type:String,
                required: [true, 'Please provide a password'],
                minlength: 8,
                select:false
        },
        passwordConfirm:{
                type:String,
                required: [true, 'Please confirm your password'],
                //This only works on CREATE AND SAVE !!!
                // RAZAO : quando estamos se inscrevenso numa pagina precisamos de fornecer informacao pela 1vez nessa etapa temos CREATE que e criar e SAVE que e salvar  e por isso verifice se as palavras pasees fornecidas sao mesmas entao depois disso e so vir e logar
                validate:{
                        validator: function(el){
                                return el === this.password;
                        },
                        message: 'Passwowrds are not the same'
                }
        },
        passwordChangedAt: Date
});

userSchema.pre('save',async function(next){
        // only run this function if psssword was actualy modified
        if(!this.isModified('password')) return next();
        // hash the password with cost of 12
        this.password =await bcrypt.hash(this.password, 12);
        //delte passwordConfirm field
        this.passwordConfirm = undefined;
        next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
        return await bcrypt.compare(candidatePassword, userPassword)
}
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
       // console.log(changedTimestamp, JWTTimestamp);

        return JWTTimestamp < changedTimestamp;
    }
    //False means not changed
        return false;
}
const User = mongoose.model('User', userSchema);
module.exports = User;