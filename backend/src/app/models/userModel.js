import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    },
    googleId: {
        type: String,
        default: null
    },
    profilePicture: {
        type: String,
        default: null
    }
}, { timestamps: true });


// Pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


// Method to compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};


// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    console.log("Generated reset token: ", resetToken);
    // Save the user with the new reset token and expiration date
    await this.save();
    
    return resetToken;
};


// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
    const payload = {
        userId: this._id, // Include the user's ID in the token
        email: this.email, // Optionally include the email
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour
};


// Static method to verify JWT token
userSchema.statics.verifyToken = function (token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded; // Returns the payload if the token is valid
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};


export default mongoose.model("User", userSchema);