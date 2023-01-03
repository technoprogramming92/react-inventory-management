const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
    email: {
        type: String,
        required: [true, "Please add an Email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ],
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Password mustbe upto 6 chars"],
        //maxLength: [23, "Password must not be more than 23 chars"],
    },
    photo: {
        type: String,
        required: [true, "Please add a Photo"],
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    phone: {
        type: String,
        default: "+91",
    },
    bio: {
        type: String,
        maxLength: [250, "Bio must not be more than 250 chars"],
        default: "Bio",
    },   
}, 
{
    timestamps: true
});

//Encrypt password before saving to DB
userSchema.pre("save", async function(next) {

    if(!this.isModified("password")){
        return next();
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;

