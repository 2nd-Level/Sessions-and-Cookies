const Users = require('../users/usersAccess.js');

const express = require('express');
const knex = require('knex');
const bcrypt =require('bcryptjs')

const knexConfig = require('../knexfile.js');

const db = knex(knexConfig.development);

const router = express.Router();

router.post('/register', (req, res) => {
    let user = req.body;
  
    // validate the user
  
    // hash the password
    const hash = bcrypt.hashSync(user.password, 8);
  
    // we override the password with the hash
    user.password = hash;
  
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });


  router.post('/login', (req, res) => {
    let { username, password } = req.body;
  
    if (username && password) {
      Users.findBy({ username })
        .first()
        .then(user => {
          if (user && bcrypt.compareSync(password, user.password)) {
            res.status(200).json({ message: `Welcome ${user.username}!` });
          } else {
            res.status(401).json({ message: 'You cannot pass!!' });
          }
        })
        .catch(error => {
          res.status(500).json(error);
        });
    } else {
      res.status(400).json({ message: 'please provide credentials' });
    }
  });


router.get('/users', (req, res) => {
    db('users')
      .then(users => {
        res.json(users);
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to retrieve users' });
      });
  });
  
  router.post('/', (req, res) => {
    const user = req.body;
    db('users')
      .insert(user)
      .then(ids => {
        db('users')
          .where({ id: ids[0] })
          .then(newUser => {
            res.status(201).json(newUser);
          });
      })
      .catch(err => {
        console.log('POST error', err);
        res.status(500).json({ message: 'Failed to store data' });
      });
  });

module.exports = router;