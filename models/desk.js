import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    name:{
        type: String,
        required: true
    },
    listId:{
        type: [],
        default: false
    }
});

export const desk = mongoose.model('desk', schema);
