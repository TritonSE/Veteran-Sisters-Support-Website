import { User } from "../models/userModel.js";
import FileObject from "../models/fileModel.js";

/*
authenticateUser() from auth.js must be used before this
*/
export const authenticateDocumentPermissions = async (req, res, next) => {
    try{
        const email = req.user.email;
        const user = await User.findOne({ email }).exec();
        const documentId = req.params.id;
        const document = await FileObject.findOne({_id: documentId}).populate("uploader")
        switch(user.role){
            case "veteran":
                if(!document.uploader.equals(user)){
                    return res.status(500).json({ error: "You do not have permission to view this document!" });
                }   
                break;
            case "volunteer":
                // if(!user.assignedPrograms.some(element => document.programs.includes(element))){
                //     return res.status(500).json({ error: "You do not have permission to view this document!" });
                // }
                if(!user.assignedUsers.includes(document.uploader.email)){
                    return res.status(500).json({ error: "You do not have permission to view this document!" });
                }
                break;
            case "staff":
                if(!user.assignedPrograms.some(element => document.programs.includes(element))){
                    return res.status(500).json({ error: "You do not have permission to view this document!" });
                }
                break;
            case "admin":
                    break;
            default:
                return res.status(500).json({ error: "You do not have permission to view this document!" });
        }

        next()
    }catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
