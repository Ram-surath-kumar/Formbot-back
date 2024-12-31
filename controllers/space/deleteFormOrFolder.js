const FormOrFolder = require("../../models/FormOrFolder");
const Space = require("../../models/Space");

const deleteFolderOrForm = async (req, res) => {
  const { itemId, spaceId } = req.params;
  const { parentId } = req.query;

  try {
    const folderOrForm = await FormOrFolder.findById(itemId);

    if (!folderOrForm) {
      return res.status(404).json({
        error: true,
        message: "Oops! Item not found.",
      });
    }

    const space = await Space.findById(spaceId);

    // If it's a folder
    if (folderOrForm.isFolder) {
      // Delete all children forms inside the folder
      for (const childId of folderOrForm.children) {
        await FormOrFolder.findByIdAndDelete(childId);
      }

      // Remove the folder from the rootFolder of the space

      space.rootFolder = space.rootFolder.filter(
        (item) => item.toString() !== folderOrForm._id.toString()
      );
      await space.save();
    } else {
      // If it's a form
      if (parentId) {
        // Form is inside a folder
        const parentFolder = await FormOrFolder.findById(parentId);
        if (parentFolder) {
          parentFolder.children = parentFolder.children.filter(
            (childId) => childId.toString() !== folderOrForm._id.toString()
          );
          await parentFolder.save();
        }
      } else {
        // Form is in rootFolder

        space.rootFolder = space.rootFolder.filter(
          (item) => item.toString() !== folderOrForm._id.toString()
        );
        await space.save();
      }
    }

    await FormOrFolder.deleteOne({ _id: itemId });

    return res.status(200).json({
      success: true,
      message: `${
        folderOrForm.isFolder ? "Folder" : "Form"
      } deleted successfully!`,
    });
  } catch (error) {
    console.error("Error deleting folder or form", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error!",
    });
  }
};

module.exports = deleteFolderOrForm;
