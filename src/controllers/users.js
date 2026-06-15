import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';
import { getVolunteeredProjects } from '../models/volunteers.js';

const requireRole = (role) => {
    return (req, res, next) => {

        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in.');
            return res.redirect('/login');
        }

        if (req.session.user.role_name !== role) {
            req.flash('error', 'Access denied.');
            return res.redirect('/');
        }

        next();
    };
};

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

    if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
    }

    // Store user in session
    req.session.user = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role_name: user.role_name
    };

        req.flash('success', 'Login successful!');

        console.log('User logged in:', req.session.user);

        return res.redirect('/dashboard');
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

const showDashboard = async(req, res) => {
    const user = req.session.user;

    const volunteeredProjects = await  getVolunteeredProjects(user.user_id);

    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email,
        user,
        isLoggedIn: true,
        volunteeredProjects: volunteeredProjects
    });
};

const showUsersPage = async (req, res) => {
    const db = (await import('../models/db.js')).default;

    const result = await db.query(`
        SELECT 
            u.name,
            u.email,
            r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.user_id ASC
    `);

    res.render('users', {
        title: 'Registered Users',
        users: result.rows
    });
};


export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage
};