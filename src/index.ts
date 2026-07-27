import express from 'express';
import path from 'path';

// __dirname ya está disponible en CommonJS
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { title: 'Inicio' });
});

app.get('/otraRuta', (req, res) => {
    res.render('otraruta');
});


app.listen(port, () => {
    console.log(`Servidor Papito en http://localhost:${port}`);
});