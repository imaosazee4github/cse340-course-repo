import { body, validationResult } from "express-validator";
import { getAllorganizations } from "../models/organizations.js";
import {getAllProjects, getUpcomingProjects,  getCategoriesByProjectId, getProjectDetails, createProject } from "../models/projects.js";
import { updateProject } from "../models/projects.js";
import { getProjectWithVolunteerStatus } from "../models/volunteers.js";
// import { getProjectCategories } from "../models/projects.js";


const NUMBER_OF_UPCOMING_PROJECTS = 5;


const projectValidation = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3,max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),

    body('description')
        .trim()
        .notEmpty() 
        .withMessage('Description is required')
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 200 characters'),

    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Date must be a valid date'),

        body('location')
        .trim()
        .notEmpty() 
        .withMessage('Location is required')
        .isLength({ max: 200 })
        .withMessage('Location must be less than 200 characters'),

    body('organizationId')
        .notEmpty()
        .withMessage('Organization is required')
        .isInt()
        .withMessage('Organization ID must be an integer')  
];

const projectsPage = async(req, res) => {
    const projects = await getAllProjects();
    res.render('projects', {
        title: 'Service Projects',
        projects
    });
};

const showProjectsPage = async(req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    res.render("projects", {
        title: "Upcoming Service Projects",
        projects
    });
};

const showProjectDetailsPage = async(req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user ? req.session.user.user_id : null;

    const project = await getProjectWithVolunteerStatus(projectId, userId);
    const categories = await getCategoriesByProjectId(projectId);

    if(!project){
        return res.status(404).render("errors/404", {
            title: "Project Not Found"
        });
    }

    res.render("project", {
        title: project.title,
        project,
        categories
    });
}

const showNewProjectForm = async(req, res) => {
    const organizations = await getAllorganizations();

    res.render("new-project", {
        title: "Add New Service Project",
        organizations
    });
};

const processNewProjectForm = async(req, res) => {
    const results = validationResult(req);

    if(!results.isEmpty()){
         results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
    

        const organizations = await getAllorganizations();

        return res.render("new-project", {
            title: "Add New Service Project",
            organizations,
        });
    }

    const { organizationId, title, description, date, location } = req.body;

       const newProject = await createProject(title, description, date, location, organizationId);

       req.flash("success", "Project added successfully!");
         res.redirect(`/projects`);
};

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    const organizations = await getAllorganizations();

    if (!project) {
        return res.status(404).render("errors/404", {
            title: "Project Not Found"
        });
    }

    res.render("edit-project", {
        title: "Edit Project",
        project,
        organizations
    });
};

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const results = validationResult(req);

    if (!results.isEmpty()) {
        const organizations = await getAllorganizations();

        return res.render("edit-project", {
            title: "Edit Project",
            project: {
                ...req.body,
                project_id: projectId
            },
            organizations
        });
    }

    const {
        title,
        description,
        location,
        date,
        organizationId
    } = req.body;

    await updateProject(
        projectId,
        title,
        description,
        date,
        location,
        organizationId
    );

    req.flash(
        "success",
        "Project updated successfully!"
    );

    res.redirect(`/project/${projectId}`);
};



export {
    projectsPage, 
    showProjectsPage, 
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
};