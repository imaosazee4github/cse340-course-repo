import { getAllorganizations } from "../models/organizations.js";

const organizationsPage = async(req, res) => {
    const organizations = await getAllorganizations();

    res.render('organizations', {
        title: 'Our partner Organizations',
        organizations
    });
};
export {organizationsPage}