const WorkspaceMember = require('../models/WorkspaceMember');

const resolveTaskAccess = async (todo, userId) => {

    if (!todo.workspace) {

        const isOwner = todo.user.toString() === userId;

        return {
            allowed: isOwner,
            isOwner,
            member: null
        };

    }

    const member = await WorkspaceMember.findOne({
        workspace: todo.workspace,
        user: userId
    });

    return {
        allowed: !!member,
        isOwner: todo.user.toString() === userId,
        member
    };

};

module.exports = resolveTaskAccess;