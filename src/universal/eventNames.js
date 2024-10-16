module.exports = {
    loginEvent: "login", // login password
    updateUserEvent: "update:user", // login name id password
    createProductEvent: "create:product", // *Product
    listProductEvent: "list:product",
    oneProductEvent: "one:product", // id
    updateProductEvent: "update:product", // *Product + id
    deleteProductEvent: "delete:product", // id
    listArchivesEvent: "list:archives",
    createLeadEvent: "create:lead", // *Lead
    listLeadEvent: "list:lead",
    oneLeadEvent: "one:lead", // id
    updateLeadEvent: "update:lead", // *Lead + id
    deleteLeadEvent: "delete:lead", // id
    createCompanyEvent: "create:company", // *Company
    listCompanyEvent: "list:company",
    oneCompanyEvent: "one:company", // id
    updateCompanyEvent: "update:company", // *Company + id
    deleteCompanyEvent: "delete:company", // id
    createWorkerEvent: "create:worker", // *Worker
    listWorkerEvent: "list:worker",
    oneWorkerEvent: "one:worker", // id
    updateWorkerEvent: "update:worker", // *Worker + id
    deleteWorkerEvent: "delete:worker", // id
    createCategoryEvent: "create:category", // *Category
    listCategoryEvent: "list:category",
    oneCategoryEvent: "one:category", // id
    updateCategoryEvent: "update:category", // *Category + id + add(Boolean) + firma_summa
    deleteCategoryEvent: "delete:category", // id
    createInvalidEvent: "create:invalid",
    listInvalidEvent: "list:invalid",
    homeEvent: "home",
};

/* 
    *Product {
        name: String,
        phone: String,
        type: String,
        price: String,
        color: String,
        service: String,
        address: String,
        status: String,
        advance: String,
        balance: String,
        date1: Date,
        date2: Date,
    }
    *Lead {
        name: String,
        phone: String,
        service: String,
        status: String,
        description: String,
        consultation: Boolean,
    }
    *Company {
            name: String,
            username: String,
            manager: String,
            phone_username: String,
            phone_manager: String,
            status: String,
            address: String,
            tax_phone: String,
            email: String,
            date: Date,
    }
    *Worker {
        name: String,
        foiz: String,
    }
    *Category {
        name: String,
        firma_id: String,
        summa: Number
    }
*/