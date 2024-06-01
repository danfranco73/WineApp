import mongoose from 'mongoose';

export default async function mongoSingleton() {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  } else {
    console.log('MongoDB already connected');
  }
}
