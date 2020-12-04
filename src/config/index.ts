import "dotenv/config";

export default {
  session: {
    secret: process.env.SESSION_SECRET,
    expire: "1m",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: "15s", // expires in 15 seconde
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
};
