const {Model} = require('objection');
const Group = require('./Groups.js');

class User extends Model {
    static tableName = 'users';

    static relationMappings = {
        groups: {
            relation: Model.HasOneThroughRelation,
            modelClass: Group,
            join: {
                from: 'users.id',
                through: {
                    from: 'user_groups.user_id',
                    to: 'user_groups.group_id'
                },
                to: 'groups.id'
            }
        }
    }
}

module.exports = User;
