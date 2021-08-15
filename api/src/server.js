const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const Helpers = require('./utils/helpers.js')

const port = 3000

const pg = require('knex')({
  client: 'pg',
  version: '9.6',      
  searchPath: ['knex', 'public'],
  connection: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : 'postgres://example:example@localhost:5432/test'
})


const app = express()
http.Server(app)


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

// Endpoint test
app.get("/test", (req, res) => {
  res.status(200).send();
})


/*=================== Artist Endpoints =====================*/

/**
* POST an artist
* @param: uuid, artistName, description, genreName
* @returns: the uuid of posted artist
*/
app.post("/artist", (req, res) => {
  let uuid = Helpers.generateUUID()
    pg.insert({
      uuid: uuid,
      artistName: req.body.artistName,
      description: req.body.description,
      genreName: req.body.genreName,
      created_at: new Date(),
    })
    .into("artistTable")
    .then(() => {
      res.json({ uuid: uuid })
    })
})

/**
 * GET artist by UUID
 * @param: uuid 
 * @returns: one artist specified by uuid
 */
app.get('/artist/:uuid', async (req, res) => {
  const result = await pg
    .select(["uuid", "artistName", "description", "genreName", "created_at"])
    .from('artistTable')
    .where({uuid: req.params.uuid})
  res.json({
      res: result
  })
})

/**
* GET all artists
* @param: none
* @returns: all artists from artist table
*/
app.get("/artists", async (req, res) => {
  const result = await pg
  .select(["uuid", "artistName", "description", "genreName", "created_at"])
  .from("artistTable")
  res.json({res: result})
  // res.status(200).send()
})

/**
* PATCH artist by UUID
* @param: object with properties that are getting patched
* @returns: status code 200
*/
app.patch("/artist/:uuid", (req, res) => {
    pg('artistTable')
      .where({uuid: req.params.uuid})
      .update(req.body)
      .then(() => {
        res.sendStatus(200)
      })
})

/**
* DELETE artist
* @param: uuid
* @returns: status code 200
*/
app.delete("/artist", (req, res) => {
  pg('artistTable')
    .where({ uuid: req.body.uuid })
    .del()
    .then(() => {
      res.sendStatus(200);
  })
})



/*=================== Genre Endpoints =====================*/

/**
* POST a genre
* @param: uuid
* @returns: the uuid of posted genre
*/
app.post("/genre", (req, res) => {
  let uuid = Helpers.generateUUID()
    pg.insert({
      uuid: uuid,
      created_at: new Date(),
    })
    .into("genreTable")
    .then(() => {
      res.json({ uuid: uuid })
    })
})

/**
* GET all genres
* @param: none
* @returns: all genres from genre table
*/
app.get('/genres', async (req, res) => {
  const result = await pg
    .select(['uuid', 'title', 'created_at'])
    .from('genreTable')
  res.json({
      res: result
  })
})

/**
 * GET genre by UUID
 * @param: uuid 
 * @returns: one genre specified by uuid
 */
app.get('/genre/:uuid', async (req, res) => {
  const result = await pg
    .select(['uuid', 'title', 'created_at'])
    .from('genreTable')
    .where({uuid: req.params.uuid})
  res.json({
      res: result
  })
})

/**
* PATCH genre by UUID
* @param: object with properties that are getting patched
* @returns: status code 200
*/
app.patch("/genre/:uuid", async (req, res) => {
  pg('genreTable')
    .where({uuid: req.params.uuid})
    .update(req.body)
    .then(() => {
      res.sendStatus(200)
  })
})

/**
* DELETE artist
* @param: uuid
* @returns: status code 200
*/
app.delete("/genre", (req, res) => {
  pg('genreTable')
    .where({ uuid: req.body.uuid })
    .del()
    .then(() => {
      res.sendStatus(200);
  })
})



/*=================== Initialize Tables =====================*/

async function initialiseTables() {
  await pg.schema.hasTable('artistTable').then(async (exists) => {
    if (!exists) {
      await pg.schema
        .createTable('artistTable', (table) => {
          table.increments();
          table.uuid('uuid');
          table.string('artistName');
          table.string('description');
          table.string('genreName');
          table.timestamps(true, true);
        })
        .then(async () => {
          console.log('created artist table');
        });
    }
  });
  await pg.schema.hasTable('genreTable').then(async (exists) => {
    if (!exists) {
      await pg.schema
        .createTable('genreTable', (table) => {
          table.increments();
          table.uuid('uuid');
          table.string('genreName');
          table.timestamps(true, true);
        })
        .then(async () => {
          console.log('created a genre table');
          for (let i = 0; i < 10; i++) {
            const uuid = Helpers.generateUUID();
            await pg
            .table('genreTable')
            .insert({ 
              uuid, 
              genreName: `Genre No.${i}` 
            })
          }
        });
      }
    });
  }
initialiseTables()

module.exports = app;