const { Model } = require('objection');
const Group = require('./Groups.js');

class Usergroup extends Model {
  static tableName = 'user_groups';

  static relationMappings = {
    groups: {
      relation: Model.ManyToManyRelation,
      modelClass: Group,
      join: {
        from: 'user_groups.group_id',
        to: 'groups.id'
      }
    }
  }
}

module.exports = Usergroup;
