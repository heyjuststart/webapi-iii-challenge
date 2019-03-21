const express = require('express');

const Posts = require('../data/helpers/postDb');

const router = express.Router();

// handles urls beginning with /api/posts

router.get('/', async (req, res) => {
  try {
    const posts = await Posts.get();
    res.status(200).json(posts);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: 'The posts information could not be retrieved.'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Posts.getById(req.params.id);

    if (post) {
      res.status(200).json(post);
    } else {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: 'The post information could not be retrieved.'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!req.body.user_id || !req.body.text) {
      return res.status(400).json({
        errorMessage: 'Please provide a user_id and text value for post'
      });
    }
    const post = await Posts.insert(req.body);
    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'There was an error while saving the post to the database'
    });
  }
});

router.put('/:id', async (req, res) => {
  if (!req.body.user_id || !req.body.text) {
    return res
      .status(400)
      .json({
        errorMessage: 'Please provide user_id and text for the post.'
      });
  }
  try {
    const post = await Posts.update(req.params.id, req.body);
    if (post) {
      const updatedPost = await Posts.getById(req.params.id);
      res.status(200).json(updatedPost);
    } else {
      res
        .status(404)
        .json({ error: 'The post with the specified ID does not exist.' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: 'The post information could not be modified.'
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const maybePost = await Posts.getById(req.params.id);
    if (maybePost) {
      await Posts.remove(req.params.id);
      return res.status(200).json(maybePost);
    } else {
      return res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error removing the post'
    });
  }
});

module.exports = router;
