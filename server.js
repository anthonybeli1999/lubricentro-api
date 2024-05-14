const express = require('express')
const cors = require('cors')

const app = express()

//MIDDLEWARE
app.use(cors())
app.use(express.json())

//ROUTERS

const clienteRouter = require('./routes/clienteRouter.js')
app.use('/api/cliente', clienteRouter)

const vehiculoRouter = require('./routes/vehiculoRouter.js')
app.use('/api/vehiculo', vehiculoRouter)

const servicioRouter = require('./routes/servicioRouter.js')
app.use('/api/servicio', servicioRouter)

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