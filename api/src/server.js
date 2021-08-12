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

app.get('/test', (req, res) => {
  res.status(200).send();
})

app.get('/', async (req, res) => {
  const result = await pg
    .select(['uuid', 'title', 'created_at'])
    .from('story')
  res.json({
      res: result
  })
})

app.get('/story/:uuid', async (req, res) => {
  const result = await pg
    .select(['uuid', 'title', 'created_at'])
    .from('story')
    .where({uuid: req.params.uuid})
  res.json({
      res: result
  })
})

/* Delete Request */
app.delete("/storyblock/", async (req, res) => {
  if(req.body.hasOwnProperty('uuid')){
    const result = await pg.from("storyblock").where({ uuid: req.body.uuid }).del().then((data) => {
        console.log(`Delete storyblock with following uuid ${req.body.uuid}`);
        res.json(data)
    }).catch(() =>  res.status(400).send())
  }else{
    console.log("No uuid found")
    res.status(400).send()
  }
});

/* Show All Records */
app.get("/", async (req, res) => {
  const result = await pg.select(["uuid", "title", "created_at"]).from("story");
  res.json({res: result});
});
app.get("/test", (req, res) => {
  res.status(200).send();
});
app.get("/storyblock/", async (req, res) => {
  const result = await pg.select(["uuid", "content","story_id", "created_at"]).from("storyblock");
  res.json({res: result});
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