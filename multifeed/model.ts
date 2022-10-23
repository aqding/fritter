import type { Types, PopulatedDoc, Document } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";

export type Multifeed = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  name: string;
  content: Array<Types.ObjectId>;
};

export type PopulatedMultifeed = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  name: string;
  content: Array<User>;
};

const MultifeedSchema = new Schema<Multifeed>({
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  content: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: "User",
  },
});

const MultifeedModel = model<Multifeed>("Multifeed", MultifeedSchema);
export default MultifeedModel;
