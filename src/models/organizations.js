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

export { getAllorganizations, getOrganizationDetails};