
const {v1: uuidv1 } = require('uuid');

const Helpers = {
  generateUUID: () => {
     const uuid = uuidv1();  
     return uuid;
  },

  checkTitleLength: (title) => {
    if (typeof title !== 'string' || title == null || title.length > 50 || title.length == '' || title[0] !== title[0].toUpperCase()) {
      return false;
    }
    return title;
  }
}

module.exports = Helpers