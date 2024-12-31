const FormOrFolder = require("../../models/FormOrFolder");

const getFormData = async (req, res) => {
  const { formId } = req.params;

  try {
    const form = await FormOrFolder.findById(formId);

    if (!form || form.isFolder) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (form) {
      form.viewed += 1;
    }

    form.save();

    return res.status(200).json({
      message: "Form data fetched successfully",
      data: form.data,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching form data", error: true });
  }
};

module.exports = getFormData;
