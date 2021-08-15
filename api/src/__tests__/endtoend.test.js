
const supertest = require("supertest")
const app = require("./../server.js")

const request = supertest(app)

let artistID
let genreID

describe("E2E test", () => {
    it("Post artist to database and return UUID", async(done) => {
        const response = await request.post('/postArtist')
        .send({
            artistName: "Equal Idiots"
        })
        expect(response.status).toBe(200)
        artistID = response.body.uuid
        done()
    })
    it("Get last posted artist by UUID", async(done) => {
        const response = await request.get("/artist/" + artistID)   
        expect(response.status).toBe(200)
        expect(response.body.res[0].artistName).toBe("Equal Idiots")
        done()
    })
    it("Responds with 200 and get all artists", async(done) => {
        const response = await request.get("/artists")
        expect(response.status).toBe(200)
        expect(typeof response.body).toBe("object")
        done()
    })
    it("Updates artist by UUID", async(done) => {
        const response = await request.patch("/updateArtist/" + artistID)
        .send({
            artistName: "Amenra"
        })
        expect(response.status).toBe(200)
        done()
    })
    it("Check updated name of artist by UUID", async(done) => {
        const response = await request.get("/artist/" + artistID)   
        expect(response.status).toBe(200)
        expect(response.body.res[0].artistName).toBe("Amenra")
        done()
    })
    it("Return 200 when artist is deleted", async(done) => {
        const response = await request.delete("/deleteArtist").send({ uuid: artistID })
        expect(response.status).toBe(200)
        done()
    })
    it("Post genre to database and return UUID", async(done) => {
        const response = await request.post('/postGenre')
        .send({
            genreName: "Rock"
        })
        expect(response.status).toBe(200)
        genreID = response.body.uuid
        done()
    })
    it("Responds with 200 and get all genres", async(done) => {
        const response = await request.get("/genres")
        expect(response.status).toBe(200)
        expect(typeof response.body).toBe("object")
        done()
    })
    it("Updates genre by UUID", async(done) => {
        const response = await request.patch("/updateGenre/" + genreID)
        .send({
            title: "Hiphop"
        })
        expect(response.status).toBe(200)
        done()
    })
    it("Check updated name of genre by UUID", async(done) => {
        const response = await request.get("/genre/" + genreID)   
        expect(response.status).toBe(200)
        expect(response.body.res[0].title).toBe("Hiphop")
        done()
    })
    it("Return 200 when genre is deleted", async(done) => {
        const response = await request.delete("/deleteGenre").send({ uuid: genreID })
        expect(response.status).toBe(200)
        done()
    })
});
