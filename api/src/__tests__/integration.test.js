
const supertest = require("supertest")
const app = require("./../server.js")

const request = supertest(app)

describe('CRUD endpoint tests', () => {
  let uuid

  it("Return 200 when artist added to database and return a UUID", async (done) => {
    const response = await request
      .post('/artist')
      .send({
        artistName: "Equal Idiots",
        description: "Equal Idiots is een Belgische garagerockband uit Hoogstraten, bestaande uit Thibault Christiaensen (zaen gitaar) en Pieter Bruurs (drums).",
        genreName: "Rock"
      })
      expect(response.status).toBe(200)
      uuid = response.body.uuid
      done()
  })
  it("Responds with 200 and get all genres", async (done) => {
    try {
      const response = await request.get("/genres")
      expect(response.status).toBe(200)
      expect(typeof response.body).toBe("object")
      done()
    } catch (error) {}
  })
  it("Return 200 when genre is deleted", async (done) => {
      const response = await request.delete("/genre").send({ uuid: uuid })
      expect(response.status).toBe(200)
      done()
  })
  
});