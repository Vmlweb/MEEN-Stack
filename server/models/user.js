//Modules
import mongoose from 'mongoose';

//Schema
let schema = new mongoose.Schema({
	username: String,
	email: String,
});

//Model
export default mongoose.model('Users', schema);