import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', {
        title: 'Register'
    });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await createUser(name, email, passwordHash);

    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/');
};

const showLoginForm = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    const user = await authenticateUser(email, password);

    if (user) {
        // Store user in session
        req.session.user = user;

        req.flash('success', 'Login successful!');

        console.log('User logged in:', user);

        return res.redirect('/dashboard');
    }

    req.flash('error', 'Invalid email or password.');
    return res.redirect('/login');
};

const processLogout = (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }
    req.flash('success', 'You have been logged out.');
    res.redirect('/');
}

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access this page.');
        return res.redirect('/login');
    }
    next();
}

const showDashboard = (req, res) => {
    const user = req.session.user;

    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};


export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard
};