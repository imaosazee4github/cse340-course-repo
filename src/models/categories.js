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
    }
}

export {getAllCategories};
