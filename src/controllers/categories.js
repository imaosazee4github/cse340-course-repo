import 
{
 getAllCategories,
 getCategoryDetails,
 getProjectsByCategoryId
 } from "../models/categories.js";
 import {
    getProjectDetails,
    getCategoriesByProjectId
 } from "../models/projects.js"

const categoriesPage = async(req, res) => {
    const categories = await getAllCategories();

    res.render('categories', {
        title: "Categories",
        categories
    });

};

const showCategoryDetailsPage = async(req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryDetails(categoryId);

     const projects = await getProjectsByCategoryId(categoryId);

     if (!category) {
        return res.status(404).render("errors/404", {
            title: "Category Not Found"
        });
     }
     res.render("category", {
        title: category.category_name,
        category,
        projects
     });

}

const showProjectsDetailsPage = async(req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);

    const categories = await getCategoriesByProjectId(projectId);

    if(!project){
        return res.status(404).render("errors/404", {
            title: "Project Not Found"
        });
    }
    res.render("project", {
        title: project.title,
        project,
        categories
    });
};



export {categoriesPage, showCategoryDetailsPage, showProjectsDetailsPage};
