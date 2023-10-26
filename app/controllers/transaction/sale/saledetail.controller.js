const db = require("../../../models");
const {id,coa,cache,journal,stock} = require("../../../function");
const { compare } = require('../../../function/key.function');
const Sale = db.sales;
const Saledetail = db.saledetails;
const Lot = db.lots;
const Id = db.ids;
const Uom = db.uoms;
const Product = db.products;
const ProductCatAcc = db.productcataccs;
const ProductCostComp = db.productcostcomps;
const Partner = db.partners;
const Warehouse = db.warehouses;
const Stockmove = db.stockmoves;
const Coa = db.coas;
const Company = db.companys;
var transid, transferid;
var x, qty, oriqty, uom_id, oriuom_id, cost, oricost, entries;

async function getTransId() {
  const res1 = await id.getTransId();
  return res1;
}

async function updateProductCache() {
  const res4 = await cache.updateProductCache();
  return res4;
}

async function inputJournal(data) {
  const jour1 = await journal.inputJournal(data);
  return jour1;
}

async function insertUpdateStock(type, productid, partnerid, whid, data) {
  const stock1 = await stock.insertUpdateStock(type, productid, partnerid, whid, data);
  return stock1;
}

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.sale_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const saledet = ({
    sale_id: req.body.sale_id,
    qty: req.body.qty,
    qty_done: req.body.qty_done,
    qty_inv: req.body.qty_inv,
    uom_id: req.body.uom,
    price_unit: req.body.price_unit,
    discount: req.body.discount,
    tax: req.body.tax,
    subtotal: req.body.subtotal,
    partner_id: req.body.partner,
    product_id: req.body.product,
    warehouse_id: req.body.warehouse,
    date: req.body.date,
    company_id: req.body.company
  });
  Saledetail.create(saledet).then(dataa => { 
    res.send(dataa);
  }).catch(err =>{console.error("saled0102",err);res.status(500).send({message:err}); });
};

exports.findAll = (req, res) => {
  const sale_id = req.query.sale_id;
  var condition = sale_id ? { sale_id: { $regex: new RegExp(sale_id), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Saledetail.findAll({ include: [
      {model: Sale, as: "sales"},
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: Product, as: "products"},
      {model: Uom, as: "uoms"},
      {model: Company, as: "companys"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("saled0201",err);res.status(500).send({message:err}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Saledetail.findByPk(req.params.id,{ include: [
      {model: Sale, as: "sales"},
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: Product, as: "products"},
      {model: Uom, as: "uoms"},
      {model: Company, as: "companys"},
    ] })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("saled0301",err);res.status(500).send({message:err}); });
};

exports.findBySOId = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Saledetail.findAll({where:{sale_id: req.params.so},
    include: [
      {model: Sale, as: "sales"},
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {
        model: Product,
        as: "products",
        include: [
          {
            model: ProductCostComp,
            as: "productcostcomps",
            where: {
              company_id: 1, // Replace "some parameter" with the actual value or variable
            },
            required: false, // Use this if you want to include products even if they don't have a matching ProductCostcomp
          },
        ],
      },
      {model: Uom, as: "uoms"},
      {model: Company, as: "companys"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("saled0401",err);res.status(500).send({message:err}); });
};

exports.update = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body) {
    return res.status(400).send({message: "Data to update can not be empty!"});
  }
  Saledetail.update(req.body, {where:{id:req.params.id}})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({ message: "Updated successfully." });
      }
    }).catch(err =>{console.error("saled0501",err);res.status(500).send({message:err}); });
};

// Update Receive
exports.updateSendAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body) {
    return res.status(400).send({message: "Data to update can not be empty!"});
  }
  x = 0;
  checkUom(req, res);
};

function checkUom(req, res){
  Product.findByPk(req.body[x].products.id).then(prod => {
    if(prod.uom_id != req.body[x].uoms.id){
      Uom.findByPk(req.body[x].uoms.id).then(uom => {
        qty = req.body[x].qty_rec * uom.ratio;
        uom_id = prod.uom_id;
        cost = req.body[x].subtotal / req.body[x].qty * req.body[x].qty_rec / uom.ratio;
        oriqty = req.body[x].qty_rec;
        oriuom_id = req.body[x].uom_id;
        oricost = req.body[x].subtotal / req.body[x].qty * req.body[x].qty_rec;
        startProcess(req, res);
      }).catch(err => {console.error("sm0002",err);res.status(500).send({message:err}); });
    }else{
      qty = req.body[x].qty_rec;
      uom_id = req.body[x].uom_id;
      cost = req.body[x].subtotal / req.body[x].qty * req.body[x].qty_rec;
      startProcess(req, res);
    }
  }).catch(err => {console.error("sm0001",err);res.status(500).send({message:err}); });
}

function startProcess(req, res){
  if(req.body[x].qty_rec > 0){
    getTransId().then(tids => {
      transid = tids[0];
      transferid = tids[1];
      transfercount = tids[2];
      const stockmove = ({
        trans_id: transid,
        user_id: req.params.id,
        product_id: req.body[x].products.id,
        warehouse_id: req.params.wh,
        origin: req.body[x].sales.sale_id,
        qout: qty,
        uom_id: uom_id,
        date: req.params.date,
        company_id: req.params.comp,
        cost: cost,
        oriqin: oriqty,
        oriuom_id: oriuom_id,
        oricost: oricost
      });
      Stockmove.create(stockmove).then(datad => {
        insertUpdateStock("out", req.body[x].products.id, req.params.partner, req.params.wh, req.body[x]).then(qop => {
          Saledetail.findByPk(req.body[x].id).then(pd => {
            if(oriqty) qty = oriqty;
            Saledetail.update({qty_done: pd.qty_done + qty}, {where:{id:req.body[x].id}}).then(pdu => {
              updateProductCache().then(upc => {
                insertAcc(req, res, transid);
              }).catch(err =>{console.error("purd0601",err);res.status(500).send({message:err}); });
            }).catch(err =>{console.error("purd0602",err);res.status(500).send({message:err}); });
          }).catch(err =>{console.error("purd0603",err);res.status(500).send({message:err}); });
        }).catch(err =>{console.error("purd0604",err);res.status(500).send({message:err}); });
      }).catch(err =>{console.error("purd0605",err);res.status(500).send({message:err}); });
    }).catch(err =>{console.error("purd0606",err);res.status(500).send({message:err}); }); 
  }else {
    sequencing(req,res);
  }
}

function insertAcc(req, res, transid) {
  entries = [];
  Product.findByPk(req.body[x].products.id).then(p1 => {
    ProductCatAcc.findOne({where:{category_id: p1.productcat_id, company_id: req.body[x].company_id}, include: [
      {model: Coa, as: "revenues"},
      {model: Coa, as: "costs"},
      {model: Coa, as: "incomings"},
      {model: Coa, as: "outgoings"},
      {model: Coa, as: "inventorys"},
    ], raw: true, nest: true}).then(p2 => {
      ProductCostComp.findOne({where:{product_id: req.body[x].products.id, company_id: req.body[x].company_id}}).then(p3 => {
        entries.push({label: req.body[x].products.name, debit: p3.cost, debits: p2.outgoings, date: req.params.date});
        entries.push({label: req.body[x].products.name, credit: p3.cost, credits: p2.inventorys, date: req.params.date});
        const inJournal = ({
          date: req.body[x].date,
          type: "stock",
          origin: transid,
          entry: entries,
          amount: p3.cost,
          company: req.params.comp,
          user: req.params.id
        })
        if(entries.length >= 2){
          inputJournal(inJournal).then(inputJour => {
            sequencing(req, res);
          }).catch(err =>{console.error("saled0801",err);res.status(500).send({message:err}); });
        }else{
          insertAcc(req, res)
        }
      })
    })
  })
}

function sequencing(req, res){
  if(x==req.body.length-1){
    Id.update({transfer_id: transfercount+1}, {where:{id:transferid}})
      .then(datae => {
          res.send({message: "DONE!"});
        }).catch(err =>{console.error("purd0690",err);res.status(500).send({message:err}); });
  }else{
    x=x+1;
    checkUom(req, res);
  }
}

// Delete with the specified id in the request
exports.delete = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Saledetail.destroy({where:{id:req.params.id}})
    .then(num => {
      if(num === 1) {
        res.send({message:'done'})
      }
      else {
        res.send({message:'failed'})
      }
    }).catch(err =>{console.error("saled0901",err);res.status(500).send({message:err}); });
};

// Delete all from the database.
exports.deleteAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Saledetail.destroy({})
    .then(data => {
      res.send({message: `${data.deletedCount} Data were deleted successfully!`});
    }).catch(err =>{console.error("saled1001",err);res.status(500).send({message:err}); });
};

// Find a single with an desc
exports.findByProduct = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  
  db.sequelize.query
    ('SELECT COUNT(public.saledetails.id) as totalLine, SUM(public.saledetails.qty_done) as totalQty FROM public.saledetails ' +
      'WHERE public.saledetails.product_id = ' + req.params.product +
      'AND public.saledetails.company_id = ' + req.params.comp +
      'AND public.saledetails.qty_done > 0',{raw: true, nest: true})
    .then(result => {
        res.send(result)
    }).catch(err =>{console.error("purd1101",err);res.status(500).send({message:err}); });
};