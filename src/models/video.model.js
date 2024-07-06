import {Schema, model} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; 

const videoSchema = new Schema({
    videoFile:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    thumbnil:{
        type: String,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    views:{
        type: Number,
        required: true,
        default: 0
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

},{timestamps:true});

videoSchema.plugin(mongooseAggregatePaginate);

export default Video = model("Video",videoSchema);