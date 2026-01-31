const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    content : {
        type: String,
        required: true
    },
    coverImage : {
        type: String,
        required: true
    },
    slug : {
        type: String,
        unique: true
    },
    author : {
        type : String,
        default : "Iyra Media"
    },
    published : {
        type : Boolean,
        default : true
    }
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);