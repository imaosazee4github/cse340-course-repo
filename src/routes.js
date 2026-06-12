import express from 'express';
import { homePage } from './controllers/index.js';
import { 
    organizationsPage, 
    organizationValidation, 
    processEditOrganizationForm,
    processNewOrganizationForm, 
    showEditOrganizationForm, 
    showNewOrganizationForm, 
    showOrganizationDetailsPage } from './controllers/organizations.js';
import {
    processNewProjectForm,
    processEditProjectForm,
    projectValidation,
    showNewProjectForm,
    showEditProjectForm,
    showProjectDetailsPage, 
    showProjectsPage 
} from './controllers/projects.js';

import { categoriesPage, 
    processAssignCategoriesForm, 
    showAssignCategoriesForm, 
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
 } from './controllers/categories.js';
 import { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, requireLogin, showDashboard, requireRole, showUsersPage } from './controllers/users.js';
import { testErrorPage } from './controllers/errors.js';


const router = express.Router();


router.get('/', homePage);

router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireRole('admin'), showUsersPage);

router.get('/organizations', organizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

router.get('/categories', categoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get("/new-category", showNewCategoryForm);

router.get("/project/:projectId/assign-categories", requireRole('admin'), showAssignCategoriesForm);
router.post("/project/:projectId/assign-categories", requireRole('admin'), processAssignCategoriesForm);
router.post("/new-category", categoryValidation, processNewCategoryForm);
router.get("/edit-category/:id", requireRole('admin'), showEditCategoryForm);
router.post("/edit-category/:id", requireRole('admin'), categoryValidation, processEditCategoryForm);

// Route for new organization page
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

router.get('/test-error', testErrorPage); 



export default router;
