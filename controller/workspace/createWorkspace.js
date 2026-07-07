const mongoose = require('mongoose');

const Workspace = require('../../models/Workspace');
const WorkspaceMember = require('../../models/WorkspaceMember');
const getPermissionsByRole = require('../../utils/rolePermissions');

exports.createWorkspace = async(req, res)=>{

    //start session
    const session = await mongoose.startSession();

    try{

        //start transaction
        session.startTransaction();

        //data fetch
        const {name, description, avatar} = req.body;

        //validation
        if(!name || !name.trim()){

            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success: false,
                message: 'Workspace name is required'
            });

        }

        //create workspace
        const workspace = await Workspace.create(
            [{
                name: name.trim(),
                description,
                avatar,
                owner: req.user.id
            }],
            {session}
        );

        //create owner
        await WorkspaceMember.create(
            [
                {
                    workspace: workspace[0]._id,
                    user: req.user.id,
                    role: 'Owner',
                    permissions: getPermissionsByRole('Owner')
                }
            ],
            {session}
        );

        //commit transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            success: true,
            data: workspace[0],
            message: 'workspace created successfully'
        })

    }
    catch(error){

        //rollback
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        session.endSession();


        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })

    }

}