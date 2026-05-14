import db from '../models/db.js';

const getAllorganizations = async() => {
    try {
    const query = `
        SELECT organization_id, 
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
export { getAllorganizations };