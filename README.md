![logo](https://user-images.githubusercontent.com/43611435/129494981-c0b3d23a-f657-4d80-b19e-d1bd7bea1d3c.png)
# Seeve API

---

## Description

The Seeve API is one that allows you to get artists from a database and categorize them by genre. 
This is created based on my final work concept.

---
## Getting started

1. Clone this repository.
2. Navigate to the root folder and run the Docker container.
    ```shell
    docker-compose build
    docker-compose up
    ```
3. To run tests, navigate to the api folder.
    ```shell
    npm test
    ```

---
## How to CRUD

The Seeve API uses two tables to manage its content. Both tables are accessible through their respective CRUD endpoints.

#### Artist Table

You can modify this table by using the following endpoints:

`POST /postArtist`
    - Posts an artist to the database.
    - Requires a body with the following properties: 
        ```js
        {
            artistName: String,
            description: String,
            genreName: String
        }
        ```
`GET /artists`
    - Returns all artists from the database.
`GET /artist/:uuid`
    - Returns a specific artist by uuid.
`PATCH /updateArtist/:uuid`
    - Updates the content of a specific artist by uuid.
`DELETE /deleteArtist/:uuid`
    - Deletes a specific artist by uuid.

---

#### Genre Table

You can modify this table by using the following endpoints:

`POST /postGenre`
    - Posts a genre to the database.
`GET /genres`
    - Returns all genres from the database.
`GET /genre/:uuid`
    - Returns a specific genre by uuid.
`PATCH /updateGenre/:uuid`
    - Updates the content of a specific genre by uuid.
`DELETE /deleteGenre/:uuid`
    - Deletes a specific genre by uuid.


## Project Status

This project is in development.

---

## Authors

Maxime Engels

## License

[MIT](https://choosealicense.com/licenses/mit/)