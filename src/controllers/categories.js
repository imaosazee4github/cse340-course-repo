import 
{
 getAllCategories,
 getCategoryDetails,
 getProjectsByCategoryId,
 updateCategoryAssignments,
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

const showProjectDetailsPage = async(req, res) => {
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

const showAssignCategoriesForm = async(req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
        if(!projectDetails){
            return res.status(404).render("errors/404", {
                title: "Project Not Found"
        });
}

    const categories = await getAllCategories();

    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = "Assign Categories to " + projectDetails.title;

    res.render("assign-categories", {
        title,
        projectId,
        projectDetails,
        categories,
        assignedCategories
    });
};

const processAssignCategoriesForm = async(req, res) => {
    const projectId = req.params.projectId;

    const selectedCategoryIds = req.body.categories || [];

    const categoryIdsArray = Array.isArray(selectedCategoryIds)
         ? selectedCategoryIds
         : [selectedCategoryIds];

         await updateCategoryAssignments(projectId, categoryIdsArray);

         req.flash("success", "Categories updated successfully!");
         res.redirect(`/project/${projectId}`);
}



export {
    categoriesPage, 
    showCategoryDetailsPage, 
    showProjectDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};
