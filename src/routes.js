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
 import { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, requireLogin, showDashboard } from './controllers/users.js';
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

router.get('/organizations', organizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

router.get('/categories', categoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get("/new-category", showNewCategoryForm);

router.get("/project/:projectId/assign-categories", showAssignCategoriesForm);
router.post("/project/:projectId/assign-categories",  processAssignCategoriesForm);
router.post("/new-category", categoryValidation, processNewCategoryForm);
router.get("/edit-category/:id", showEditCategoryForm);
router.post("/edit-category/:id",  categoryValidation, processEditCategoryForm);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

router.get('/test-error', testErrorPage); 



export default router;
