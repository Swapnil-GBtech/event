import mongoose,{Schema} from "mongoose"

const CategorySchema = new Schema({
    Category_name:{
        type:String,
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

export const Category = mongoose.model("Category",CategorySchema)