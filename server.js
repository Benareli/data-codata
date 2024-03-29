const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const baseurl = require("./app/config/url.config");
const cron = require('node-cron');
const app = express();
const db = require("./app/models");
const fs = require("fs");

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

const Role = db.role;
const Company = db.companys;
const Ids = db.ids;
const Coa = db.coas;
const Log = db.logs;
const Print = db.prints;

const Warehouse = db.warehouses;
const Store = db.stores;
const Uomcat = db.uomcats;
const Uom = db.uoms;
const Tax = db.taxs;
const Paymentmethod = db.paymentmethods;

const Productcat = db.productcats;
const Productcatacc = db.productcataccs;
const Productcostcomp = db.productcostcomps;
const Partner = db.partners;
const Product = db.products;

/*const Pref = db.prefs;

const Stockmove = db.stockmoves;
const Qof = db.qofs;
const Qop = db.qops;
const Bom = db.boms;*/

var uomid;

//db.sequelize.sync({ force: true }).then(() => {console.log("Drop and re-sync db.");});
Company.findAll().then(res => { if(res.length == 0) initial();});

function initial() {
  Company.create({
    cost_general: true, comp_name: "Codata", comp_addr: "", comp_phone: "", comp_email: "",
    image: "default.png", nav_color: "#1ABC9C", title_color: "#9B59B6", pos_shift: false, retail: true,
  });

setTimeout(() => {
  fs.readFile('./app/template/purchase.html', 'utf8', (err, dataPur) => {
    if (err) {console.error('Error reading the file:', err);}
    else {
      Print.create({module: "purchase", company_id: 1, template: dataPur});
    }
  });

  fs.readFile('./app/template/sale.html', 'utf8', (err, dataSal) => {
    if (err) {console.error('Error reading the file:', err);}
    else {
      Print.create({module: "sale", company_id: 1, template: dataSal});
    }
  });

  fs.readFile('./app/template/invoice.html', 'utf8', (err, dataInv) => {
    if (err) {console.error('Error reading the file:', err);}
    else {
      Print.create({module: "invoice", company_id: 1, template: dataInv});
    }
  });

  fs.readFile('./app/template/bill.html', 'utf8', (err, dataBill) => {
    if (err) {console.error('Error reading the file:', err);}
    else {
      Print.create({module: "bill", company_id: 1, template: dataBill});
    }
  });

  Ids.create({
    pos_id: 1, pre_pos_id: "POS",
    pos_session: 1, pre_pos_session: "POS-SESS",
    transfer_id: 1, pre_transfer_id: "TRANSF",
    pay_id: 1, pre_pay_id: "PAY",
    purchase_id: 1, pre_purchase_id: "PUR",
    sale_id: 1, pre_sale_id: "SAL",
    journal_id: 1, pre_journal_id: "JOUR",
    bill_id: 1, pre_bill_id: "BILL",
    invoice_id: 1, pre_invoice_id: "INVOICE",
    ticket_id: 1, pre_ticket_id: "TICK",
    company_id: 1,
  });

  Role.bulkCreate([{name: "admin"},{name: "inventory_user"},{name: "inventory_manager"},{name: "partner_user"},{name: "partner_manager"},
    {name: "acc_user"},{name: "acc_manager"},{name: "purchase_user"},{name: "purchase_manager"},{name: "sale_user"},{name: "sale_manager"},
    {name: "pos_user"},{name: "pos_manager"},{name: "pos_disc_add"},{name: "production_user"},{name: "production_manager"},{name: "ticket_user"},
    {name: "ticket_manager"},{name: "project_user"},{name: "project_manager"}]);

  Coa.bulkCreate([{prefix: 1,code: "1-1001",name: "Kas",active: true,type: 1,company_id: 1},
    {prefix: 1,code: "1-1101",name: "Bank",active: true,type: 1,company_id: 1},
    {prefix: 1,code: "1-1201",name: "E-wallet",active: true,type: 1,company_id: 1},
    {prefix: 1,code: "1-1111",name: "Settlement",active: true,type: 0,company_id: 1},
    {prefix: 1,code: "1-2001",name: "Piutang",active: true,type: 2,company_id: 1},
    {prefix: 1,code: "1-2901",name: "PPN Masukan",active: true,type: 0,company_id: 1},
    {prefix: 1,code: "1-3001",name: "Persediaan",active: true,type: 0,company_id: 1},
    {prefix: 1,code: "1-3901",name: "Persediaan Transit",active: true,type: 0,company_id: 1},
    {prefix: 1,code: "1-5001",name: "Aktiva Tetap",active: true,type: 0,company_id: 1},
    {prefix: 2,code: "2-1001",name: "Hutang Dagang",active: true,type: 3,company_id: 1},
    {prefix: 2,code: "2-2001",name: "Hutang Lainnya",active: true,type: 0,company_id: 1},
    {prefix: 2,code: "2-3001",name: "Hutang Dalam Perjalanan",active: true,type: 0,company_id: 1},
    {prefix: 2,code: "2-4001",name: "PPN Keluaran",active: true,type: 0,company_id: 1},
    {prefix: 3,code: "3-1001",name: "Modal",active: true,type: 0,company_id: 1},
    {prefix: 3,code: "3-4001",name: "Laba Rugi",active: true,type: 0,company_id: 1},
    {prefix: 4,code: "4-1001",name: "Pendapatan",active: true,type: 0,company_id: 1},
    {prefix: 5,code: "5-1001",name: "HPP",active: true,type: 0,company_id: 1},
    {prefix: 6,code: "6-1001",name: "Biaya Operasional",active: true,type: 0,company_id: 1},
    {prefix: 6,code: "6-1001",name: "Biaya Variabel",active: true,type: 0,company_id: 1},
    {prefix: 6,code: "6-9001",name: "Biaya Lain Lain",active: true,type: 0,company_id: 1}])
    .then(data1 => {
      Paymentmethod.bulkCreate([{coa_id: 1, name: "Kas"}, {coa_id: 2, name: "Bank"}]);
      Warehouse.create({name: "Gudang Utama", short: "UTAMA", main: true, active: true, company_id: 1})
        .then(data2 => {
          Log.create({message: "dibuat oleh sistem", warehouse: 1});
          Store.create({store_name: "Codata", warehouse_id: 1, company_id: 1, receivable_id: 5, payable_id: 10, active: true}); 
          Log.create({message: "dibuat oleh sistem", store: 1});
          Tax.bulkCreate([
            {tax: 11, name: "PPN-11 (Inc)", include: true, company_id: 1, coa_in_id: 6, coa_out_id: 13}, 
            {tax: 11, name: "PPN-11", include: false, company_id: 1, coa_in_id: 6, coa_out_id: 13}]);
      });
    });

  Uomcat.create({uom_cat: "Unit"});  Log.create({message: "dibuat oleh sistem", uom_cat: 1});
  Uomcat.create({uom_cat: "Berat"}); Log.create({message: "dibuat oleh sistem", uom_cat: 2});
  Uomcat.create({uom_cat: "Cair"});  Log.create({message: "dibuat oleh sistem", uom_cat: 3});
  Uom.create({uom_name: "Pcs", uomcat_id: 1, ratio: 1}); Log.create({message: "dibuat oleh sistem", uom: 1});
  Uom.create({uom_name: "Lusin", uomcat_id: 1, ratio: 12}); Log.create({message: "dibuat oleh sistem", uom: 2});
  Uom.create({uom_name: "Gr", uomcat_id: 2, ratio: 1}); Log.create({message: "dibuat oleh sistem", uom: 3});
  Uom.create({uom_name: "Kg", uomcat_id: 2, ratio: 1000}); Log.create({message: "dibuat oleh sistem", uom: 4});
  Uom.create({uom_name: "L", uomcat_id: 3, ratio: 1}); Log.create({message: "dibuat oleh sistem", uom: 5});
  Uom.create({uom_name: "mL", uomcat_id: 3, ratio: 1/1000}); Log.create({message: "dibuat oleh sistem", uom: 6});

  Partner.create({code: "TEMP", name: "Template", isCustomer: true, isSupplier: true, active: true, receivable_id: 5, payable_id: 10});
  Log.create({message: "dibuat oleh sistem", partner: 1});

  Productcat.create({catid: "TEMP", description: "Template", active: true})
    .then(data3 => {
      Log.create({message: "dibuat oleh sistem", category: 1});

      Productcatacc.create({company_id: 1, category_id: 1, revenue_id: 16, 
        cost_id: 17, incoming_id: 12, outgoing_id: 8, inventory_id: 7, auto: true})
    
      Product.create({sku: "TEMP", name: "Template", description: "Template Product", listprice: 1, uom_id: 1, puom_id: 1,
        isStock: true, bund: false, prod: false, image: "default.png", productcat_id: 1, tax_id: 1, taxout_id: 1, active: true, nosell: false})
        .then(prod => {
          Productcostcomp.create({qoh: 0, cost: 0, product_id: 1, company_id: 1});
        });
        Log.create({message: "dibuat oleh sistem", product: 1});
      }, 2000);
    }); 
}

/*db.mongoose
  .connect(`mongodb://127.0.0.1:27017/codata`, {
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
  });*/

app.get("/", cors(corsOptions), (req, res) => {
  res.status(200).send("Welcome");
});

//Settings
require("./app/routes/settings/company.routes")(app);
require("./app/routes/settings/file.routes")(app);
require("./app/routes/settings/id.routes")(app);
require("./app/routes/settings/log.routes")(app);
//require("./app/routes/settings/pref.routes")(app);
require("./app/routes/settings/print.routes")(app);
require("./app/routes/settings/store.routes")(app);

//User Auth
require("./app/routes/userauth/auth.routes")(app);
require("./app/routes/userauth/user.routes")(app);
require("./app/routes/userauth/useruser.routes")(app);
require("./app/routes/userauth/userrole.routes")(app);

//Masterdata
require("./app/routes/masterdata/bom.routes")(app);
require("./app/routes/masterdata/bundle.routes")(app);
require("./app/routes/masterdata/brand.routes")(app);
//require("./app/routes/masterdata/costing.routes")(app);
require("./app/routes/masterdata/partner.routes")(app);
require("./app/routes/masterdata/product.routes")(app);
require("./app/routes/masterdata/productcat.routes")(app);
require("./app/routes/masterdata/uom.routes")(app);
require("./app/routes/masterdata/uomcat.routes")(app);
require("./app/routes/masterdata/warehouse.routes")(app);
require("./app/routes/masterdata/lot.routes")(app);

//Transaction - Purchase
require("./app/routes/transaction/purchase/purchase.routes")(app);
require("./app/routes/transaction/purchase/purchasedetail.routes")(app);

//Transaction - Stock
require("./app/routes/transaction/stock/qof.routes")(app);
require("./app/routes/transaction/stock/stockmove.routes")(app);
require("./app/routes/transaction/stock/stockrequest.routes")(app);

//Transaction - Sale
require("./app/routes/transaction/sale/pos.routes")(app);
require("./app/routes/transaction/sale/posdetail.routes")(app);
//require("./app/routes/transaction/sale/possession.routes")(app);
require("./app/routes/transaction/sale/sale.routes")(app);
require("./app/routes/transaction/sale/saledetail.routes")(app);

//Accounting
require("./app/routes/accounting/coa.routes")(app);
require("./app/routes/accounting/entry.routes")(app);
require("./app/routes/accounting/journal.routes")(app);
require("./app/routes/accounting/payment.routes")(app);
require("./app/routes/accounting/paymentmethod.routes")(app);
require("./app/routes/accounting/tax.routes")(app);

//__other
//require("./app/routes/ticket.routes")(app);
//require("./app/routes/project.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

//cron schedule
/*cron.schedule('00 10 * * *', function() {
  console.log('Running stock calculation');
  checkQof();
});*/

//AI FUCK
/*function checkQof() {
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

}*/

