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
    showProjectDetailsPage, 
    showProjectsPage } from './controllers/projects.js';
import { categoriesPage, 
    showCategoryDetailsPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';


const router = express.Router();


router.get('/', homePage);

router.get('/organizations', organizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

router.get('/categories', categoriesPage);
router.get('/category/:id', showCategoryDetailsPage);


// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

router.get('/test-error', testErrorPage); 



export default router;
