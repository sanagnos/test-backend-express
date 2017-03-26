/// ===========================================================================
/// main.js
/// ===========================================================================
/// Copyright (c) 2017, Stelios Anagnostopoulos <stelios@outlook.com>
/// All rights reserved
/// ===========================================================================

'use strict'

/// imports
/// ===========================================================================

var config  = require('./config')
var express = require('express')
var db      = require('./lib/db')

/// initialization
/// ===========================================================================

var app = express()
app.use(require('body-parser').json()) // for parsing application/json

// fire up the server
app.listen(config.io.port)

// connect to MySQL instance
db.connect(config.db)

/// registration
/// ===========================================================================

// register user routes
var user = require('./api/user')
app.post('/user', user.post)
app.get('/user/:id', user.get)
app.put('/user/:id', user.put)
app.delete('/user/:id', user.delete)
