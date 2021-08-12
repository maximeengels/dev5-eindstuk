const supertest = require("supertest");
const app = require("./../server.js");

const request = supertest(app);

describe("GET /test endpoint", () => {
  test("check if server responds with 204", async (done) => {
    try {
      const response = await request.get("/test");
      expect(response.status).toBe(204);
      expect(response.body).toStrictEqual({});
      done();
    } catch (e) {
      if (e) console.log(e);
      done(e);
      done();
    }
  });
});

describe('POST /test endpoint', () => {
  test('test if server responds with 200', async (done) => {
    try {
      const response = await request.post('/test')
      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual({})
      done()
    } catch (e) {
      if (e) console.log(e);
      done(e)
      done()
    }
  })
})

describe('DELETE /storyblock endpoint', () => {
  test('test if the delete request has a uuid', async (done) => {
    try {
      const req = {
        test: 'f23bbec0-30f3-11eb-83da-7b9eae6f7707'
      };
      const response = await request.delete('/storyblock/').send(req)
      expect(response.status).toBe(400)
      done()
    } catch (error) {
      console.log(error);
    }
  })
  test('check if that uuid is deleted', async (done) => {
    try {
      const req = {
        uuid: 'f23bbec0-30f3-11eb-83da-7b9eae6f7707'
      };
      const response = await request.delete('/storyblock/').send(req)
      expect(response.status).toBe(200)
      done()
    } catch (error) {
      console.log(error);
    }
  })
})

describe('GET /storyblock endpoint', () => {
  test('check if endpoint gets all storyblock records', async (done) => {
    try {
      const response = await request.get('/storyblock/')
      expect(response.status).toBe(200)
      done()
    } catch (error) {
      console.log(error);
    }
  })
})