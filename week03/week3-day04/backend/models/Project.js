const mongoose = require('mongoose');

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
};

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  techStack: [{ type: String }],
  status: { type: String, default: 'active' },
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, schemaOptions);

module.exports = mongoose.model('Project', ProjectSchema);
