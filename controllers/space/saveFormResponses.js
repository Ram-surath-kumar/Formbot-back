const FormOrFolder = require("../../models/FormOrFolder");

const saveFormResponses = async (req, res) => {
  const { formId } = req.params;
  const { response, started } = req.body;

  try {
    const form = await FormOrFolder.findById(formId);

    if (!form || form.isFolder) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (started) {
      form.started += 1;
    }

    if (response) {
      form.responses = form.responses || [];
      form.responses.unshift({ response });
    }

    form.save();

    return res.status(200).json({
      message: "Form responses saved successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error saving form responses:", error);

    return res
      .status(500)
      .json({ message: "Error saving form responses", error: true });
  }
};

module.exports = saveFormResponses;
