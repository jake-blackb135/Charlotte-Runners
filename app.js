const express = require('express');
const morgan = require('morgan');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const mainRoutes = require('./routes/mainRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');



const app = express();

let port = 5500;
let host = 'localhost';
const url = "mongodb+srv://username:password@cluster0.tkqachs.mongodb.net/ndba-project3";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

app.set('view engine','ejs');



mongoose.connect(url)
.then(()=>{
    //start the server
    app.listen(port, host, ()=>{
        console.log('Server is running on port ' + port);
    })
})
.catch(err=> console.log(err.message));

app.use(session({
    secret: 'abschjbsbhchs',
    resave:false,
    saveUninitialized:false,
    store: new MongoStore({mongoUrl: url}),
    cookie: {maxAge: 60*60*1000}
}));

app.use(flash());

app.use((req,res,next) => {
    res.locals.user = req.session.user||null;
    res.locals.userName = req.session.userName||null;
    
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

  


app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use('/', mainRoutes);
app.use('/events', eventRoutes);
app.use('/users', userRoutes);

app.get('/', (req,res)=>{
    res.render('index');
});

app.use((req,res,next)=>{
    let err=new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});
app.use((err,req,res,next)=>{
    
    if (!err.status){
        err.status=500;
        err.message='Internal Server Error';
    }
    res.status = err.status;
    res.render('error',{err,err});
});



