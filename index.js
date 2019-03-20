const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const usersRouter = require('./users/router');
const postsRouter = require('./posts/router');

const server = express();
server.use(cors());
server.use(helmet());
server.use(express.json());

server.use('/api/posts', postsRouter);
server.use('/api/users', usersRouter);
server.use('/', (req, res) => res.send('API up and running!'));

server.listen(4000, () => console.log('API running on  port 4000'));

