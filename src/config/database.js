import mongoose from 'mongoose'

export const connectDB = () => {
    
    const { MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
  } = process.env

  console.log(process.env.MONGO_USERNAME)
  
  const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`
  console.log(url)
  mongoose.connect(url).then( function() {
    console.log('MongoDB is connected')
  })
    .catch( function(err) {
    console.log(err)
  })
}

// //Conexión a mongo DB
// mongoose.connect('mongodb+srv://admin:admin@cluster0.m4rkv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true, useFindAndModify: false })
// //DB local: mongodb://localhost/pruebaasistensi
// mongoose.connection.once("open", () =>{
//     console.log("Connected to DB")
// }).on("error", err =>{
//     console.warn("Error ", err)
// })
