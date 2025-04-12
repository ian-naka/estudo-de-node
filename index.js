//importação dos pacotes

const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()
const conn = require('./db/conn')


//template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')


//receber resposta do body

app.use(express.urlencoded({
    extended: true
})) 

app.use(express.json())

//session middleware

app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false, //caiu a sessão desconecta
        saveUninitialized: false,
        store: new FileStore({ //permite salvar as sessões em arquivos
            logFn: function(){},
            path: require('path').join(require('os').tmpdir(), 'sessions'), //as sessions sao onde os dados serao salvos
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000), //forçar expiração
            httpOnly: true
        }
    }),
)

//flash messages

app.use(flash())

app.use(express.static('public'))


// set session to res
app.use((req,res, next) => { //configuração de sessão e respostas
    if(req.session.userid){ // ele vê se o usuário tem a sessão
        res.locals.session = req.session //se sim ele vai salvar o id em todas as requisições e respostas
    }

    next()
})


conn.sync()
.then(() => {
    app.listen(4000, () => {
        console.log('Servidor rodando na porta 4000')
    })
})
.catch((err) => console.log(err))