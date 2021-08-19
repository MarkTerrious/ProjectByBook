const Sequelize = require('sequelize');

/**
 * 기능 : 업로드
 * 설명 : 내용, 이미지를 데이터 베이스에 업로드 하는 역할.
         Post [userId, contents, img]
         PostHashtag [userId, contents, img, title]        
 */
module.exports = class Post extends Sequelize.Model {
  static init (sequelize) {
    return super.init({
      content: {
        type : Sequelize.STRING(140),
        allowNull : false,
      },
      img: {
        type : Sequelize.STRING(200),
        allowNull : true,
      }
    }, {
      sequelize,
      timestamps : false,
      modelName : 'Post',
      tableName : 'posts',
      paranoid : false,
      charset : 'utf8mb4',
      collate : 'utf8mb4_general_ci'
    });
  }
  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.Hashtag, { through : 'PostHashtag' });
  }
}