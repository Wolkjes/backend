module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      persoon_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },      
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING
      }
    }, {
        timestamps: false,
        tableName: 'persoon'
    }
    );
  
    return User;
  };