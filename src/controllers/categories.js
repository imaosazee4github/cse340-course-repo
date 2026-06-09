import 
{
 getAllCategories,
 getCategoryDetails,
 getProjectsByCategoryId,
 updateCategoryAssignments,
 createCategory,
 updateCategory
 } from "../models/categories.js";
 import {
    getProjectDetails,
    getCategoriesByProjectId
 } from "../models/projects.js"
 import {body, validationResult} from 'express-validator';

const categoryValidation = [
    body("category_name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Category name must be 3–100 characters")
];



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

    res.render("assign-categories", {
        title: "Assign Categories to " + projectDetails.title,
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



const showNewCategoryForm = (req, res) => {

    res.render("new-category", {
        title: "Create New Category"
    });

};

const processNewCategoryForm = async (
    req,
    res
) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.render(
            "new-category",
            {
                title: "Create New Category",
                errors: errors.array()
            }
        );
    }

    const { category_name } = req.body;

    await createCategory(category_name);

    req.flash(
        "success",
        "Category created successfully!"
    );

    res.redirect("/categories");
};

const showEditCategoryForm = async (req, res) => {

    const categoryId = req.params.id;

    const category =
        await getCategoryDetails(categoryId);

    if (!category) {

        return res
            .status(404)
            .render(
                "errors/404",
                {
                    title: "Category Not Found"
                }
            );
    }

    res.render(
        "edit-category",
        {
            title: "Edit Category",
            category
        }
    );
};

const processEditCategoryForm = async (
    req,
    res
) => {

    const categoryId = req.params.id;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.render(
            "edit-category",
            {
                title: "Edit Category",
                category: {
                    category_id: categoryId,
                    category_name:
                        req.body.category_name
                },
                errors: errors.array()
            }
        );
    }

    await  updateCategory(
        categoryId,
        req.body.category_name
    );

    req.flash(
        "success",
        "Category updated successfully!"
    );

    res.redirect(
        `/category/${categoryId}`
    );
};


export {
    categoriesPage, 
    showCategoryDetailsPage, 
    showProjectDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};
