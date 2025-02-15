const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Affiche la page de connexion.
 * @route GET /
 * @param {Object} req - Objet de requête Express.
 * @param {Object} res - Objet de réponse Express.
 */
exports.login = (req, res) => {
    res.render('index');
};

/**
 * Gère l'authentification de l'utilisateur.
 * @route POST /login
 * @param {Object} req - Objet de requête Express.
 * @param {Object} res - Objet de réponse Express.
 */
exports.loginPost = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            req.session.message = 'Utilisateur non trouvé';
            req.session.messageType = 'error';
            return res.redirect('/');
        }

        if (user.password !== password) {
            req.session.message = 'Mot de passe incorrect';
            req.session.messageType = 'error';
            return res.redirect('/');
        }

        req.session.userId = user._id;
        req.session.userName = user.name;

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        req.session.message = 'Erreur de connexion';
        req.session.messageType = 'error';
        res.redirect('/');
    }
};

/**
 * Gère l'inscription d'un nouvel utilisateur.
 * @route POST /register
 * @param {Object} req - Objet de requête Express.
 * @param {Object} res - Objet de réponse Express.
 */
exports.register = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.session.message = 'Cet utilisateur existe déjà';
            req.session.messageType = 'error';
            return res.redirect('/');
        }

        const newUser = new User({ email, password, name });
        await newUser.save();

        req.session.message = 'Inscription réussie !';
        req.session.messageType = 'success';
        res.redirect('/');
    } catch (error) {
        console.error(error);
        req.session.message = "Erreur lors de l'inscription";
        req.session.messageType = 'error';
        res.redirect('/');
    }
};

/**
 * Gère la déconnexion de l'utilisateur.
 * @route POST /logout
 * @param {Object} req - Objet de requête Express.
 * @param {Object} res - Objet de réponse Express.
 */
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Erreur lors de la déconnexion :", err);
            return res.status(500).json({ message: "Erreur lors de la déconnexion" });
        }
        res.redirect('/');
    });
};
