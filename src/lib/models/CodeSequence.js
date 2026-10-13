import mongoose from "mongoose";

const codeSequenceSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  value: { type: Number, required: true, min: 0, default: 0 },
}, { versionKey: false, collection: "code_sequences" });

const CodeSequence = mongoose.models.CodeSequence || mongoose.model("CodeSequence", codeSequenceSchema);

export default CodeSequence;
