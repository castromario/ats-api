// app.js
import express from 'express';
import multer from 'multer';
import File from '../models/File.js';


const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
//mongoose.connect('mongodb://localhost:31/test', {
//  useNewUrlParser: true,
//  useUnifiedTopology: true,
//});
//mongoose.connection.on('error', (error) => console.error(error));
//mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

// Configure multer for file upload
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

app.use(express.json());

// Endpoint for uploading files as base64 strings
app.post('/upload/new', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, buffer, mimetype } = req.file;

    // Convert buffer to base64
    const base64Data = buffer.toString('base64');
    const user = await File.create(req.body);
    // Create a new document in MongoDB
    const newFile = new File({
      name: originalname,
      data: base64Data,
      contentType: mimetype
    });



    await newFile.save();

    return res.status(201).json({ message: 'File uploaded successfully',fileId:newFile._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/upload/update/:id', upload.single('file'), async (req, res) => {
  try {
    const fileId = req.params.id;
    const fileToUpdate = await File.findById(fileId);

    if (!fileToUpdate) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (req.file) {
      // If a new file is uploaded, update the file's data and content type
      const { originalname, buffer, mimetype } = req.file;
      const base64Data = buffer.toString('base64');

      fileToUpdate.name = originalname;
      fileToUpdate.data = base64Data;
      fileToUpdate.contentType = mimetype;

      await fileToUpdate.save();
    } else {
      // If no new file is uploaded, you can update other properties of the file
      // For example, you might update the file's name or metadata here.
      // In this example, we're updating the file's name with a query parameter.
      const { newName } = req.query;

      if (newName) {
        fileToUpdate.name = newName;
        await fileToUpdate.save();
      }
    }

    return res.status(200).json({ message: 'File updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint for downloading a file by ID
app.get('/download/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Set response headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    res.setHeader('Content-Type', file.contentType);

    // Send the base64-encoded file data as the response
    res.send(Buffer.from(file.data, 'base64'));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

//app.listen(PORT, () => {
//  console.log(`Server is running on port ${PORT}`);
//});

export default app;