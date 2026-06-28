import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    user : {type: mongoose.Schema.ObjectId, ref : 'User'},
    title: { type: String },
    description: { type: String },
    isCompleted: { type: Boolean, default : false },
  },
  { timestamps: true },
);

const TaskModel = mongoose.model("task", TaskSchema);

export default TaskModel;
