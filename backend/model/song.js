const { DataTypes } = require('sequelize');
const sequelize = require('../config/playerDB');

const Song = sequelize.define('Song', {
  title: { type: DataTypes.STRING, allowNull: false },
  artist: { type: DataTypes.STRING, allowNull: true },
  album:  { type: DataTypes.STRING, allowNull: true },
  duration: { type: DataTypes.INTEGER, allowNull: true }, 
  filePath: { type: DataTypes.STRING, allowNull: false }, 
  coverPath: { type: DataTypes.STRING, allowNull: true }  
}, {
  tableName: 'songs'
});

module.exports = Song;
