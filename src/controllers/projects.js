import { getAllProjects } from "../models/projects.js";

const projectsPage = async(req, res) => {
    const projects = await getAllProjects();

    res.render('projects', {
        title: 'Service Projects',
        projects
    });
};
export {projectsPage};