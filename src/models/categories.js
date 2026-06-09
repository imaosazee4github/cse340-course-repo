import db from '../models/db.js';

const getAllCategories = async() => {
    try{

        const query = `
            SELECT * FROM category
            ORDER BY category_name;
            `;
        const result = await db.query(query);

        return result.rows;

    }catch(error){
        console.error("Error getting categories:", error);
        return [];
    }
}

const getCategoryDetails = async (categoryId) => {
    try{
        const query = `
             SELECT 
                category_id,
                category_name
            FROM category
            WHERE category_id = $1
        `;
        const result = await db.query(query, [categoryId]);

        return result.rows.length > 0 
               ? result.rows[0] 
               : null;

    }catch(error){
        console.error("Database query error in GetCategoryDetails:", error);

        return null;
    }
}

const getProjectsByCategoryId = async (categoryId) => {
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
        JOIN project_category
            ON service_project.project_id = project_category.project_id
              JOIN organization
                ON service_project.organization_id = organization.organization_id
            WHERE project_category.category_id = $1
            ORDER BY service_project.project_date ASC;
        `;
        const result = await db.query(query, [categoryId]);

        return result.rows;
    }catch(error){
        console.error("Database query error in getProjectsByCategoryId:", error);
        return [];
    }
}

const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
    INSERT INTO project_category (
    project_id,
    category_id
    ) VALUES ($1, $2);
     `;
     await db.query(query, [projectId, categoryId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
    DELETE FROM project_category
    WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    if(categoryIds && categoryIds.length > 0){
        for(const categoryId of categoryIds){
            await assignCategoryToProject(projectId, categoryId);
        }
    }
};

const createCategory = async (categoryName) => {
    const query = `
        INSERT INTO category (
            category_name
        )
        VALUES ($1)
        RETURNING category_id;
    `;

    const result = await db.query(query, [categoryName]);

    if (result.rows.length === 0) {
        throw new Error("Failed to create category");
    }

    return result.rows[0].category_id;
};

const  updateCategory = async (
    categoryId,
    categoryName
) => {

    const query = `
        UPDATE category
        SET category_name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

    const result = await db.query(
        query,
        [categoryName, categoryId]
    );

    if (result.rows.length === 0) {
        throw new Error("Failed to update category");
    }

    return result.rows[0].category_id;
};


export {
    getAllCategories,
    getCategoryDetails, 
    getProjectsByCategoryId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
};


