import Resume from "../models/resumeModel.js";
import path from "path";
import fs from "fs";

export const createResume = async function (req, res) {
  try {
    const { title } = req.body;

    //defualt Templete
    const defaultResumeData = {
      profileInfo: {
        profileImg: null,
        previewUrl: "",
        fullName: "",
        designation: "",
        summary: "",
      },
      contactInfo: {
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
      },
      workExperience: [
        {
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      education: [
        {
          degree: "",
          institution: "",
          startDate: "",
          endDate: "",
        },
      ],
      skills: [
        {
          name: "",
          progress: 0,
        },
      ],
      projects: [
        {
          title: "",
          description: "",
          github: "",
          liveDemo: "",
        },
      ],
      certifications: [
        {
          title: "",
          issuer: "",
          year: "",
        },
      ],
      languages: [
        {
          name: "",
          progress: "",
        },
      ],
      interests: [""],
    };

    const newResume = await Resume.create({
      userId: req.user._id,
      title,
      ...defaultResumeData,
      ...req.body,
    });
    console.log("resume created");
    res.status(201).json(newResume);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create resume",
      error: error.message,
    });
  }
};

//Get Function

export const getUserResumes = async function (req, res) {
  try {
    const resumes = await Resume.find({ userid: req.user.userId }).sort({
      updatedAt: -1,
    });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create resume",
      error: error.message,
    });
  }
};

// Get resume by id
export const getResumeById = async function (req, res) {
  try {
    console.log("here is the mongo id ", req.params.id);
    console.log("here is the userId :", req.user._id);

    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not Found",
      });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({
      message: "Faled to get resume",
      error: error.message,
    });
  }
};

//Update resume
export const updateResume = async function (req, res) {
  console.log("Update Resume Is Running");
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found or not authorized",
      });
    }

    //merge updated resume
    Object.assign(resume, req.body);

    //save updated resume
    const saveResume = await resume.save();
    res.json(saveResume);
  } catch (error) {
    res.status(500).json({
      message: "Failed to Update resume",
      error: error.message,
    });
  }
};

//Delete Resume
export const deleteResume = async function (req, res) {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({
        message: "Resume not found or not authorized",
      });
    }

    // Create a upload folder and store the resume there
    const uploadFolder = path.join(process.cwd(), "uploads");

    //Delete thumbnail function
    if (resume.thumbnailLink) {
      const oldThumbnail = path.join(
        uploadFolder,
        path.basename(resume.thumbnailLink)
      );

      if (fs.existsSync(oldThumbnail)) {
        fs.unlinkSync(oldThumbnail);
      }
    }

    if (resume.profileInfo.profilePreviewUrl) {
      const oldProfile = path.join(
        uploadFolder,
        path.basename(resume.profileInfo.profilePreviewUrl)
      );
      if (fs.existsSync(oldProfile)) {
        fs.unlinkSync(oldProfile);
      }
    }

    //Delete resume document
    const deleted = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!deleted) {
      return res.status(404).json({
        message: "Resume Not Found or not Authorized",
      });
    }
    res.json({ message: "Resume Deleted Sucessful" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to Delete resume",
      error: error.message,
    });
  }
};
