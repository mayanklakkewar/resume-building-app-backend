console.log("Uploading images to: ", `/api/resumes/upload-image`);
import fs from "fs";
import path from "path";

import Resume from "../models/resumeModel.js";
import upload from "../middleware/uploadMiddleware.js";

export const uploadResumeImages = async function (req, res) {
  try {
    // configure multer to handle images
    upload.fields([{ name: "thumbnail" }, { name: "profileImage" }])(
      req,
      res,
      async (err) => {
        if (err) {
          return res.status(400).json({
            message: "Failed Upload resume",
            error: err.message,
          });
        }
        const resumeId = req.params.id;
        const resume = await Resume.findById({
          _id: resumeId,
          userId: req.user._id,
        });

        if (!resume) {
          return res.status(404).json({
            message: "Resume not found or unauthorized",
          });
        }

        //use process cwd to locate folder

        const uploadFolder = path.join(process.cwd(), "uploads");
        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const newThumbnail = req.files.thumbnail?.[0];
        const newProfileImage = req.files.profileImage?.[0];

        if (newThumbnail) {
          if (resume.thumbnailLink) {
            const oldThumbnail = path.join(
              uploadFolder,
              path.basename(resume.thumbnailLink)
            );
            if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
          }
          resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
        }

        //same for profilepreview image
        if (newProfileImage) {
          if (resume.profileInfo?.profilePreviewUrl) {
            const oldProfile = path.join(
              uploadFolder,
              path.basename(resume.profileInfo.profilePreviewUrl)
            );
            if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
          }
          resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
        }

        await resume.save();
        return res.status(200).json({
          message: "Image uploaded Sucessfully",
          thumbnailLink: resume.thumbnailLink,
          profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
        });
      }
    );
  } catch (error) {
    console.error("error Uploading images :", error);
    res.status(500).json({
      message: " Failed to upload Images",
      error: error.message,
    });
  }
};
