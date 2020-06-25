const { Model } = require('objection');

class Groups extends Model {
    static tableName = 'groups';
}

module.exports = Groups;
