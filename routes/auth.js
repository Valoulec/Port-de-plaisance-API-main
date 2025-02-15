const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * Route pour afficher la page de connexion.
 * @route GET /login
 * @param {Object} req - Objet de requête Express.
 * @param {Object} res - Objet de réponse Express.
 */
router.get('/login', authController.login);

/**
 * Route pour gérer la soumission du formulaire de connexion.
 * @route POST /login
 * @param {Object} req - Objet de requête Express.
 * @param {Object} res - Objet de réponse Express.
 */
router.post('/login', authController.loginPost);

/**
 * Route pour gérer l'inscription d'un utilisateur.
 * @route POST /register
 * @param {Object} req - Objet de requête Express.
 * @param {Object} res - Objet de réponse Express.
 */
router.post('/register', authController.register);

/**
 * Route pour gérer la déconnexion d'un utilisateur.
 * @route POST /logout
 * @param {Object} req - Objet de requête Express.
 * @param {Object} res - Objet de réponse Express.
 */
router.post('/logout', authController.logout);

module.exports = router;

