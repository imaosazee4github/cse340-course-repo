import db from './db.js';

const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING *
    `;
    
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2
        RETURNING *
    `;
    
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

const isUserVolunteer = async (userId, projectId) => {
    const query = `
        SELECT * FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2
    `;
    
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

const getVolunteeredProjects = async (userId) => {
    const query = `
        SELECT 
            sp.project_id,
            sp.title,
            sp.project_description,
            sp.project_date,
            sp.location,
            o.organization_name,
            pv.volunteered_at
        FROM project_volunteers pv
        JOIN service_project sp ON pv.project_id = sp.project_id
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY sp.project_date ASC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
};

const getVolunteerCount = async (projectId) => {
    const query = `
        SELECT COUNT(*) as count
        FROM project_volunteers
        WHERE project_id = $1
    `;
    
    const result = await db.query(query, [projectId]);
    return parseInt(result.rows[0].count);
};

const getProjectWithVolunteerStatus = async (projectId, userId = null) => {
    const projectQuery = `
        SELECT 
            sp.project_id,
            sp.title,
            sp.project_description as description,
            sp.project_date as date,
            sp.location,
            o.organization_id,
            o.organization_name,
            (
                SELECT COUNT(*) 
                FROM project_volunteers 
                WHERE project_id = sp.project_id
            ) as volunteer_count
        FROM service_project sp
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1
    `;
    
    const projectResult = await db.query(projectQuery, [projectId]);
    
    if (projectResult.rows.length === 0) {
        return null;
    }
    
    const project = projectResult.rows[0];
    
    // Check if user is a volunteer (if userId provided)
    if (userId) {
        const volunteerQuery = `
            SELECT * FROM project_volunteers
            WHERE user_id = $1 AND project_id = $2
        `;
        const volunteerResult = await db.query(volunteerQuery, [userId, projectId]);
        project.isVolunteer = volunteerResult.rows.length > 0;
    } else {
        project.isVolunteer = false;
    }
    
    return project;
};

export {
    addVolunteer,
    removeVolunteer,
    isUserVolunteer,
    getVolunteeredProjects,
    getVolunteerCount,
    getProjectWithVolunteerStatus
};