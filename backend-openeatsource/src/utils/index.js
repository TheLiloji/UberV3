const utils = {
  log: (message) => {
    console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
  },
  
  error: (message) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
  },
  
  success: (message) => {
    console.log(`[SUCCESS] ${new Date().toISOString()}: ${message}`);
  }
};

module.exports = utils;