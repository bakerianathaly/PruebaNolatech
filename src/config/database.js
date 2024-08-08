import mongoose from 'mongoose'

export const connectDB = () => 
  {
    const { MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
  } = process.env
  
  const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`
  
  mongoose.connect(url).then( function() {
    console.log('MongoDB is connected')
  })
    .catch( function(err) {
    console.log(err)
  })
}