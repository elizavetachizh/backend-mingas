export const keys = {
  // MONGODB_URI:
  //   "mongodb+srv://elizavetachizh:mwSF7rcHYSd0XO2Z@cluster0.ct1ltqh.mongodb.net/?retryWrites=true&w=majority",
  // MONGODB_URI: `mongodb://localhost:27017`,
  MONGODB_URI: `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017`,
  SESSION_SECRET: "some secret value",
  database: "test",
  imgBucket: "photos",
  documentsBucket: "documents",
  gratitudeBucket: "gratitude",
  pricesBucket: "prices",
};
// MONGODB_URI:
//     "mongodb+srv://elizavetachizh:mwSF7rcHYSd0XO2Z@cluster0.ct1ltqh.mongodb.net/?retryWrites=true&w=majority",
// MONGODB_URI:
//     "mongodb://root:v|}BfYvNXhQed5yH@mongo:27017",
//     "mongodb://root:o2R2H*%7BU@172.17.20.10:27017/?authMechanism=DEFAULT",
