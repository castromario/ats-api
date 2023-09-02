import mongoose from 'mongoose';

const TranSchema = new mongoose.Schema(
    {
        jobID: {
            type: String,
            required: [true, 'Please provide company'],
            maxlength: 50,
        },
        userID: {
            type: String,
            required: [true, 'Please provide position'],
            maxlength: 100,
        },
        
        status: {
            type: String,
            required: [true, 'Please provide position'],
            maxlength: 100,
        },
        threads: [{
            Description: String,
           Status: String,
          },
        ],
    },
    { timestamps: true }
);

export default mongoose.model('Tran', TranSchema);
