import mongoose from 'mongoose';


const fileSchema = new mongoose.Schema({
  name: String,
  data: String, // Store base64-encoded data as a string
  contentType: String
});


export default mongoose.model('File', fileSchema);