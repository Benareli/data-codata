const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.settings = require("./setting.model.js")(mongoose);
db.prefs = require("./pref.model.js")(mongoose);
db.logs = require("./log.model.js")(mongoose);
db.ids = require("./id.model.js")(mongoose);
db.products = require("./product.model.js")(mongoose);
db.productcats = require("./productcat.model.js")(mongoose);
db.brands = require("./brand.model.js")(mongoose);
db.uomcats = require("./uomcat.model.js")(mongoose);
db.uoms = require("./uom.model.js")(mongoose);
db.bundles = require("./bundle.model.js")(mongoose);
db.warehouses = require("./warehouse.model.js")(mongoose);
db.stores = require("./store.model.js")(mongoose);
db.partners = require("./partner.model.js")(mongoose);
db.stockmoves = require("./stockmove.model.js")(mongoose);
db.stockrequests = require("./stockrequest.model.js")(mongoose);
db.qofs = require("./qof.model.js")(mongoose);
db.qops = require("./qop.model.js")(mongoose);
db.possessions = require("./possession.model.js")(mongoose);
db.poss = require("./pos.model.js")(mongoose);
db.posdetails = require("./posdetail.model.js")(mongoose);
db.purchases = require("./purchase.model.js")(mongoose);
db.purchasedetails = require("./purchasedetail.model.js")(mongoose);
db.sales = require("./sale.model.js")(mongoose);
db.saledetails = require("./saledetail.model.js")(mongoose);
db.payments = require("./payment.model.js")(mongoose);
db.coas = require("./coa.model.js")(mongoose);
db.taxs = require("./tax.model.js")(mongoose);
db.journals = require("./journal.model.js")(mongoose);
db.entrys = require("./entry.model.js")(mongoose);
db.boms = require("./bom.model.js")(mongoose);
db.costings = require("./costing.model.js")(mongoose);

db.projects = require("./project.model.js")(mongoose);
db.tasks = require("./task.model.js")(mongoose);
db.tickets = require("./ticket.model.js")(mongoose);

db.users = require("./useruser.model.js")(mongoose);
db.role = require("./userrole.model.js")(mongoose);
db.user = require("./user.model");
db.role = require("./role.model");

db.ROLES = ["inventory_user", "inventory_manager", "partner_user", "partner_manager", 
	"trans_user", "trans_manager", "admin"];

module.exports = db;