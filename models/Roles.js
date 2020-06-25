const { Model } = require('objection');

class Roles extends Model {
    static tableName = 'roles';
}

module.exports = Roles;
