import { getAllorganizations, createOrganization, getOrganizationDetails, updateOrganization } from "../models/organizations.js";
import {getProjectsByOrganizationId} from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const organizationValidation = [
    body('organization_name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('organization_description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('organization_email')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

const organizationsPage = async(req, res) => {
    const organizations = await getAllorganizations();

    res.render('organizations', {
        title: 'Our partner Organizations',
        organizations
    });
};

const showOrganizationDetailsPage = async(req, res) => {
    const organizationId = req.params.id;

    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);

    if (!organizationDetails) {
        return res.status(404).render('errors/404', {
            title: "Organization Not Found"
        });
    }

    const title = 'Organization Details';

    res.render('organization', {
        title, 
        organizationDetails, 
        projects});
}

const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
}

const processNewOrganizationForm = async (req, res) => {
     const results = validationResult(req);
        if(!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });
            return res.redirect('/new-organization');
        }

    const { organization_name, organization_description, organization_email, organization_logo } = req.body;
    const logoFilename = 'placeholder-logo.png';

    const organizationId = await createOrganization(
        organization_name, 
        organization_description, 
        organization_email, 
        logoFilename);

    req.flash('success', 'Organization added successfully!');

    res.redirect(`/organization/${organizationId}`);
};

const showEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);

    if(!organizationDetails) {
        return res.status(404).render("errors/404", {
            title: "Organization Not Found"
        });
    }
    return res.render('edit-organization', { 
        title: "Edit Organization",
        organizationDetails 
    });
};

const processEditOrganizationForm = async(req, res) => {
    const results = validationResult(req);

    if(!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-organization/${req.params.id}`);
    }

    const organizationId = req.params.id;

    const {
         organization_name, 
         organization_description, 
         organization_email, 
         organization_logo } = req.body;

    await updateOrganization(
        organizationId,
        organization_name, 
        organization_description, 
        organization_email, 
        organization_logo
    );
    req.flash('success', 'Organization updated successfully!');

    res.redirect(`/organization/${organizationId}`);
}



export {
    organizationsPage, 
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm 
};