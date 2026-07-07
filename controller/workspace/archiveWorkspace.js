const Workspace = require('../../models/Workspace');
const WorkspaceMember = require('../../models/WorkspaceMember');

exports.archiveWorkspace = async(req, res)=>{

    try{

        const {id} = req.params;

        const member = await WorkspaceMember.findOne({
            workspace:id,
            user:req.user.id
        });

        if(!member){

            return res.status(404).json({
                success:false,
                message:'workspace not found'
            });

        }

        if(!member.permissions.canManageWorkspace){

            return res.status(403).json({
                success:false,
                message:'permission denied'
            });

        }

        const workspace = await Workspace.findById(id);

        if(!workspace){

            return res.status(404).json({
                success:false,
                message:'workspace not found'
            });

        }

        if(workspace.isArchived){

            return res.status(409).json({

                success:false,
                message:'Workspace is already archived'

            });

        }

        workspace.isArchived = true;

        await workspace.save();

        return res.status(200).json({

            success:true,
            data:workspace,
            message:'Workspace archived successfully'

        });

    }
    catch(error){

        console.error(error);

        return res.status(500).json({
            success:false,
            message:'Internal server error'
        });

    }

}