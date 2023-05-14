var mongoose = require('mongoose');
var jwt = require('jsonwebtoken')

var UserSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true
    },
    name: {
        type: String

    },
    email: {
        type: String

    },
    password: {
        type: String

    },
    tokens: [
        {
            token: {
                type: String,

            }
        }
    ]
}, { timestamps: true });

UserSchema.methods.generateAuthtoken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, "sandeepnandanwarfullstackdeveloper")
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch {
        console.log(`err`);
    }
}

module.exports = mongoose.model('usersss', UserSchema);