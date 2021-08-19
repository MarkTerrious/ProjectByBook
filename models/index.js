// Enviroment
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];  // config => db 연결 정보

// Lib
const Sequelize = require('sequelize');

// User Lib
const User = require('./users');
const Post = require('./post');
const Hashtag = require('./hashtag');

// db 
const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);

module.exports = db;