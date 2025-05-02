import mongoose from 'mongoose';

const monogoURI = 'mongodb://localhost:27017/healthcloudDB'


mongoose.connect(monogoURI, {
}).then(() => {
    console.log('MongoDB connected')
}).catch((err) => {
    console.error('MongoDB connection error:', err)
})


const db = mongoose.connection

db.on('connected', () => {
    console.log('MongoDB connected successfully')
})
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.on('disconnected', () => {
    console.log('MongoDB disconnected')
})

export default db;