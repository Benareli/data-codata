const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Accounting
db.coas = require("./accounting/coa.model.js")(sequelize, Sequelize);
db.entrys = require("./accounting/entry.model.js")(sequelize, Sequelize);
db.journals = require("./accounting/journal.model.js")(sequelize, Sequelize);
db.payments = require("./accounting/payment.model.js")(sequelize, Sequelize);
db.taxs = require("./accounting/tax.model.js")(sequelize, Sequelize);

//Masterdata
db.boms = require("./masterdata/bom.model.js")(sequelize, Sequelize);
db.brands = require("./masterdata/brand.model.js")(sequelize, Sequelize);
db.bundles = require("./masterdata/bundle.model.js")(sequelize, Sequelize);
db.costings = require("./masterdata/costing.model.js")(sequelize, Sequelize);
db.partners = require("./masterdata/partner.model.js")(sequelize, Sequelize);
db.products = require("./masterdata/product.model.js")(sequelize, Sequelize);
db.productcats = require("./masterdata/productcat.model.js")(sequelize, Sequelize);
db.uoms = require("./masterdata/uom.model.js")(sequelize, Sequelize);
db.uomcats = require("./masterdata/uomcat.model.js")(sequelize, Sequelize);
db.warehouses = require("./masterdata/warehouse.model.js")(sequelize, Sequelize);

//Transaction - Purchase
db.purchases = require("./transaction/purchase/purchase.model.js")(sequelize, Sequelize);
db.purchasedetails = require("./transaction/purchase/purchasedetail.model.js")(sequelize, Sequelize);

//Transaction - Sale
db.poss = require("./transaction/sale/pos.model.js")(sequelize, Sequelize);
db.posdetails = require("./transaction/sale/posdetail.model.js")(sequelize, Sequelize);
db.possessions = require("./transaction/sale/possession.model.js")(sequelize, Sequelize);
db.sales = require("./transaction/sale/sale.model.js")(sequelize, Sequelize);
db.saledetails = require("./transaction/sale/saledetail.model.js")(sequelize, Sequelize);

//Transaction - Stock
db.qofs = require("./transaction/stock/qof.model.js")(sequelize, Sequelize);
db.qops = require("./transaction/stock/qop.model.js")(sequelize, Sequelize);
db.stockmoves = require("./transaction/stock/stockmove.model.js")(sequelize, Sequelize);
db.stockrequests = require("./transaction/stock/stockrequest.model.js")(sequelize, Sequelize);

//Settings
db.companys = require("./settings/company.model.js")(sequelize, Sequelize);
db.ids = require("./settings/id.model.js")(sequelize, Sequelize);
db.logs = require("./settings/log.model.js")(sequelize, Sequelize);
db.prefs = require("./settings/pref.model.js")(sequelize, Sequelize);
db.stores = require("./settings/store.model.js")(sequelize, Sequelize);

//User - Auth
db.users = require("./userauth/useruser.model.js")(sequelize, Sequelize);
//db.role = require("./userauth/userrole.model.js")(sequelize, Sequelize);
db.user = require("./userauth/user.model")(sequelize, Sequelize);
db.role = require("./userauth/role.model")(sequelize, Sequelize);

//__other
/*db.projects = require("./project.model.js")(sequelize, Sequelize);
db.tasks = require("./task.model.js")(sequelize, Sequelize);
db.tickets = require("./ticket.model.js")(sequelize, Sequelize);*/


//Role User
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "role_id",
  otherKey: "user_id"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "user_id",
  otherKey: "role_id"
});

//Id
db.companys.hasMany(db.ids);
db.ids.belongsTo(db.companys, {
  foreignKey: "company_id",
  as: "companys",
});

//Coa
db.companys.hasMany(db.coas);
db.coas.belongsTo(db.companys, {
  foreignKey: "company_id",
  as: "companys",
});

//Entry
db.companys.hasMany(db.entrys);
db.entrys.belongsTo(db.companys, {
  foreignKey: "company_id",
  as: "companys",
});
db.products.hasMany(db.entrys);
db.entrys.belongsTo(db.products, {
  foreignKey: "product_id",
  as: "products",
});
db.coas.hasMany(db.entrys);
db.entrys.belongsTo(db.coas, {
  foreignKey: "debit_id",
  as: "debits",
})
db.coas.hasMany(db.entrys);
db.entrys.belongsTo(db.coas, {
  foreignKey: "credit_id",
  as: "credits",
})

//Journal
db.companys.hasMany(db.journals);
db.journals.belongsTo(db.companys, {
  foreignKey: "company_id",
  as: "companys",
});
db.partners.hasMany(db.journals);
db.journals.belongsTo(db.partners, {
  foreignKey: "partner_id",
  as: "partners",
});

//Journal Entry
db.entrys.belongsToMany(db.journals, {
  through: "journal_entry",
  foreignKey: "entry_id",
  otherKey: "journal_id"
});
db.journals.belongsToMany(db.entrys, {
  through: "journal_entry",
  foreignKey: "journal_id",
  otherKey: "entry_id"
});

//Journal Payment
db.payments.belongsToMany(db.journals, {
  through: "reconcile",
  foreignKey: "payment_id",
  otherKey: "journal_id"
});
db.journals.belongsToMany(db.payments, {
  through: "reconcile",
  foreignKey: "journal_id",
  otherKey: "payment_id"
});

//Warehouse
db.companys.hasMany(db.warehouses);
db.warehouses.belongsTo(db.companys, {
  foreignKey: "company_id",
  as: "companys",
});

//Store
db.companys.hasMany(db.stores);
db.stores.belongsTo(db.companys, {
  foreignKey: "company_id",
  as: "companys",
});
db.warehouses.hasMany(db.stores);
db.stores.belongsTo(db.warehouses, {
  foreignKey: "warehouse_id",
  as: "warehouses",
});

//Uom Uomcat
db.uomcats.hasMany(db.uoms);
db.uoms.belongsTo(db.uomcats, {
  foreignKey: "uomcat_id",
  as: "uomcats",
});

//Product Relation
db.productcats.hasMany(db.products);
db.products.belongsTo(db.productcats, {
  foreignKey: "productcat_id",
  as: "productcats",
})

db.brands.hasMany(db.products);
db.products.belongsTo(db.brands, {
  foreignKey: "brand_id",
  as: "brands",
})

db.taxs.hasMany(db.products);
db.products.belongsTo(db.taxs, {
  foreignKey: "tax_id",
  as: "taxs",
})
db.taxs.hasMany(db.products);
db.products.belongsTo(db.taxs, {
  foreignKey: "taxout_id",
  as: "taxouts",
})

db.uoms.hasMany(db.products);
db.products.belongsTo(db.uoms, {
  foreignKey: "uom_id",
  as: "uoms",
})
db.uoms.hasMany(db.products);
db.products.belongsTo(db.uoms, {
  foreignKey: "puom_id",
  as: "puoms",
})

//Bundle Relation
db.products.hasMany(db.bundles);
db.bundles.belongsTo(db.products, {
  foreignKey: "product_id",
  as: "products",
})
db.uoms.hasMany(db.bundles);
db.bundles.belongsTo(db.uoms, {
  foreignKey: "uom_id",
  as: "uoms",
})

//BOM Relation
db.products.hasMany(db.boms);
db.boms.belongsTo(db.products, {
  foreignKey: "product_id",
  as: "products",
})
db.products.hasMany(db.boms);
db.boms.belongsTo(db.products, {
  foreignKey: "bom_id",
  as: "bomes",
})
db.uoms.hasMany(db.boms);
db.boms.belongsTo(db.uoms, {
  foreignKey: "uom_id",
  as: "uoms",
})
db.companys.hasMany(db.boms);
db.boms.belongsTo(db.companys, {
  foreignKey: "company_id",
  as: "companys",
})
db.products.hasMany(db.costings);
db.costings.belongsTo(db.products, {
  foreignKey: "product_id",
  as: "products",
})

//Stockrequest
db.products.hasMany(db.stockrequests);
db.stockrequests.belongsTo(db.products, {
  foreignKey: "product_id",
  as: "products",
})
db.uoms.hasMany(db.stockrequests);
db.stockrequests.belongsTo(db.uoms, {
  foreignKey: "uom_id",
  as: "uoms",
})
db.uoms.hasMany(db.stockrequests);
db.stockrequests.belongsTo(db.uoms, {
  foreignKey: "oriuom_id",
  as: "oriuoms",
})
db.partners.hasMany(db.stockrequests);
db.stockrequests.belongsTo(db.partners, {
  foreignKey: "partner_id",
  as: "partners",
})
db.warehouses.hasMany(db.stockrequests);
db.stockrequests.belongsTo(db.warehouses, {
  foreignKey: "warehouse_id",
  as: "warehouses",
})
db.companys.hasMany(db.stockrequests);
db.stockrequests.belongsTo(db.companys, {
  foreignKey: "company_id",
  as: "companys",
})
db.users.hasMany(db.stockrequests);
db.stockrequests.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "users",
})

//Stockmove
db.products.hasMany(db.stockmoves);
db.stockmoves.belongsTo(db.products, {
  foreignKey: "product_id",
  as: "products",
})
db.uoms.hasMany(db.stockmoves);
db.stockmoves.belongsTo(db.uoms, {
  foreignKey: "uom_id",
  as: "uoms",
})
db.uoms.hasMany(db.stockmoves);
db.stockmoves.belongsTo(db.uoms, {
  foreignKey: "oriuom_id",
  as: "oriuoms",
})
db.partners.hasMany(db.stockmoves);
db.stockmoves.belongsTo(db.partners, {
  foreignKey: "partner_id",
  as: "partners",
})
db.warehouses.hasMany(db.stockmoves);
db.stockmoves.belongsTo(db.warehouses, {
  foreignKey: "warehouse_id",
  as: "warehouses",
})
db.companys.hasMany(db.stockmoves);
db.stockmoves.belongsTo(db.companys, {
  foreignKey: "company_id",
  as: "companys",
})
db.users.hasMany(db.stockmoves);
db.stockmoves.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "users",
})

//QOP
db.products.hasMany(db.qops);
db.qops.belongsTo(db.products, {
  foreignKey: "product_id",
  as: "products",
})
db.uoms.hasMany(db.qops);
db.qops.belongsTo(db.uoms, {
  foreignKey: "uom_id",
  as: "uoms",
})
db.partners.hasMany(db.qops);
db.qops.belongsTo(db.partners, {
  foreignKey: "partner_id",
  as: "partners",
})
db.warehouses.hasMany(db.qops);
db.qops.belongsTo(db.warehouses, {
  foreignKey: "warehouse_id",
  as: "warehouses",
})

//QOF
db.products.hasMany(db.qofs);
db.qofs.belongsTo(db.products, {
  foreignKey: "product_id",
  as: "products",
})
db.uoms.hasMany(db.qofs);
db.qofs.belongsTo(db.uoms, {
  foreignKey: "uom_id",
  as: "uoms",
})
db.partners.hasMany(db.qofs);
db.qofs.belongsTo(db.partners, {
  foreignKey: "partner_id",
  as: "partners",
})
db.warehouses.hasMany(db.qofs);
db.qofs.belongsTo(db.warehouses, {
  foreignKey: "warehouse_id",
  as: "warehouses",
})

//Purchase
db.partners.hasMany(db.purchases);
db.purchases.belongsTo(db.partners, {
  foreignKey: "partner_id",
  as: "partners",
})
db.warehouses.hasMany(db.purchases);
db.purchases.belongsTo(db.warehouses, {
  foreignKey: "warehouse_id",
  as: "warehouses",
})
db.users.hasMany(db.purchases);
db.purchases.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "users",
})
db.companys.hasMany(db.purchases);
db.purchases.belongsTo(db.companys, {
  foreignKey: "company_id",
  as: "companys",
})

//Purchase Detail
db.purchases.hasMany(db.purchasedetails);
db.purchasedetails.belongsTo(db.purchases, {
  foreignKey: "purchase_id",
  as: "purchases",
})
db.partners.hasMany(db.purchasedetails);
db.purchasedetails.belongsTo(db.partners, {
  foreignKey: "partner_id",
  as: "partners",
})
db.warehouses.hasMany(db.purchasedetails);
db.purchasedetails.belongsTo(db.warehouses, {
  foreignKey: "warehouse_id",
  as: "warehouses",
})
db.products.hasMany(db.purchasedetails);
db.purchasedetails.belongsTo(db.products, {
  foreignKey: "product_id",
  as: "products",
})
db.uoms.hasMany(db.purchasedetails);
db.purchasedetails.belongsTo(db.uoms, {
  foreignKey: "uom_id",
  as: "uoms",
})
db.uoms.hasMany(db.purchasedetails);
db.purchasedetails.belongsTo(db.uoms, {
  foreignKey: "oriuom_id",
  as: "oriuoms",
})
db.companys.hasMany(db.purchasedetails);
db.purchasedetails.belongsTo(db.companys, {
  foreignKey: "company_id",
  as: "companys",
})

db.journal_type = ["miscellaneous", "invoice", "bill", "payment", "stock", "pos"];

module.exports = db;