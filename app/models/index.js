const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

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

db.settings = require("./setting.model.js")(sequelize, Sequelize);
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

db.ROLES = ["inventory_user", "inventory_manager", "partner_user", "partner_manager", 
	"trans_user", "trans_manager", "admin"];

module.exports = db;