const Workspace = require('../../models/Workspace');
const WorkspaceMember = require('../../models/WorkspaceMember');

exports.getWorkspaces = async(req, res)=>{

    try{

        //fetch member
        const memberships = await WorkspaceMember.find({
            user: req.user.id
        });

        //extract workspace id
        const workspaceIds = memberships.map(
            member => member.workspace
        );

        //fetch workspace
        const workspaces = await Workspace.find({
            _id:{
                $in: workspaceIds
            },
            isArchived: false

        });

        return res.status(200).json({
            success: true,
            data: workspaces,
            message: 'workspaces fetched successfully'
        });

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }

}

exports.getWorkspaceById = async(req, res)=>{

    try{

        const {id} = req.params;

        //membership check
        const member = await WorkspaceMember.findOne({
            workspace: id,
            user: req.user.id
        });

        if(!member){

            return res.status(404).json({
                success: false,
                message: 'workspace not found'
            });

        }

        const workspace = await Workspace.findById(id);

        if(!workspace){

            return res.status(404).json({
                success: false,
                message: 'workspace not found'
            })

        }

        //return res
        return res.status(200).json({
            success: true,
            data: workspace,
            message: 'workspace fetched successfully'
        });

    }
    catch(error){

        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })

    }

}