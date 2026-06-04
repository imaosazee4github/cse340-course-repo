import db from '../models/db.js';

const getAllorganizations = async() => {
    try {
    const query = `
        SELECT 
           organization_id, 
           organization_name, 
           organization_description, 
           organization_email, 
           organization_logo
        FROM public.organization;
        `;

        const result = await db.query(query);

        return result.rows;
} catch(error){
    console.error("Database query error in getAllorganizations:", error);
}
}

const getOrganizationDetails =async(organizationId) => {
    try{
        const query = `
        SELECT 
             organization_id,
             organization_name,
             organization_description,
             organization_email,
             organization_logo
        FROM organization
        WHERE organization_id = $1
        `;
        const result = await db.query(query, [organizationId]);
        return result.rows.length > 0 ? result.rows[0] : null;

    }catch(error){
        console.error("Database query error in getOrganizationDetails;", error)
        return null;
    }
};

/**
 * Creates a new organization in the database.
 * @param {string} name - The name of the organization.
 * @param {string} description - A description of the organization.
 * @param {string} contactEmail - The contact email for the organization.
 * @param {string} logoFilename - The filename of the organization's logo.
 * @returns {string} The id of the newly created organization record.
 */

const createOrganization = async (organization_name, organization_description, organization_email, organization_logo) => {
    try {
        const query = `
        INSERT INTO organization (organization_name, organization_description, organization_email, organization_Logo)
        VALUES ($1, $2, $3, $4)
        RETURNING organization_id
        `;

        const queryParams = [organization_name, organization_description, organization_email, organization_logo];
        const result = await db.query(query, queryParams);

        if (result.rows.length === 0) {
            throw new Error("Failed to create organization");
        }

        if(process.env.ENABLE_SQL_LOGGING === 'true') {
            console.log('Created new organization with ID:', result.rows[0].organization_id);
        }
        return result.rows[0].organization_id;
    }catch(error){
        console.error("Database query error in createOrganization:", error);
        throw error;
    }
}

const updateOrganization = async(
    organizationId, 
    organization_name, 
    organization_description, 
    organization_email, 
    organization_logo) => {
        const query = `
        UPDATE organization
        SET organization_name = $1,
            organization_description = $2,
            organization_email = $3,
            organization_logo = $4
        WHERE organization_id = $5
        RETURNING organization_id
        `;

        const queryParams = [
            organization_name, 
            organization_description, 
            organization_email, 
            organization_logo, 
            organizationId
        ];
        const result = await db.query(query, queryParams);

        if(result.rows.length === 0) {
            throw new Error("Failed to update organization");
        }

        const updatedOrganizationId = result.rows[0].organization_id;

        if(process.env.ENABLE_SQL_LOGGING === 'true') {
            console.log('Updated organization with ID:', organizationId);
        }
        return updatedOrganizationId;
    };
export {
     getAllorganizations, 
     getOrganizationDetails, 
     createOrganization,
     updateOrganization};