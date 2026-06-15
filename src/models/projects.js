import db from "../models/db.js";

const getAllProjects = async () => {

    try {

        const query = `
            SELECT
                service_project.project_id,
                service_project.title,
                service_project.project_description,
                service_project.location,
                service_project.project_date,
                organization.organization_name
            FROM public.service_project
            INNER JOIN public.organization
            ON service_project.organization_id = organization.organization_id
            ORDER BY service_project.project_date ASC;
        `;

        const result = await db.query(query);

        return result.rows;

    } catch (error) {

        console.error("Database query error in getAllProjects:", error);

    }

};

const getProjectsByOrganizationId = async(organizationId) => {
    try {
        const query = `
          SELECT 
             project_id,
             organization_id,
             title,
             project_description AS description,
             location,
             project_date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY project_date ASC;
        `;

        const queryParams = [organizationId];
        const result = await db.query(query, queryParams);

        return result.rows;

    }catch(error){
        console.error("Database query error in getProjectsByOrganizationId:", error);
        return [];
    }
};

const getUpcomingProjects = async(number_of_projects) => {
    try  {
        const query = `
        SELECT
            service_project.project_id,
            service_project.title,
            service_project.project_description,
            service_project.project_date,
            service_project.location,
            organization.organization_id,
            organization.organization_name
        FROM public.service_project
        JOIN organization
            ON service_project.organization_id = organization.organization_id
        WHERE service_project.project_date >= CURRENT_DATE
        ORDER BY service_project.project_date ASC
        LIMIT $1;
        `;  
        const result =  await db.query(query, [number_of_projects]);
        return result.rows;     
    }catch(error){
        console.error("Database query error in  getUpcomingProjects:", error);
        return [];
    }
}



const getProjectDetails= async(projectId) => {
  try{
    const query = `
    SELECT 
         service_project.project_id,
         service_project.title,
         service_project.project_description AS description,
         service_project.project_date AS date,
         service_project.location,
         organization.organization_id,
         organization.organization_name
    FROM service_project
    JOIN organization
        ON service_project.organization_id = organization.organization_id
    WHERE service_project.project_id = $1;
    `;
   const result = await db.query(query, [projectId]);
   return result.rows.length > 0 
          ? result.rows[0] 
          : null;

  }catch(error){
    console.error("Database query error in getProjectDetails:", error);
    return null;
  }
}

const getCategoriesByProjectId = async(projectId) => {
    try{
        const query = `
        SELECT
            category.category_id,
            category.category_name
        FROM category
        JOIN project_category
            ON category.category_id = project_category.category_id
        WHERE project_category.project_id = $1
        `;
        const result = await db.query(query, [projectId]);
        return result.rows;
    } catch(error){
        console.error("Database query error in getCategoriesByProjectId:", error);
        return [];
    }
}

const createProject = async (title, project_description, project_date, location, organization_id) => {
    const query =  `
    INSERT INTO service_project (
    title,
    project_description,
    project_date,
    location,
    organization_id
    ) VALUES ($1, $2, $3, $4, $5)
     RETURNING project_id;
     `;

     const queryParams = [
        title,
        project_description,
        project_date,
        location,
        organization_id
     ];

     const result = await db.query(query, queryParams);

        if(result.rows.length === 0) {
            throw new Error("Failed to create project");
        }
         if(process.env.ENABLE_SQL_LOGGING === 'true') {
            console.log('Created new project with ID:', result.rows[0].project_id);
        }
        return result.rows[0].project_id;
}

const updateProject = async (
    projectId,
    title,
    description,
    date,
    location,
    organizationId
) => {
    const query = `
    UPDATE service_project
    SET title = $1,
        project_description = $2,
        project_date = $3,
        location = $4,
        organization_id = $5
    WHERE project_id = $6
    RETURNING  project_id;
    `;
    const value = [
        title,
        description,
        date,
        location,
        organizationId,
        projectId
    ];

    const result = await db.query(query, value);

       if (result.rows.length === 0) {
        throw new Error("Failed to update project");
    }

    return result.rows[0].project_id;
};

const getProjectDetailsWithVolunteerStatus = async (projectId, userId = null) => {
    const projectQuery = `
        SELECT 
            sp.project_id,
            sp.title,
            sp.project_description as description,
            sp.project_date as date,
            sp.location,
            o.organization_id,
            o.organization_name
        FROM service_project sp
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1
    `;
    
    const projectResult = await db.query(projectQuery, [projectId]);
    
    if (projectResult.rows.length === 0) {
        return null;
    }
    
    const project = projectResult.rows[0];
    
    // Get volunteer count
    const countQuery = `
        SELECT COUNT(*) as count
        FROM project_volunteers
        WHERE project_id = $1
    `;
    const countResult = await db.query(countQuery, [projectId]);
    project.volunteer_count = parseInt(countResult.rows[0].count);
    
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
    


export
 { 
    getAllProjects,
    getProjectsByOrganizationId, 
    getUpcomingProjects, 
    getProjectDetails, 
    getCategoriesByProjectId,
    createProject,
    updateProject,
    getProjectDetailsWithVolunteerStatus
};
