import { addVolunteer, removeVolunteer, isUserVolunteer } from '../models/volunteers.js';
import { getProjectDetails } from '../models/projects.js';

/**
 * Add user as volunteer for a project
 */
const addVolunteerForProject = async (req, res, next) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    
    // Check if project exists
    const project = await getProjectDetails(projectId);
    if (!project) {
        req.flash('error', 'Project not found.');
        return res.redirect('/projects');
    }
    
    // Check if already volunteered
    const alreadyVolunteer = await isUserVolunteer(userId, projectId);
    if (alreadyVolunteer) {
        req.flash('error', 'You have already volunteered for this project.');
        return res.redirect(`/project/${projectId}`);
    }
    
    // Add volunteer
    await addVolunteer(userId, projectId);
    req.flash('success', 'You have successfully volunteered for this project!');
    res.redirect(`/project/${projectId}`);
};

/**
 * Remove user as volunteer from a project
 */
const removeVolunteerFromProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    
    // Check if project exists
    const project = await getProjectDetails(projectId);
    if (!project) {
        req.flash('error', 'Project not found.');
        return res.redirect('/projects');
    }
    
    // Remove volunteer
    await removeVolunteer(userId, projectId);
    req.flash('success', 'You have been removed as a volunteer.');
    
    // Check where the request came from
    const referer = req.get('referer');
    if (referer && referer.includes('/dashboard')) {
        res.redirect('/dashboard');
    } else {
        res.redirect(`/project/${projectId}`);
    }
};

export {
    addVolunteerForProject,
    removeVolunteerFromProject
};