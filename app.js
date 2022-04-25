require('dotenv').config()
// async errors
require('express-async-errors')


const express = require('express');
const app = express();
const connectDB = require('./db/connect')
const notFoundMiddleware = require('./middleware/notFound')
const errorHandlerMiddleware = require('./middleware/errorHandler')

const productsRoute = require('./routes/productsRoute')

// middleware
app.use(express.json())

// routes
app.get('/', (req, res) => {
  res.send(`<h1>Store API</h1><a href="/api/v1/products">products route</a>`)
})

app.use('/api/v1/products', productsRoute)

// products routes



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware)




const port = process.env.PORT || 3000


const start  = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    console.log('DB Connection successful');
    app.listen(port, () => {
      console.log(`server listening on port ${port}...`);
    })
    
  } catch (error) {
    console.log(error)
  }
}

start()