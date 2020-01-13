const express = require('express');
const data = require('./data/db.js');
const cors = require('cors');

const server = express();
const port = 5000;
server.use(express.json());
server.use(cors());

// listen
server.listen(port, () => console.log(`listening on port ${port}`));

// create user
server.post('/api/users', (request, response) => {
    const body = request.body;

    if (!body.name || !body.bio) {
        response.status(500).json({message: 'you must include both the name and bio of the user'});
    } else {
        data.insert(body)
            .then(res => {
                data.find()
                    .then(r => response.status(200).json({message: 'user created successfully', r}))
            })
            .catch(err => response.status(400).json({message: 'there was an error creating the user'}));
    };
});

// fetch all users
server.get('/api/users', (request, response) => {
    console.log(data.findById(3));
    data.find()
        .then(res => response.status(200).json(res))
        .catch(error => response.status(500).json({message: 'there was an error fetching the list of users'}));
});

// fetch user
server.get('/api/users/:id', (request, response) => {
    const id = request.params.id;

    data.findById(id)
        .then(res => res ? response.status(200).json({message: 'user fetched successfully', res}) : response.status(404).json({message: 'user with the specified id not found'}))
        .catch(err => response.status(500).json({message: 'there was an error fetching the user'}));
});

// update user
server.put('/api/users/:id', (request, response) => {
    const id = request.params.id;
    const body = request.body;

    if (!body.name || !body.bio) {
        response.status(500).json({message: 'you must include both the name and bio of the user'});
    } else {
        data.findById(id)
            .then(res => res ? (
                data.update(id, body)
                    .then(r => {
                        data.find()
                            .then(r => response.status(200).json({message: 'user updated successfully', r}))
                    })
                    .catch(e => response.status(500).json({message: 'there was an error updating the user'}))
            ) : response.status(404).json({message: 'user with the specified id not found'}))
            .catch(err => response.status(500).json({message: 'there was an error fetching the user'}));
    };
});

// delete user
server.delete('/api/users/:id', (request, response) => {
    const id = request.params.id;

    data.findById(id)
        .then(res => res ? (
            data.remove(id)
                .then(r => {
                    data.find()
                        .then(data => response.status(200).json({message: 'user deleted successfully', data}))
                })
                .catch(e => response.status(404).json({message: 'there was an error deleting the user'}))
        ) : response.status(404).json({message: 'user with the specified id not found'}))
        .catch(err => response.status(500).json({message: 'there was an error fetching the user'}));
});