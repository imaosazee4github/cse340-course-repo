import { getAllorganizations, getOrganizationDetails } from "../models/organizations.js";
import {getProjectsByOrganizationId} from '../models/projects.js';

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
export {organizationsPage, showOrganizationDetailsPage}