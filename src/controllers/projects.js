import { getAllProjects } from "../models/projects.js";
import { getUpcomingProjects,  getCategoriesByProjectId, getProjectDetails } from "../models/projects.js";
// import { getProjectCategories } from "../models/projects.js";


const NUMBER_OF_UPCOMING_PROJECTS = 5;

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

    const project = await getProjectDetails(projectId);
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


export {
    projectsPage, 
    showProjectsPage, 
    showProjectDetailsPage};