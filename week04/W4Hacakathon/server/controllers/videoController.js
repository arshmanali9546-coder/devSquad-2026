import Video from '../models/Video.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ visibility: true }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllVideosAdmin = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos: ' + error.message });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video || !video.visibility) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createVideo = async (req, res) => {
  try {
    const videoData = { ...req.body };

    // Upload files to Cloudinary from buffer (works on Vercel)
    if (req.files) {
      if (req.files.video && req.files.video[0]) {
        const { url } = await uploadToCloudinary(
          req.files.video[0].buffer,
          'streamvibe/videos',
          'video'
        );
        videoData.videoUrl = url;
      }
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const { url } = await uploadToCloudinary(
          req.files.thumbnail[0].buffer,
          'streamvibe/thumbnails',
          'image'
        );
        videoData.thumbnailUrl = url;
      }
    }

    const video = await Video.create(videoData);
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
