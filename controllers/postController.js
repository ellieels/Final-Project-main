import Post from '../models/Post.js'; 
import User from '../models/User.js';
import GlazePost from '../models/glazePost.js';
import Course from '../models/Course.js';

/*
export const createPost = async (req, res) => {
  const { title, description, className } = req.body; // Destructure 'class' from req.body
  try {
    console.log(req.body);
    console.log(req.file);
    
    const post = new Post({
      title: title,
      description: description,
      author: req.user._id,
      imageFile: req.file.filename,
      class: className // Add 'class' field to the post
    });
    await post.save();
    res.redirect('/gallery');
  } catch (error) {
    res.status(500).send(error.toString());
  }
};
*/

export const createPost = async (req, res) => {
  const { title, description, className, type, glaze } = req.body; // Destructure 'class' from req.body  
  try {
        const files = req.files;
        if (!files) {
            return res.status(400).send({ message: 'Please upload files.' });
        }
      let fileArray = files.map(file => file.filename);
        console.log(fileArray);
        const postDetails = {
            title: title,
            description: description,
            imageFiles: fileArray,
            author: req.user._id,
            class: className, 
            type: type,
            glaze: glaze
        };
        const newPost = new Post(postDetails);
        await newPost.save();
        res.redirect('/account');
        //res.status(201).send({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).send({ message: 'Error creating post', error: error.message });
    }
};


export const createGlaze = async (req, res) => {
  const { title, notes } = req.body;
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const glazePost = new GlazePost({
      title: title,
      notes: notes,
      imageFile: req.file.filename
    });

    await glazePost.save();
    res.redirect('/glazes');
  } catch (error) {
    res.status(500).send(error.toString());
  }
};


export const createCourse = async (req, res) => {
  const { name, code } = req.body; // Destructure 'class' from req.body  
  console.log(name);
  console.log(code);
  try {
   const course = new Course({
      name: name,
      code: code
    });

    await course.save();
    res.redirect('/course');
  } catch (error) {
    res.status(500).send(error.toString());
  }
};






export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findOneAndDelete({ _id: id });
    res.redirect('/account');
  } catch (error) {
    res.status(500).send(error.toString());
  }
};


// Show form to edit a post (only for post author or admin)
 export const editPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).send('Unauthorized');
    }
    res.render('edit', { post });
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

// Update a post (only for post author or admin)
 export const savePost = async (req, res) => {
  console.log("hello");
  const { id, title, description, className, type, glaze } = req.body; // Destructure 'class' from req.body  

  try {
      const files = req.files;
      console.log(files);
      
      let fileArray = files.map(file => file.filename);
        console.log(fileArray);
        const postDetails = {
            title: title,
            description: description,
            $push: { imageFiles: { $each: fileArray } },
            author: req.user._id,
            class: className, 
            type: type, 
            glaze: glaze
        };
        const post = await Post.findOneAndUpdate({author: req.user._id , _id: id}, postDetails);
    
        if (!post){
          return res.status(404).send('Post not found');
        }
        res.redirect('/account');
    } catch (error) {
        res.status(500).send({ message: 'Error creating post', error: error.message });
    }
};

