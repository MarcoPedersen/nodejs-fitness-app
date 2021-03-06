const {Model} = require('objection');
const Group = require('./Groups.js');
const Roles = require('./Roles.js');
const Usergroup = require('./Usergroup.js');

class User extends Model {
    static tableName = 'users';

    static relationMappings = {
        groups: {
            relation: Model.ManyToManyRelation,
            modelClass: Group,
            join: {
                from: 'users.id',
                through: {
                    from: 'user_groups.user_id',
                    to: 'user_groups.group_id'
                },
                to: 'groups.id'
            }
        },
        userGroups: {
            relation: Model.HasManyRelation,
            modelClass: Usergroup,
            join: {
                from: 'users.id',
                to: 'user_groups.user_id'
            }
        },
        role: {
            relation: Model.BelongsToOneRelation,
            modelClass: Roles,
            join: {
                from: 'users.role_id',
                to: 'roles.id'
            }
        }
    }
}

module.exports = User;
