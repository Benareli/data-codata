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

db.companys = require("./company.model.js")(sequelize, Sequelize);
db.prefs = require("./pref.model.js")(sequelize, Sequelize);
db.logs = require("./log.model.js")(sequelize, Sequelize);
db.ids = require("./id.model.js")(sequelize, Sequelize);
db.products = require("./product.model.js")(sequelize, Sequelize);
db.productcats = require("./productcat.model.js")(sequelize, Sequelize);
db.brands = require("./brand.model.js")(sequelize, Sequelize);
db.uomcats = require("./uomcat.model.js")(sequelize, Sequelize);
db.uoms = require("./uom.model.js")(sequelize, Sequelize);
db.bundles = require("./bundle.model.js")(sequelize, Sequelize);
db.warehouses = require("./warehouse.model.js")(sequelize, Sequelize);
db.stores = require("./store.model.js")(sequelize, Sequelize);
db.partners = require("./partner.model.js")(sequelize, Sequelize);
db.stockmoves = require("./stockmove.model.js")(sequelize, Sequelize);
db.stockrequests = require("./stockrequest.model.js")(sequelize, Sequelize);
db.qofs = require("./qof.model.js")(sequelize, Sequelize);
db.qops = require("./qop.model.js")(sequelize, Sequelize);
db.possessions = require("./possession.model.js")(sequelize, Sequelize);
db.poss = require("./pos.model.js")(sequelize, Sequelize);
db.posdetails = require("./posdetail.model.js")(sequelize, Sequelize);
db.purchases = require("./purchase.model.js")(sequelize, Sequelize);
db.purchasedetails = require("./purchasedetail.model.js")(sequelize, Sequelize);
db.sales = require("./sale.model.js")(sequelize, Sequelize);
db.saledetails = require("./saledetail.model.js")(sequelize, Sequelize);
db.payments = require("./payment.model.js")(sequelize, Sequelize);
db.coas = require("./coa.model.js")(sequelize, Sequelize);
db.taxs = require("./tax.model.js")(sequelize, Sequelize);
db.journals = require("./journal.model.js")(sequelize, Sequelize);
db.entrys = require("./entry.model.js")(sequelize, Sequelize);
db.boms = require("./bom.model.js")(sequelize, Sequelize);
db.costings = require("./costing.model.js")(sequelize, Sequelize);

/*db.projects = require("./project.model.js")(sequelize, Sequelize);
db.tasks = require("./task.model.js")(sequelize, Sequelize);
db.tickets = require("./ticket.model.js")(sequelize, Sequelize);*/

db.users = require("./useruser.model.js")(sequelize, Sequelize);
//db.role = require("./userrole.model.js")(sequelize, Sequelize);
db.user = require("./user.model")(sequelize, Sequelize);
db.role = require("./role.model")(sequelize, Sequelize);

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

db.ROLES = ["inventory_user", "inventory_manager", "partner_user", "partner_manager", 
	"trans_user", "trans_manager", "admin"];

module.exports = db;