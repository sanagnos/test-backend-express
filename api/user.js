/// ===========================================================================
/// api/user.js
/// ===========================================================================
/// Copyright (c) 2017, Stelios Anagnostopoulos <stelios@outlook.com>
/// All rights reserved
/// ===========================================================================

'use strict'

/// imports
/// ===========================================================================

var db = require('../lib/db') // database routines

/// model
/// ===========================================================================

db.define('user', [
  { name: 'id', type: 'int', length: 11, unsigned: true, autoincr: true, primaryKey: true },
  { name: 'name', type: 'varchar', length: 32, required: true },
  { name: 'dob', type: 'date' },
  { name: 'address', type: 'varchar', length: 128 },
  { name: 'description', type: 'text' },
  { name: 'created_at', type: 'timestamp', currentTimestamp: true }
], function (err) {
  if (err) throw err
})

/// routes
/// ===========================================================================

module.exports = {

  post: function (req, res) {
    db.create('user', req.body, function (err, id) {
      if (err) {
        if (/ER_NO_DEFAULT_FOR_FIELD/.test(err.toString()))
          return res.status(400).send('Missing required field')
        else if (/ER_PARSE_ERROR/.test(err.toString()))
          return res.status(400).send('Corrupt body')
        else return res.status(500).send(err.toString())
      }
      res.status(201).send({ id: id })
    })
  },

  get: function (req, res) {
    db.read('user', req.params.id, function (err, data) {
      if (err) return res.status(500).send(err.toString())
      if (!data) return res.status(404).end()
      res.status(200).send(data)
    })
  },

  put: function (req, res) {
    delete req.body.id         // remove attempted changes
    delete req.body.created_at // to read-only fields
    db.update('user', req.params.id, req.body, function (err, data) {
      if (err) {
        if (/ER_BAD_FIELD_ERROR/.test(err.toString()))
          return res.status(400).send('Unexpected field')
        else if (/ER_PARSE_ERROR/.test(err.toString()))
          return res.status(400).send('Corrupt body')
        else return res.status(500).send(err.toString())
      }
      if (!data.changedRows) return res.status(404).end()
      res.status(200).end()
    })
  },

  delete: function (req, res) {
    db.delete('user', req.params.id, function (err, data) {
      if (err) return res.status(500).send(err.toString())
      if (!data.affectedRows) return res.status(404).end()
      res.status(200).end()
    })
  }
}
