const express = require('express')
const app = express()

const TITLE = 'Webitor'
const PORT = 9001

app.use(express.urlencoded({ extended : false }))
app.use(express.json())
app.use(express.static(__dirname + '/public'))
app.set('json spaces', 4)
app.set('view engine', 'ejs')

app.get('/', (request, response) => {
    response.status(200).render('index')
})

app.listen(PORT, () => {
    console.log(`Web server ${TITLE} running on ${PORT}`)
})
