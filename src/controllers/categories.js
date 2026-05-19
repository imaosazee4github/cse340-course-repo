import { getAllCategories } from "../models/categories.js";

const categoriesPage = async(req, res) => {
    const categories = await getAllCategories();

    res.render('categories', {
        title: "Categories",
        categories
    });

};

export {categoriesPage};