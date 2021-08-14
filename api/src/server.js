const express = require('express')
const bodyParser = require('body-parser');
const http = require('http');
const Helpers = require('./utils/helpers.js')

const port = 3000

const pg = require('knex')({
  client: 'pg',
  version: '9.6',      
  searchPath: ['knex', 'public'],
  connection: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : 'postgres://example:example@localhost:5432/test'
});


const app = express();
http.Server(app); 


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);  

// Endpoint test
app.get('/test', (req, res) => {
  res.status(200).send();
})


/*******************************/
/*       Artist Endpoints      */
/*******************************/

/* Create Artist */
app.post("/artist", (req, res) => {
  let uuid = Helpers.generateUUID();
    pg.insert({
      uuid: uuid,
      artistName: req.body.artistName,
      description: req.body.description,
      genreName: req.body.genreName,
      created_at: new Date(),
    })
    .into("artistTable")
    .then(() => {
      res.json({ uuid: uuid });
    });
});

/* Get Artist By UUID */
app.get('/artist/:uuid', async (req, res) => {
  const result = await pg
    .select(['uuid', 'title', 'created_at'])
    .from('artistTable')
    .where({uuid: req.params.uuid})
  res.json({
      res: result
  })
})

/* Get All Artists */
app.get("/artists", async (req, res) => {
  const result = await pg
  .select(["uuid", "artistName", "description", "genreName", "created_at"])
  .from("artistTable")
  res.json({res: result})
  // res.status(200).send()
})

/* Update Artist By UUID */
app.patch("/artist/:uuid", async (req, res) => {
    pg('artistTable')
      .where({uuid: req.params.uuid})
      .update(req.body)
});

/* Delete Request */
app.delete("/artist", async (req, res) => {
  if(req.body.hasOwnProperty('uuid')){
    const result = await pg.from("artistTable").where({ uuid: req.body.uuid }).del().then((data) => {
        console.log(`Delete storyblock with following uuid ${req.body.uuid}`)
        res.json(data)
    }).catch(() =>  res.status(400).send())
  }else{
    console.log("No uuid found")
    res.status(400).send()
  }
})


/*******************************/
/*       Genre Endpoints       */
/*******************************/

/* Create Genre */
app.post("/genre", (req, res) => {
  let uuid = Helpers.generateUUID();
    pg.insert({
      uuid: uuid,
      created_at: new Date(),
    })
    .into("genreTable")
    .then(() => {
      res.json({ uuid: uuid });
    });
});

app.get('/genres', async (req, res) => {
  const result = await pg
    .select(['uuid', 'title', 'created_at'])
    .from('genreTable')
  res.json({
      res: result
  })
})

app.get('/genre/:uuid', async (req, res) => {
  const result = await pg
    .select(['uuid', 'title', 'created_at'])
    .from('genreTable')
    .where({uuid: req.params.uuid})
  res.json({
      res: result
  })
})

/* Update Genre By UUID */
app.patch("/genre/:uuid", async (req, res) => {
  pg('genreTable')
    .where({uuid: req.params.uuid})
    .update(req.body)
});

app.delete("/genre", (req, res) => {
  pg('genreTable')
    .where({ uuid: req.body.uuid })
    .del()
    .then(() => {
      res.sendStatus(200);
  })
});

/*******************************/
/*      Initialize Tables      */
/*******************************/

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
          table.string('title');
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
              title: `Genre No.${i}` 
            })
          }
        });
      }
    });
  }
initialiseTables()

module.exports = app;