const FormOrFolder = require("../../models/FormOrFolder");

const updateForm = async (req, res) => {
  const { data, name } = req.body;
  const { formId } = req.params;
  try {
    const form = await FormOrFolder.findById(formId).select("-__v -updatedAt");

    if (!form) {
      return res.status(404).json({
        error: true,
        message: "Oops! Form not found.",
      });
    }

    if (name) {
      const existingFolderOrForm = await FormOrFolder.findOne({
        parent: form.parent,
        name,
        isFolder: form.isFolder,
        _id: { $ne: formId },
      });

      if (existingFolderOrForm) {
        return res.status(400).json({
          error: true,
          message: "Duplicate name! Please use a different name.",
        });
      }
      form.name = name;
    }
    if (data) {
      form.data = data;
    }

    await form.save();
    return res.status(200).json({
      success: true,
      message: "Form updated successfully!",
      data: form,
    });
  } catch (error) {
    console.error("Error updating form", error);
    return res.status(500).json({
      error: true,
      message: "Error updating form!",
    });
  }
};

module.exports = updateForm;
