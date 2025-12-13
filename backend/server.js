const express = require('express')
require('dotenv').config()
const eventsRoutes = require('./routes/events')
const analyticsRoutes = require('./routes/analytics')
const qrcodeRoutes = require('./routes/qrcode')
const cors = require('cors')

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json())

app.use('/events', eventsRoutes)
app.use('/analytics', analyticsRoutes)
app.use('/qrcode',qrcodeRoutes)

app.get('/', (req, res) => res.send('Bello from Backend API'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server crawling on port ${PORT}`))
