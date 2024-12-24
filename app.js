const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//3 - invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' }) 

//4 - el directorio public
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

//5 - Establecer motor de plantillas
app.set('view engine', 'ejs');

//6 - Invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

//7 - var de session
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//8 - Invocacion al modulo de la conexion de la BD
const connection = require('./database/db'); 


//9 - Estableciendo las rutas
app.get('/login', (req, res) => {
    res.render('login',);
});
//9 - Estableciendo las rutas
app.get('/inicio', (req, res) => {
    res.render('inicio',);
});
//9 - Estableciendo las rutas
app.get('/nosotros', (req, res) => {
    res.render('nosotros',);
});

//9 - Estableciendo las rutas
app.get('/register', (req, res) => {
    res.render('register',);
});

//10 - Registracion de users
app.post('/register', async (req, res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass,8);
    connection.query('INSERT INTO userss SET ?', {user:user, name:name, rol:rol, pass:passwordHaash}, async(error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('register', {
                alert:true,
                alertTitle: "Registro Exitoso",
                alertMessage: "Este es el mensaje de alerta.",
                alertIcon: 'success',
                showConfirmButton:false,
                timer: 1500,
                ruta: ''
            })
        }
    })
})


//10 - login autenticacion
app.post('/auth', async (req,res)=>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if(user && pass){
        connection.query('SELECT * FROM userss where user = ?', [user], async (error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.render('login', {
                    alert:true,
                    alertTitle: "Error",
                    alertMessage: "Usuario o contraseña incorrectos.",
                    alertIcon: 'filed',
                    showConfirmButton:true,
                    timer: false,
                    ruta: 'login'
                })
            }else{
                req.session.loggedin = true;
                req.session.name = results[0].name
                res.render('login', {
                    alert:true,
                    alertTitle: "Success",
                    alertMessage: "Inicio de sesion correcto",
                    alertIcon: 'success',
                    showConfirmButton:false,
                    timer: 1500,
                    ruta: ''
                })
            }
        })
    }else{
        res.send('Porfavor ingrese un usuario')
    }

})

//11 - Auth Pages
app.get('/', (req,res)=>{
    if(req.session.loggedin){
        res.render('index',{
            login: true,
            name: req.session.name
        });
        }else{
            res.render('index',{
                login: false,
                name:'Debe iniciar sesion'
            })
        }
    })

//12 - logout
app.get('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})
app.listen(3050, () => {
    console.log('SERVER RUNNING IN http://localhost:3050');
});
