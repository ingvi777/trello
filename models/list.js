import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    idDesk:{
        type: {},
        required: true
    },
    nameDesk:{
        type: String,
        required: true
    },
    idCards:{
        type: [],
        default: ''
    }
});

export const list = mongoose.model('lists', schema);