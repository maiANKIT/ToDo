const Workspace = require('../../models/Workspace');
const WorkspaceMember = require('../../models/WorkspaceMember');

exports.updateWorkspace = async(req, res)=>{
    
    try{

        //fetch id
        const {id} = req.params;

        //fetch data
        const {name, description, avatar} = req.body;

        //membership check
        const member = await WorkspaceMember.findOne({
            workspace: id,
            user: req.user.id
        })

        //check for member
        if(!member){
            
            return res.status(404).json({
                success: false,
                message: 'workspace not found'
            });

        }

        //permission check
        if(!member.permissions.canManageWorkspace){
            
            return res.status(403).json({
                success: false,
                message: 'Permission denied'
            });

        }

        //update object
        const updateData = {};
        if(name !== undefined){

            if(!name.trim()){
                
                return res.status(400).json({
                    success: false,
                    message: 'workspace name is required'
                })

            }

            updateData.name = name.trim();
        }

        if(description !== undefined){
            updateData.description = description?.trim?.()??description;
        }

        if(avatar !== undefined){

            updateData.avatar = avatar?.trim?.()??avatar;

        }

        //update workspace
        const workspace = await Workspace.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true
            }
        );

        //workspace not found
        if(!workspace){

            return res.status(404).json({
                success: false,
                message: 'workspace not found'
        });

        }

        //return response
        return res.status(200).json({
            success: true,
            data: workspace,
            message: 'workspace updated successfully'
        });

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'internal server error'
        });
    }

}