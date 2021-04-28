const config = {
    db: {
      url: process.env.MONGO_URL || 'mongodb://localhost:27017',
      name: process.env.MONGO_DB_NAME || 'chatdb'
    }
  }
  
module.exports =  config;