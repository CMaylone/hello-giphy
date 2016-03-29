var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

/**
 * Verify that the cleartext password successfully compares to the stored hashed password
 */
userSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
}

/**
 * Sanitize sensitive data from the user object.
 */
userSchema.methods.sanitize = function() {
    var clone = this.toObject();
    delete clone.password;
    return clone;
}

/**
 * Handle some special cases before saving the user object
 */
userSchema.pre('save', function(next) {
    var user = this;
    
    // hash password only if it has been modified
    if(!user.isModified('password')) {
        return next();
    }
    
    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password using  salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // overwrite the password with the hashed one
            user.password = hash;
            next();
        });
    });
});

// Create user model
module.exports = mongoose.model('User', userSchema);