const config = require("../../config/auth.config");
const db = require("../../models");
const User = db.user;
const Role = db.role;
const Pref = db.prefs;

const Op = db.Sequelize.Op;
var roleArr = [];

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  User.create({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        Role.findAll().then(rolex => {
          for(x=1;x<=rolex.length;x++){
            roleArr.push(x);
          }
          user.setRoles(roleArr).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        })
        // user role = 1
        
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({where: {
    username: req.body.username
  }})
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      //for (let i = 0; i < user.roles.length; i++) {
      //  authorities.push(user.roles[i].name.toLowerCase());
      //}
      db.sequelize.query('SELECT public.roles.name FROM public.user_roles ' +
        'LEFT JOIN public.roles ON public.user_roles.role_id = public.roles.id ' +
        'WHERE public.user_roles.user_id=' + user.id)
        .then(result => {
          for(let x=0; x<result[0].length; x++){
            authorities.push(result[0][x].name);
            if(x == (result[0].length-1)){
              res.status(200).send({
                id: user.id,
                username: user.username,
                roles: authorities,
                accessToken: token
              });
            }
          }
      })
      
      /*res.status(200).send({
        id: user._id,
        username: user.username,
        roles: authorities,
        accessToken: token
      });*/
    });
};
