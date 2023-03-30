const { updateAssociations } = require("./update-associations")

module.exports.init = ({ app }) => ({
  updateAssociations: updateAssociations({ app }),
})
