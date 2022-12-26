const express = require("express");
const bodyParser = require('body-parser');
const dbConfig = require("../app/config/db.config");
const app = express();

const db = require("../app/models");
const mongoose = require("mongoose");
const Role = db.role;
const Setting = db.settings;
const User = db.users;
const Pref = db.prefs;
const Id = db.ids;
const Journal = db.journals;
var x=0;
var y;

app.use(express.json());
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    patchRole();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

function patchRole(){
	console.log("Patching Role 1 ...");
	const readRole = Role.find({name: "pos_disc_add"}).then(data => {
		if(data.length == 0){
			const pos_disc_add = ({name: "pos_disc_add"});
			Role.create(pos_disc_add).then(dataa => {
				console.log("POS Disc Add Role added");
				patchRole1();
			}).catch(err =>{console.error("patch0101",err.message);});
		}else{
			console.log("POS Disc Acc Ready!");
			patchRole1();
		}
	}).catch(err =>{console.error("patch0102",err.message);});
}
function patchRole1(){
	console.log("Patching Role 2 ...");
	const readRole = Role.find({name: "production_user"}).then(datab => {
		if(datab.length == 0){
			const prod_user = ({name: "production_user"});
			Role.create(prod_user).then(datac => {
				console.log("POS Disc Add Role added");
				patchRole2();
			}).catch(err =>{console.error("patch0201",err.message);});
		}else{
			console.log("Production User Ready!");
			patchRole2();
		}
	}).catch(err =>{console.error("patch0202",err.message);});
}
function patchRole2(){
	console.log("Patching Role 3 ...");
	const readRole = Role.find({name: "production_manager"}).then(datad => {
		if(datad.length == 0){
			const prod_manager = ({name: "production_manager"});
			Role.create(prod_manager).then(datae => {
				console.log("Production Manager Role added");
				patchRole3();
			}).catch(err =>{console.error("patch0301",err.message);});
		}else{
			console.log("Production Manager Ready!");
			patchRole3();
		}
	}).catch(err =>{console.error("patch0302",err.message);});
}
function patchRole3(){
	console.log("Patching Role 4 ...");
	const readRole = Role.find({name: "ticket_user"}).then(datad => {
		if(datad.length == 0){
			const ticket_user = ({name: "ticket_user"});
			Role.create(ticket_user).then(datae => {
				console.log("Ticket User Role added");
				patchRole4();
			}).catch(err =>{console.error("patch0401",err.message);});
		}else{
			console.log("Ticket User Ready!");
			patchRole4();
		}
	}).catch(err =>{console.error("patch0402",err.message);});
}
function patchRole4(){
	console.log("Patching Role 5 ...");
	const readRole = Role.find({name: "ticket_manager"}).then(datad => {
		if(datad.length == 0){
			const ticket_manager = ({name: "ticket_manager"});
			Role.create(ticket_manager).then(datae => {
				console.log("Ticket Manager Role added");
				patchRole5();
			}).catch(err =>{console.error("patch0501",err.message);});
		}else{
			console.log("Ticket Manager Ready!");
			patchRole5();
		}
	}).catch(err =>{console.error("patch0502",err.message);});
}
function patchRole5(){
	console.log("Patching Role 6 ...");
	const readRole = Role.find({name: "project_user"}).then(datad => {
		if(datad.length == 0){
			const project_user = ({name: "project_user"});
			Role.create(project_user).then(datae => {
				console.log("Project User Role added");
				patchRole6();
			}).catch(err =>{console.error("patch0601",err.message);});
		}else{
			console.log("Project User Ready!");
			patchRole6();
		}
	}).catch(err =>{console.error("patch0602",err.message);});
}
function patchRole6(){
	console.log("Patching Role 7 ...");
	const readRole = Role.find({name: "project_manager"}).then(datad => {
		if(datad.length == 0){
			const project_manager = ({name: "project_manager"});
			Role.create(project_manager).then(datae => {
				console.log("Project Manager Role added");
				patchRole7();
			}).catch(err =>{console.error("patch0701",err.message);});
		}else{
			console.log("Project Manager Ready!");
			patchRole7();
		}
	}).catch(err =>{console.error("patch0702",err.message);});
}
function patchRole7(){
	console.log("Patching Role 8 ...");
	const readRole = Role.find({name: "sale_user"}).then(datad => {
		if(datad.length == 0){
			const sale_user = ({name: "sale_user"});
			Role.create(sale_user).then(datae => {
				console.log("Sale User Role added");
				patchRole8();
			}).catch(err =>{console.error("patch0801",err.message);});
		}else{
			console.log("Sale User Ready!");
			patchRole8();
		}
	}).catch(err =>{console.error("patch0802",err.message);});
}
function patchRole8(){
	console.log("Patching Role 9 ...");
	const readRole = Role.find({name: "sale_manager"}).then(datad => {
		if(datad.length == 0){
			const sale_manager = ({name: "sale_manager"});
			Role.create(sale_manager).then(datae => {
				console.log("Sale Manager Role added");
				findUser();
			}).catch(err =>{console.error("patch0901",err.message);});
		}else{
			console.log("Sale Manager Ready!");
			findUser();
		}
	}).catch(err =>{console.error("patch0902",err.message);});
}

function findUser() {
	console.log("Patching Preferences ...")
	User.find().then(dataz => {
		rolling(dataz);
	})
}

function rolling(dataz){
	var findpred = Pref.find({user_id: dataz[x]._id}).then(part => {
		if(part.length == 0){
			var pref = new Pref({user_id: dataz[x]._id, pos_qty: false, pos_image: false})
				pref.save(function(err){
					if (err) {
						return console.error("patch1001",err.message)
					}else{
						if(x == dataz.length - 1) {
							console.log("All Prefs Added")
							return;
						}
						else {
							x = x + 1;
							rolling(dataz);
						}
					}
				}).catch(err =>{console.error("patch1002",err.message);});
		}else{
			console.log(dataz[x].username + " already has pref");
			if(x == dataz.length - 1) {
				console.log("All Prefs Added")
				patchId();
			}
			else {
				x = x + 1;
				rolling(dataz);
			}
		}
	}).catch(err =>{console.error("patch1003",err.message);});
}

function patchId() {
	Id.find().then(dataz => {
		if(dataz.ticket_id && dataz.pre_ticket_id){
			console.log("Ticket ID is ready!");
			patchId1();
		}else{
			console.log(dataz);
			Id.findByIdAndUpdate(dataz[0]._id, {$set: {ticket_id: 1, pre_ticket_id: "TICK"}}, {useFindAndModify: false}).then(datatick => {
				console.log("Ticket ID Added");
				patchId1();
			}).catch(err =>{console.error("patch2001",err.message);});
		}
	})
}
function patchId1() {
	Id.find().then(dataz => {
		if(dataz.sale_id && dataz.pre_sale_id){
			console.log("Sale ID is ready!");
			rollingJournal();
		}else{
			console.log(dataz);
			Id.findByIdAndUpdate(dataz[0]._id, {$set: {sale_id: 1, pre_sale_id: "SAL"}}, {useFindAndModify: false}).then(datatick => {
				console.log("Sale ID Added");
				rollingJournal();
			}).catch(err =>{console.error("patch2101",err.message);});
		}
	})
}

function rollingJournal() {
	Journal.update({'lock': {$exists : false}}, {$set: {'lock': false}}).then(upJour => {
		console.log("Journal update", upJour);
	})
}