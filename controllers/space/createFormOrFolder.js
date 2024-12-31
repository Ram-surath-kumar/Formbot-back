const FormOrFolder = require("../../models/FormOrFolder");
const Space = require("../../models/Space");

const createFolderOrForm = async (req, res) => {
  const { spaceId } = req.params;
  const { name, parentId, isFolder } = req.body;


  const userId = req.userId;

  try {
    let parentFolder = null;
    const space = await Space.findById(spaceId);

    if (name.trim() === "") {
      return res.status(400).json({
        error: true,
        message: "Name cannot be empty!",
      });
    }

    //check parent folder if provided (for forms if provided)
    if (parentId) {
      parentFolder = await FormOrFolder.findById(parentId);
      if (!parentFolder) {
        return res.status(404).json({
          error: true,
          message: "Parent folder not found!",
        });
      }
    }
    if (parentFolder && !parentFolder.isFolder) {
      return res.status(400).json({
        error: true,
        message: "Parent folder is not a folder!",
      });
    }

    const existingFolderOrForm = await FormOrFolder.findOne({
      parent: parentId || spaceId,
      name,
      isFolder,
    });

    if (existingFolderOrForm && existingFolderOrForm.isFolder === isFolder) {
      return res.status(400).json({
        error: true,
        message: "Duplicate name! Please use a different name.",
      });
    }

    // If creating a folder, ensure it is only in the root and not nested
    if (parentId) {
      if (isFolder) {
        return res.status(400).json({
          error: true,
          message: "Folders cannot be nested inside other folders!",
        });
      }
    }

    const formData = {
      name,
      isFolder,
      parent: parentId || spaceId,
      createdBy: userId,
    };

    if (!isFolder) {
      formData.data = [];
      formData.viewed = 0;
      formData.started = 0;
    }

    // Create the folder or form
    const newFolderOrForm = new FormOrFolder({ ...formData });

    await newFolderOrForm.save();

    // If it's a form and has a parent folder, add it to the folder's children
    if (parentFolder) {
      parentFolder.children.push(newFolderOrForm._id);
      await parentFolder.save();
    } else {
      // If it's a folder or form in the root, add it to the space's rootFolder array
      space.rootFolder.push(newFolderOrForm._id);
      await space.save();
    }

    return res.status(200).json({
      success: true,
      message: `${isFolder ? "Folder" : "Form"} created successfully!`,
      data: newFolderOrForm,
    });
  } catch (error) {
    console.error("Error creating folder or form", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error!",
    });
  }
};

module.exports = createFolderOrForm;
