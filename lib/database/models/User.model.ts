import { model, models, Schema } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  photo: string;
  clerkId: string;
  planId: string;
  creditBalance: number;
}

const UserSchema = new Schema({
  firstName: { type: "string", required: true },
  lastName: { type: "string", required: true },
  email: { type: "string", required: true, unique: true },
  username: { type: "string", required: true, unique: true },
  photo: { type: "string", required: true },
  clerkId: { type: "string", required: true, unique: true },
  planId: { type: "string", required: true, default: 1 },
  creditBalance: { type: "number", required: true, default: 5 },
});

const User = models?.User || model("User", UserSchema);
export default User;
