/**
 * @file Application principale du projet de gestion du port de plaisance
 * @module app
 */
require("dotenv").config();
console.log("Clé secrète chargée :", process.env.JWT_SECRET);
console.log("🔍 URI MongoDB :", process.env.MONGO_URI);
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');
const path = require("path");
const cookieParser = require("cookie-parser");

// Importation des modèles
const User = require('./models/User');
const Reservation = require('./models/Reservation');
const Catway = require('./models/Catway');

// Importation des routes
const authRouter = require('./routes/auth');
const catwaysRouter = require('./routes/catways');
const reservationsRouter = require('./routes/reservations');
const dashboardRouter = require('./routes/dashboard');
const userRoutes = require('./routes/users');

// Création de l'application Express
const app = express();

/**
 * Configuration du dossier public pour les fichiers statiques
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Configuration des middlewares pour le traitement des requêtes
 */
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Configuration du moteur de vues EJS
 */
app.set('view engine', 'ejs');

/**
 * Configuration des sessions utilisateur
 */
app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Mettre true si HTTPS est utilisé
}));

/**
 * Connexion à la base de données MongoDB
 */
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })

const port = 3000;

/**
 * Démarrage du serveur
 */
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

/**
 * Fonction pour ajouter un utilisateur par défaut au démarrage
 * @async
 * @function createDefaultUser
 * @returns {Promise<void>}
 */
const createDefaultUser = async () => {
    const user = await User.findOne({ email: 'john.doe@mail.com' });
    if (!user) {
        const newUser = new User({
            email: 'john.doe@mail.com',
            password: 'Admin'
        });
        await newUser.save();
        console.log('Utilisateur par défaut créé');
    }
};
createDefaultUser();

/**
 * Routes d'authentification
 */
app.use('/auth', authRouter);

/**
 * Routes des catways
 */
app.use('/catways', catwaysRouter);

/**
 * Routes des réservations
 */
app.use('/reservations', reservationsRouter);

/**
 * Routes du tableau de bord
 */
app.use('/dashboard', dashboardRouter);

/**
 * Routes des utilisateurs
 */
app.use('/users', userRoutes);

/**
 * Route pour la page d'accueil
 * @name GET /
 * @function
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {void} Affiche la page d'accueil
 */
app.get('/', (req, res) => {
    res.render('index');
});

/**
 * Route pour afficher la documentation
 * @name GET /docs
 * @function
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {void} Affiche la documentation
 */
app.use("/docs", express.static(path.join(__dirname, "docs")));

if (process.env.NODE_ENV !== "test") {
    require("child_process").exec("npm test", (error, stdout, stderr) => {
        console.log(stdout);
        if (error) console.error(stderr);
    });
}