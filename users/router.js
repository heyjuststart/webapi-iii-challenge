const express = require('express');

const Users = require('../data/helpers/userDb');

const router = express.Router();

// middleware
const ensureUppercase = (req, res, next) => {
  try {
    const name = req.body.name;
    if (!name) {
      return res.status(400).json({ message: 'Name required for this request' });
    }
    const firstLetter = name[0];
    if (firstLetter.toUpperCase() === firstLetter) {
      next();
    } else {
      res.status(400).json({ message: 'Name must be capitalized.' });
    }
  } catch (err) {
    res.status(500).json({
      errorMessage: 'There was an error processing this request',
      err
    });
  }
};

router.get('/', async (req, res) => {
  try {
    const users = await Users.get();
    res.status(200).json(users);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: 'The users information could not be retrieved.'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await Users.getById(req.params.id);

    if (user) {
      res.status(200).json(user);
    } else {
      res
        .status(404)
        .json({ message: 'The user with the specified ID does not exist.' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: 'The user information could not be retrieved.'
    });
  }
});

router.post('/', ensureUppercase, async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({
        errorMessage: 'Please provide a name'
      });
    }
    const user = await Users.insert(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'There was an error while saving the user to the database'
    });
  }
});

router.put('/:id', ensureUppercase, async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({
      errorMessage: 'Please provide a name'
    });
  }
  try {
    const user = await Users.update(req.params.id, req.body);
    if (user) {
      const updatedUser = await Users.getById(req.params.id);
      res.status(200).json(updatedUser);
    } else {
      res
        .status(404)
        .json({ error: 'The user with the specified ID does not exist.' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: 'The user information could not be modified.'
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const maybeUser = await Users.getById(req.params.id);
    if (maybeUser) {
      await Users.remove(req.params.id);
      return res.status(200).json(maybeUser);
    } else {
      return res
        .status(404)
        .json({ message: 'The user with the specified ID does not exist.' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error removing the user'
    });
  }
});

router.get('/:id/posts', async (req, res) => {
  try {
    const posts = await Users.getUserPosts(req.params.id);

    if (posts) {
      res.status(200).json(posts);
    } else {
      res
        .status(404)
        .json({ message: 'The posts with the specified ID does not exist.' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: 'The post information could not be retrieved.'
    });
  }
});

module.exports = router;
