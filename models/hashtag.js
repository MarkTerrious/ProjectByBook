const Sequelize = require('sequelize');

/**
 * 기능 : 해쉬태그
 * 설명 : 
          게시물에 해쉬태그(특정이름)를 붙여서 해쉬태그의 이름으로 검색이 될 수 있게끔 함.
          Post < ------ > Hashtag
          => PostHashtag ()          
 */
module.exports = class Hashtag extends Sequelize.Model {
  static init (sequelize) {
    return super.init({
      title : {
        type : Sequelize.STRING(15),
        allowNull : false,
        unique : true,
      }
    }, {
      sequelize,                      // db 연결 정보
      timestamps : true,              // createdAt, updatedAt
      underscored : false,            // camel case -> snake case로 변환 
      modelName : 'Hashtag',          // 여기서 이름
      tableName : 'hashtags',         // db에서 테이블 이름
      paranoid : false,               // deletedAt 생성 안함
      charset : 'utf8mb4',            // 한글 + 이모지
      collate : 'utf8mb4_general_ci'  // 한글 + 이모지
    })
  }
  
  static associate(db) {
    db.Hashtag.belongsToMany(db.Post, { through : 'PostHashtag' });
  }
}