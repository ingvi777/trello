import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    nameCard:{
        type: String,
        required: true
    },
    description:{
        type: String,
        default: false
    }
});

export const card = mongoose.model('cards', schema);