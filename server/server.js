const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const uri = "mongodb://localhost/share-notes";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: false
});


const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

const userRouter = require('./routes/userRoute');
const adminRouter = require('./routes/adminRoutes');

app.use('/admin', adminRouter);
app.use('/', userRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))