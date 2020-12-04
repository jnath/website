import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
const SALT_WORK_FACTOR = 10;

export interface UserDoc extends Document {
  email: string;
  password: string;
  avatar: string;
  refreshTokens: string[];
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  generateRefreshTokens: () => Promise<string>;
}

interface UserModel extends Model<UserDoc> {
  findByCredentials: (email: string, password: string) => Promise<UserDoc>;
  findByRefreshToken: (refreshToken: string) => Promise<UserDoc>;
}

const UserSchema = new Schema<UserDoc>({
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  avatar: { type: String },
  refreshTokens: { type: Array },
});

UserSchema.pre<UserDoc>("save", async function (next: (error?: Error) => void) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  } catch (error) {
    return next(error);
  }

  next();
});

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.findByCredentials = async function (
  email: string,
  password: string
) {
  // Search for a user by email and password.
  const user: UserDoc = await this.model("User").findOne({ email });
  if (!user) {
    throw new Error("Invalid login credentials");
  }
  const isPasswordMatch = user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new Error("Invalid login credentials");
  }
  return user;
};

UserSchema.statics.findByRefreshToken = async function (refreshTokens: string) {
  // Search for a user by email and password.
  const user: UserDoc = await this.model("User").findOne({ refreshTokens });
  if (!user) {
    throw new Error("Invalid refreshToken");
  }

  return user;
};

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.password;
    delete ret.refreshTokens;
  },
});

const User = mongoose.model<UserDoc, UserModel>("User", UserSchema);

export default User;
