const Sequelize = require('sequelize');

/**
 * 기능 : 사용자 관리
 * 설명 : 
          로그인, 사용자 정보, 사용자 업로드
 * 관계 : 
          User < ---- >> Post   => Post  
            [userId, Post]
          User << ---- >> User  =>
            [follower, following] 

            
 */
module.exports = class User extends Sequelize.Model {
  static init (sequelize) {
    return super.init( {
      email: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
      nick: {
        type: Sequelize.STRING(15),
        allowNull : false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull : false,
        defaultValue : 'local',
      },
      provicer: {
        type: Sequelize.STRING(10),
        allowNull : true,
      },
      snsId: {
        type: Sequelize.STRING(30)
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      cahrset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.User, {
      foreignKey : 'followingId',
      as : 'Followers',
      through : 'Follow',
    });
    db.User.belongsToMany(db.User, {
      foreignKey : 'followerId',
      as : 'follow',
      through : 'Follow',
    });
  }
};