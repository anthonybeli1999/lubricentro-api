const express = require('express')
const cors = require('cors')

const app = express()

//MIDDLEWARE
app.use(cors())
app.use(express.json())

//ROUTERS

const vehiculoRouter = require('./routes/vehiculoRouter.js')
app.use('/api/vehiculo', vehiculoRouter)

const servicioRouter = require('./routes/servicioRouter.js')
app.use('/api/servicio', servicioRouter)

const marcaRouter = require('./routes/marcaRouter.js')
app.use('/api/marca', marcaRouter)

const modeloRouter = require('./routes/modeloRouter.js')
app.use('/api/modelo', modeloRouter)

//TESTING API

app.get('/', (req, res) => {
    res.json({ message: 'Hola mundo'})
})

//PORT
const PORT = process.env.PORT || 8080

//SERVER

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})