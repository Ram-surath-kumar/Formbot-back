const router = require("express").Router();
const getSpace = require("../controllers/space/getSpace");
const checkAccess = require("../middleware/space/checkAccess");
const validateToken = require("../middleware/validateToken");
const createFormOrFolder = require("../controllers/space/createFormOrFolder");
const deleteFolderOrForm = require("../controllers/space/deleteFormOrFolder");
const updateForm = require("../controllers/space/updateForm");
const getFormData = require("../controllers/space/getFormData");
const saveFormResponses = require("../controllers/space/saveFormResponses");

router.get("/:spaceId", validateToken, checkAccess, getSpace);
router.post("/:spaceId/create", validateToken, checkAccess, createFormOrFolder);
router.delete(
  "/:spaceId/delete/:itemId",
  validateToken,
  checkAccess,
  deleteFolderOrForm
);
router.put(
  "/:spaceId/update/form/:formId",
  validateToken,
  checkAccess,
  updateForm
);

router.get("/form/:formId", getFormData);
router.put("/form/:formId", saveFormResponses);

module.exports = router;
