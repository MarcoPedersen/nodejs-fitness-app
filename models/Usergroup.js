const { Model } = require('objection');

class Usergroup extends Model {
  static tableName = 'user_groups';
}

module.exports = Usergroup;
