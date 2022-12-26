const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const baseurl = require("./app/config/url.config");
const cron = require('node-cron');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

var corsOptions = {
  origin: `${baseurl.baseurl}`
};

global.__basedir = __dirname;

//app.use(helmet());
//app.use(morgan('combined'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

const db = require("./app/models");
const Role = db.role;
const Setting = db.settings;
const Ids = db.ids;
const Pref = db.prefs;
const Log = db.logs;

const Warehouse = db.warehouses;
const Store = db.stores;
const ProductCat = db.productcats;
const Partner = db.partners;
const Product = db.products;
const Uomcat = db.uomcats;
const Uom = db.uoms;
const Stockmove = db.stockmoves;
const Qof = db.qofs;
const Qop = db.qops;
const Coa = db.coas;
const Tax = db.taxs;
const Bom = db.boms;

var uomid;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

app.get("/", cors(corsOptions), (req, res) => {
  res.status(200).send("Welcome");
});

// routes
require("./app/routes/file.routes")(app);

require("./app/routes/id.routes")(app);
require("./app/routes/pref.routes")(app);
require("./app/routes/setting.routes")(app);
require("./app/routes/log.routes")(app);
require("./app/routes/useruser.routes")(app);
require("./app/routes/userrole.routes")(app);
require("./app/routes/coa.routes")(app);
require("./app/routes/tax.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/productcat.routes")(app);
require("./app/routes/uomcat.routes")(app);
require("./app/routes/uom.routes")(app);
require("./app/routes/brand.routes")(app);
require("./app/routes/bundle.routes")(app);
require("./app/routes/warehouse.routes")(app);
require("./app/routes/store.routes")(app);
require("./app/routes/partner.routes")(app);
require("./app/routes/stockmove.routes")(app);
require("./app/routes/stockrequest.routes")(app);
require("./app/routes/qof.routes")(app);
require("./app/routes/qop.routes")(app);
require("./app/routes/possession.routes")(app);
require("./app/routes/pos.routes")(app);
require("./app/routes/posdetail.routes")(app);
require("./app/routes/payment.routes")(app);
require("./app/routes/purchase.routes")(app);
require("./app/routes/purchasedetail.routes")(app);
require("./app/routes/sale.routes")(app);
require("./app/routes/saledetail.routes")(app);
require("./app/routes/entry.routes")(app);
require("./app/routes/journal.routes")(app);
require("./app/routes/bom.routes")(app);
require("./app/routes/costing.routes")(app);

require("./app/routes/ticket.routes")(app);
require("./app/routes/project.routes")(app);

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

//cron schedule
cron.schedule('00 10 * * *', function() {
  console.log('Running stock calculation');
  checkQof();
});

//AI FUCK
function checkQof() {
  const find1 = Qof.find()
    .then(res => {
      if(res.length>0){
        if(res[0].partner){
          withPartner(res[0].product, res[0].partner, res[0].warehouse, res[0].uom);
        }else{
          withoutPartner(res[0].product, res[0].warehouse, res[0].uom);
        }
      }else{console.log("No Data");}
    })
    .catch(error => console.error("001",error));
}

function withPartner(prod1, part1, wh1, uom1) {
  const find2 = Qop.find({product: prod1, partner: part1, warehouse: wh1}).then(res => {
    if(!res.length){
      var qop1 = {product: prod1, partner: part1, warehouse: wh1, qop: 0, uom: uom1};
      Qop.create(qop1).then(res => {
        let qop1 = res._id;
        const prod2 = Product.findOneAndUpdate({_id:prod1}, {$push: {qop: res._id}}, { useFindAndModify: false })
          .then(res => {
            withPartnerCalc(qop1, prod1, part1, wh1);
          }).catch(error => console.error("002",error));
      })
      .catch(error => console.error("003",error));
      

    }else{withPartnerCalc(res[0]._id, prod1, part1, wh1)}
  }).catch(error => console.error("004",error));
}

function withPartnerCalc(qop2, prod2, part2, wh2) {
  const cursor = Qof.find({product:prod2,partner:part2,warehouse:wh2})
    .then(results => {
      let x = 0;
      for (let i = 0; i < results.length; i++){
        x = x + results[i].qof};

      const prod = Product.find({_id:prod2})
        .then(resultsP => {
          let y = resultsP[0].qoh
          const upProd = Product.updateOne({_id:prod2},{qoh: x+y})
            .then(resultsUp => {
              withPartnerEnd(x, qop2, prod2, part2, wh2);
            })
            .catch(error => console.error("005",error));
        })
        .catch(error => console.error("006",error));
    })
    .catch(error => console.error("007",error));
}

function withPartnerEnd(x, qop3, prod3, part3, wh3) {
  const findQop = Qop.find({_id:qop3})
    .then(resultsQop1 => {
      let z = resultsQop1[0].qop
      const upProd = Qop.updateOne({_id:qop3},{qop: x+z})
        .then(resultsQop2 => {
          const delQof = Qof.deleteMany({product:prod3,partner:part3,warehouse:wh3})
            .then(resultsdelQof => {
              console.log(prod3+", "+part3+", "+wh3+" handled");
              checkQof();
            })
            .catch(error => console.error("008",error));
        })
        .catch(error => console.error("009",error));
    })
    .catch(error => console.error("010",error));
}

//Without Partner Start Here
function withoutPartner(proda, wha, uoma){
  const findA = Qop.find({product: proda, warehouse: wha}).then(res => {
    if(!res.length){
      var qopaa = {product: proda, warehouse: wha, qop: 0, uom: uoma};
      Qop.create(qopaa).then(res => {
        let qopa = res._id;
        const prodA = Product.findOneAndUpdate({_id:proda}, {$push: {qop: res._id}}, { useFindAndModify: false })
          .then(res => {
            withoutPartnerCalc(qopa, proda, wha);
          }).catch(error => console.error("011",error));
      })
      .catch(error => console.error("012",error));
      

    }else{withoutPartnerCalc(res[0]._id, proda, wha)}
  }).catch(error => console.error("013",error));
}

function withoutPartnerCalc(qopb, prodb, whb) {
  const cursor = Qof.find({product:prodb, warehouse:whb, partner: { $exists : false }})
    .then(results => {
      let a = 0;
      for (let i = 0; i < results.length; i++){
        a = a + results[i].qof};

      const prod = Product.find({_id:prodb})
        .then(resultsP => {
          let b = resultsP[0].qoh
          const upProd = Product.updateOne({_id:prodb},{qoh: a+b})
            .then(resultsUp => {
              withoutPartnerEnd(a, qopb, prodb, whb);
            })
            .catch(error => console.error("014",error));
        })
        .catch(error => console.error("015",error));
    })
    .catch(error => console.error("016",error));
}

function withoutPartnerEnd(a, qopc, prodc, whc) {
  const findQop = Qop.find({_id:qopc})
    .then(resultsQop1 => {
      let d = resultsQop1[0].qop
      const upProd = Qop.updateOne({_id:qopc},{qop: a+d})
        .then(resultsQop2 => {
          const delQof = Qof.deleteMany({product:prodc, warehouse:whc, partner: { $exists : false }})
            .then(resultsdelQof => {
              console.log(prodc+", "+whc+" handled");
              checkQof();
            })
            .catch(error => console.error("017",error));
        })
        .catch(error => console.error("018",error));
    })
    .catch(error => console.error("019",error));
}
//AI SHIT

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({name: "inventory_user"})
      .save(err => {if (err) {console.error("020", err);}
        console.log("added 'inventory_user' to roles collection");
      });
      new Role({name: "inventory_manager"})
      .save(err => {if (err) {console.error("021", err);}
        console.log("added 'inventory_manager' to roles collection");
      });
      new Role({name: "partner_user"})
      .save(err => {if (err) {console.error("022", err);}
        console.log("added 'partner_user' to roles collection");
      });
      new Role({name: "partner_manager"})
      .save(err => {if (err) {console.error("023", err);}
        console.log("added 'partner_manager' to roles collection");
      });
      new Role({name: "acc_user"})
      .save(err => {if (err) {console.error("024", err);}
        console.log("added 'trans_user' to roles collection");
      });
      new Role({name: "acc_manager"})
      .save(err => {if (err) {console.error("025", err);}
        console.log("added 'trans_manager' to roles collection");
      });
      new Role({name: "purchase_user"})
      .save(err => {if (err) {console.error("026", err);}
        console.log("added 'purchase_user' to roles collection");
      });
      new Role({name: "purchase_manager"})
      .save(err => {if (err) {console.error("027", err);}
        console.log("added 'purchase_manager' to roles collection");
      });
      new Role({name: "sale_user"})
      .save(err => {if (err) {console.error("027", err);}
        console.log("added 'sale_user' to roles collection");
      });
      new Role({name: "sale_manager"})
      .save(err => {if (err) {console.error("028", err);}
        console.log("added 'sale_manager' to roles collection");
      });
      new Role({name: "pos_user"})
      .save(err => {if (err) {console.error("029", err);}
        console.log("added 'pos_user' to roles collection");
      });
      new Role({name: "pos_manager"})
      .save(err => {if (err) {console.error("030", err);}
        console.log("added 'pos_manager' to roles collection");
      });
      new Role({name: "pos_disc_add"})
      .save(err => {if (err) {console.error("031", err);}
        console.log("added 'pos_disc_add' to roles collection");
      });
      new Role({name: "production_user"})
      .save(err => {if (err) {console.error("032", err);}
        console.log("added 'production_user' to roles collection");
      });
      new Role({name: "production_manager"})
      .save(err => {if (err) {console.error("033", err);}
        console.log("added 'production_manager' to roles collection");
      });
      new Role({name: "ticket_user"})
      .save(err => {if (err) {console.error("034", err);}
        console.log("added 'ticket_user' to roles collection");
      });
      new Role({name: "ticket_manager"})
      .save(err => {if (err) {console.error("035", err);}
        console.log("added 'ticket_manager' to roles collection");
      });
      new Role({name: "project_user"})
      .save(err => {if (err) {console.error("036", err);}
        console.log("added 'project_user' to roles collection");
      });
      new Role({name: "project_manager"})
      .save(err => {if (err) {console.error("037", err);}
        console.log("added 'project_manager' to roles collection");
      });
      new Role({name: "admin"})
      .save(err => {if (err) {console.error("038", err);}
        console.log("added 'admin' to roles collection");
      });
      
      var ids = new Ids({
        pos_id: 1,
        pre_pos_id: "POS",
        pos_session: 1,
        pre_pos_session: "POS-SESS",
        transfer_id: 1,
        pre_transfer_id: "TRANSF",
        pay_id: 1,
        pre_pay_id: "PAY",
        purchase_id: 1,
        pre_purchase_id: "PUR",
        sale_id: 1,
        pre_sale_id: "SAL",
        journal_id: 1,
        pre_journal_id: "JOUR",
        bill_id: 1,
        pre_bill_id: "BILL",
        invoice_id: 1,
        pre_invoice_id: "INVOICE",
        ticket_id: 1,
        pre_ticket_id: "TICK",
      });
      ids.save(function(err){
        if (err) return console.error("039",err.stack)
        console.log("added 'Ids' to ID collection");
      });

      var settings = new Setting({
        cost_general: true,
        comp_name: "Codata",
        comp_addr: "",
        comp_phone: "",
        comp_email: "",
        image: "default.png",
        nav_color: "#f2f2f2",
        title_color: "#3f5efb",
        pos_shift: false,
        retail: true,
      });
      settings.save(function(err){
        if (err) return console.error("040",err.stack)
        console.log("added Setting collection");
      });
    }
  });

  Uomcat.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      UOM();
    }
  });

  Coa.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      CoaCare();
    }
  });

  Warehouse.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      WarehouseCare();
    }
  });

  Partner.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      PartnerCare();
    }
  });

  ProductCat.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      ProductsCare();
    }
  });
}

function CoaCare() {
  var c11001 = new Coa({prefix: 1,code: "1-1001",name: "Kas",active: true});
  c11001.save(function(err){if (err) return console.error("101",err.stack)});
  var c11101 = new Coa({prefix: 1,code: "1-1101",name: "Bank",active: true});
  c11101.save(function(err){if (err) return console.error("102",err.stack)});
  var c11111 = new Coa({prefix: 1,code: "1-1111",name: "Settlement",active: true});
  c11111.save(function(err){if (err) return console.error("103",err.stack)});
  var c12001 = new Coa({prefix: 1,code: "1-2001",name: "Piutang",active: true});
  c12001.save(function(err){if (err) return console.error("104",err.stack)});
  var c12901 = new Coa({prefix: 1,code: "1-2901",name: "PPN Masukan",active: true});
  c12901.save(function(err){if (err) return console.error("105",err.stack)});
  var c13001 = new Coa({prefix: 1,code: "1-3001",name: "Persediaan",active: true});
  c13001.save(function(err){if (err) return console.error("106",err.stack)});
  var c13901 = new Coa({prefix: 1,code: "1-3901",name: "Persediaan Transit",active: true});
  c13901.save(function(err){if (err) return console.error("107",err.stack)});
  var c15001 = new Coa({prefix: 1,code: "1-5001",name: "Aktiva Tetap",active: true});
  c15001.save(function(err){if (err) return console.error("108",err.stack)});
  var c21001 = new Coa({prefix: 2,code: "2-1001",name: "Hutang Dagang",active: true});
  c21001.save(function(err){if (err) return console.error("109",err.stack)});
  var c22001 = new Coa({prefix: 2,code: "2-2001",name: "Hutang Lainnya",active: true});
  c22001.save(function(err){if (err) return console.error("110",err.stack)});
  var c23001 = new Coa({prefix: 2,code: "2-3001",name: "Hutang Dalam Perjalanan",active: true});
  c23001.save(function(err){if (err) return console.error("111",err.stack)});
  var c24001 = new Coa({prefix: 2,code: "2-4001",name: "PPN Keluaran",active: true});
  c24001.save(function(err){if (err) return console.error("112",err.stack)});
  var c31001 = new Coa({prefix: 3,code: "3-1001",name: "Modal",active: true});
  c31001.save(function(err){if (err) return console.error("113",err.stack)});
  var c34001 = new Coa({prefix: 3,code: "3-4001",name: "Laba Rugi",active: true});
  c34001.save(function(err){if (err) return console.error("114",err.stack)});
  var c41001 = new Coa({prefix: 4,code: "4-1001",name: "Pendapatan",active: true});
  c41001.save(function(err){if (err) return console.error("115",err.stack)});
  var c51001 = new Coa({prefix: 5,code: "5-1001",name: "HPP",active: true});
  c51001.save(function(err){if (err) return console.error("116",err.stack)});
  var c61001 = new Coa({prefix: 6,code: "6-1001",name: "Biaya Operasional",active: true});
  c61001.save(function(err){if (err) return console.error("117",err.stack)});
  var c62001 = new Coa({prefix: 6,code: "6-1001",name: "Biaya Variabel",active: true});
  c62001.save(function(err){if (err) return console.error("118",err.stack)});
  var c69001 = new Coa({prefix: 6,code: "6-9001",name: "Biaya Lain Lain",active: true});
  c69001.save(function(err){if (err) return console.error("119",err.stack)});
  console.log("COA is added");
}

function WarehouseCare() {
  var warehouse = new Warehouse({
    name: "Gudang Utama",
    short: "UTAMA",
    main: true,
    active: true
  });
  warehouse.save(function(err){
    if (err) return console.error("120",err.stack)
    console.log("added 'Gudang Utama' to warehouse collection");
    var logWH = new Log({
        message: "dibuat oleh sistem",
        warehouse: warehouse._id
    });
    logWH.save(function(err){
        if(err) return console.error("121",err.stack)
        console.log("Log is added");
        var store = new Store({
          store_name: "Codata",
          warehouse: warehouse._id,
          active: true
        })
        store.save(function(err){
          if (err) return console.error("122",err.stack)
          console.log("addes 'Codata' to store collection");
          var logStore = new Log({
            message: "dibuat oleh sistem",
            store: store._id
          })
          logStore.save(function(err){
            if (err) return console.error("123",err.stack)
            console.log("Log is added");
          })
        });
    });
  });
}

function PartnerCare() {
  var partner = new Partner({
    code: "TEMP",
    name: "Template",
    isCustomer: true,
    isSupplier: true,
    active: true
  });
  partner.save(function(err){
    if (err) return console.error("124",err.stack)
    console.log("added 'Partner' to partner collection");
    var logPT = new Log({
        message: "dibuat oleh sistem",
        partner: partner._id
    });
    logPT.save(function(err){
        if(err) return console.error("125",err.stack)
        console.log("Log is added");
    });
  });
}

function UOM() {
  var uomcats = new Uomcat({
    uom_cat: "Unit"
  })
  uomcats.save(function(err){
    if (err) return console.error("126",err.stack)
    console.log("added 'Unit' to UOM category collection");
    var logUC = new Log({
      message: "dibuat oleh sistem",
      uom_cat: uomcats._id
    });
    logUC.save(function(err){
      if(err) return console.error("127",err.stack)
      console.log("Log is added")
    });
    var uoms = new Uom({
      uom_name: "Pcs",
      uom_cat: uomcats._id,
      ratio: 1
    })
    uoms.save(function(err){
      if (err) return console.error("128",err.stack)
      uomid = uoms._id;
      console.log("added 'Pcs' to UOM collection")
    })
    var logU1 = new Log({
      message: "dibuat oleh sistem",
      uom: uoms._id
    });
    logU1.save(function(err){
      if(err) return console.error("129",err.stack)
      console.log("Log is added")
    });
    var uom2 = new Uom({
      uom_name: "Lusin",
      uom_cat: uomcats._id,
      ratio: 12
    })
    uom2.save(function(err){
      if (err) return console.error("130",err.stack)
      console.log("added 'Lusin' to UOM collection")
    })
    var logU2 = new Log({
      message: "dibuat oleh sistem",
      uom: uom2._id
    });
    logU2.save(function(err){
      if(err) return console.error("131",err.stack)
      console.log("Log is added")
    });
  })

  var uomcats2 = new Uomcat({
    uom_cat: "Berat"
  })
  uomcats2.save(function(err){
    if (err) return console.error("132",err.stack)
    console.log("added 'Berat' to UOM category collection");
    var logUC2 = new Log({
      message: "dibuat oleh sistem",
      uom_cat: uomcats2._id
    });
    logUC2.save(function(err){
      if(err) return console.error("133",err.stack)
      console.log("Log is added")
    });
    var uom3 = new Uom({
      uom_name: "kg",
      uom_cat: uomcats2._id,
      ratio: 1
    })
    uom3.save(function(err){
      if (err) return console.error("134",err.stack)
      console.log("added 'kg' to UOM collection")
    })
    var logU3 = new Log({
      message: "dibuat oleh sistem",
      uom: uom3._id
    });
    logU3.save(function(err){
      if(err) return console.error("135",err.stack)
      console.log("Log is added")
    });
    var uom4 = new Uom({
      uom_name: "gr",
      uom_cat: uomcats2._id,
      ratio: (1/1000)
    })
    uom4.save(function(err){
      if (err) return console.error("136",err.stack)
      console.log("added 'gr' to UOM collection")
    })
    var logU4 = new Log({
      message: "dibuat oleh sistem",
      uom: uom4._id
    });
    logU4.save(function(err){
      if(err) return console.error("137",err.stack)
      console.log("Log is added")
    });
  })

  var uomcats3 = new Uomcat({
    uom_cat: "Cair"
  })
  uomcats3.save(function(err){
    if (err) return console.error("138",err.stack)
    console.log("added 'Cair' to UOM category collection");
    var logUC3 = new Log({
      message: "dibuat oleh sistem",
      uom_cat: uomcats3._id
    });
    logUC3.save(function(err){
      if(err) return console.error("139",err.stack)
      console.log("Log is added")
    });
    var uom5 = new Uom({
      uom_name: "L",
      uom_cat: uomcats3._id,
      ratio: 1
    })
    uom5.save(function(err){
      if (err) return console.error("140",err.stack)
      console.log("added 'L' to UOM collection")
    })
    var logU5 = new Log({
      message: "dibuat oleh sistem",
      uom: uom5._id
    });
    logU5.save(function(err){
      if(err) return console.error("141",err.stack)
      console.log("Log is added")
    });
    var uom6 = new Uom({
      uom_name: "mL",
      uom_cat: uomcats3._id,
      ratio: (1/1000)
    })
    uom6.save(function(err){
      if (err) return console.error("142",err.stack)
      console.log("added 'mL' to UOM collection")
    })
    var logU6 = new Log({
      message: "dibuat oleh sistem",
      uom: uom6._id
    });
    logU6.save(function(err){
      if(err) return console.error("143",err.stack)
      console.log("Log is added")
    });
  })
}

function ProductsCare() {
  var taxinc = new Tax({
    tax: 11,
    name: "PPN 11% (Inc)",
    include: true
  })
  taxinc.save(function(err){
      if(err) return console.error("144",err.stack)
      console.log("Tax 11% Inc is added")
    });
  var tax = new Tax({
        tax: 11,
        name: "PPN 11%",
        include: false
      });
  tax.save(function(err){
    if (err) return console.error("145",err.stack)
    console.log("added 'PPN' to tax collection");
    var prodcat = new ProductCat({
        catid: "TEMP",
        description: "Template",
        active: true
      });
    prodcat.save(function(err){
      if (err) return console.error("146",err.stack)
      console.log("added 'Template' to product category collection");
      var logPC = new Log({
        message: "dibuat oleh sistem",
        category: prodcat._id
      });
      logPC.save(function(err){
        if(err) return console.error("147",err.stack)
        console.log("Log is added");
        var prod = new Product({
          sku: "TEMP",
          name: "Template",
          description: "Template Product",
          listprice: 1,
          suom: uomid,
          puom: uomid,
          qoh: 0,
          cost: 0,
          isStock: true,
          fg: false,
          rm: false,
          image: "default.png",
          category: prodcat._id,
          taxin: tax._id,
          taxout: tax._id,
          active: true
        });
        prod.save(function(err){
          if(err) return console.error("148",err.stack)
          console.log("Product is added");
          var logPR = new Log({
            message: "dibuat oleh sistem",
            product: prod._id
          });
          logPR.save(function(err){
            if(err) return console.error("149",err.stack)
            console.log("Log is added")
          });
        });
      });
    });
  });
  
}