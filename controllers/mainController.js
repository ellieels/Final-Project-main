import User from '../models/User.js';
import Post from '../models/Post.js'; 
import glazePost from '../models/glazePost.js'; 
import Course from '../models/Course.js'; 

export const home = async (req, res) => {
  res.render('index');
};

export const glazes = async (req, res) => {
  try {
    const posts = await Post.find().populate('author');
    const user = req.user; 
    const glazePosts = await glazePost.find();
    res.render('glazes', { glazePosts, posts, user });
  } catch (error) {
    console.error('Error fetching data for gallery:', error);
    res.status(500).send('Server error');
  }
};


/*
export const gallery = async (req, res) => {
  const posts = await Post.find().populate('author');
  const user = await User.find().populate('username');
  console.log(user);
  const glazePosts = await glazePost.find();
  res.render('gallery', { glazePosts , posts } ); //, user } );
};
*/

//export const gallery = async (req, res) => {
//  try {
//    const posts = await Post.find().populate('author').sort({ createdAt: -1 });
//    const glazePosts = await glazePost.find();
//    const user = req.user;
//    res.render('gallery', { glazePosts, posts, user });
//  } catch (error) {
//    console.error('Error fetching data for gallery:', error);
//    res.status(500).send('Server error');
//  }
//};

export const gallery = async (req, res) => {
  try {
    const posts = await Post.find().populate('author').sort({ createdAt: -1 });
    const glazePosts = await glazePost.find();
    const user = req.user; // Ensure `req.user` is populated
    
    // Make sure to pass `user` to the render function
    res.render('gallery', { glazePosts, posts, user });
  } catch (error) {
    console.error('Error fetching data for gallery:', error);
    res.status(500).send('Server error');
  }
};

export const edit = async (req, res) => {
  try {
    const posts = await Post.findOne({author: req.user._id , _id: req.params.id});
    const user = req.user; 
    console.log(posts);
    const glazePosts = await glazePost.find();
    res.render('edit', { glazePosts, posts, user });
  } catch (error) {
    console.error('Error fetching data for gallery:', error);
    res.status(500).send('Server error');
  }
};

/*
export const artist = async (req, res) => {
  try {
    const userId = req.user._id;
    const userPosts = await Post.find({ author: req.user._id, _id: req.params.id});

  const posts = await Post.find();
    res.render('artist', {
      user: req.user,
      userPosts: userPosts , posts 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching user posts.');
  }
};
*/

export const artist = async (req, res) => {
  try {
    const artistId = req.params.id;
    const userPosts = await Post.find({ author: artistId }).populate('author').sort({ createdAt: -1 });
    const author = userPosts.length > 0 ? userPosts[0].author : null;

    const posts = await Post.find();
    res.render('artist', {
      user: req.user,
      userPosts: userPosts,
      author: author
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the artist’s posts.');
  }
};


export const account = async (req, res) => {
  try {
    const userId = req.user._id;
    const userPosts = await Post.find({ author: userId })
                                .populate('author')
                                .sort({ createdAt: -1 });

    const posts = await Post.find();

    res.render('account', {
      user: req.user,
      userPosts: userPosts,
      posts: posts
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching user posts.');
  }
};


export const favorites = async (req, res) => {
  res.render('favorites');
};

export const uploadart = async (req, res) => {
  const glazePosts = await glazePost.find();
  res.render('uploadart', { glazePosts } );
};

export const uploadglaze = async (req, res) => {
  res.render('uploadglaze');
};

export const course = async (req, res) => {
  try {
    const courses = await Course.find();

    // Fetch students for each course
    const coursesWithStudents = await Promise.all(
      courses.map(async (course) => {
        const students = await User.find({ 'course.code': course.code }); // Find users with this course code
        return { ...course._doc, students }; // Add the students to the course object
      })
    );

    res.render('course', { courses: coursesWithStudents });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send('An error occurred while fetching courses.');
  }
};


export const addTeacher = async (req, res) => {
  res.render('addTeacher');
};



export const postTeacher = async (req, res) => {
  const {name} = req.body;
  try {
    await User.findOneAndUpdate({ username: name , role:{$in:['student','visitor']} }, { role: "teacher"});
    
    res.render('addTeacher');
  } catch (error) {
    res.status(500).send('Error fetching glaze posts');
  }
};

export const joinCourse = async (req, res) => {
  res.render('joinCourse');
};

/*
export const addToCourse = async (req, res) => {
  const {code} = req.body;
  try {
    let course = await User.findOne({course: { $elemMatch: { code: code } }})
    if (course){
      req.flash('update', `Already joined course`);
      res.redirect('/joinCourse');
      return;
    }
    course = await Course.findOne({ code });
    if (course){
      console.log(course);
      const newCourse = {
        name: course.name,
        code: course.code
      }
      await User.findOneAndUpdate({ _id: req.user._id }, { "$push": { course: newCourse } });
      
      console.log("success");
      req.flash('update', `Success`);
    }
    else{
      console.log("failure");
      req.flash('update', `No Course Found`);
    }
    res.redirect('/joinCourse');
  } catch (error) {
    res.status(500).send('Error fetching glaze posts');
  }
};
*/

export const addToCourse = async (req, res) => {
  const { code } = req.body;
  try {
    // Check if any user is already enrolled in the course with the given code
    const existingCourse = await Course.findOne({ code });
    if (!existingCourse) {
      req.flash('update', `No Course Found`);
      res.redirect('/joinCourse');
      return;
    }

    // Check if the user is already in the course
    const userInCourse = await User.findOne({ 
      _id: req.user._id, 
      course: { $elemMatch: { code: code } } 
    });

    if (userInCourse) {
      req.flash('update', `Already joined course`);
      res.redirect('/joinCourse');
      return;
    }

    // Add the user to the course
    const newCourse = {
      name: existingCourse.name,
      code: existingCourse.code
    };

    await User.findOneAndUpdate(
      { _id: req.user._id },
      { "$push": { course: newCourse } }
    );

    console.log("success");
    req.flash('update', `Success`);
    res.redirect('/joinCourse');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding to course');
  }
};




// Get all glaze posts
export const getAllGlazes = async (req, res) => {
  try {
    console.log("test1");
    const glazes = await glazePost.find();
    res.render('glazes', { glazes });
  } catch (error) {
    res.status(500).send('Error fetching glaze posts');
  }
};

// Get a single glaze post by ID
export const getGlazeById = async (req, res) => {
  const { id } = req.params;
  try {
    console.log("test2");
    const glaze = await glazePost.findById(id);
    if (req.headers['hx-request']) {
      res.render('glazeDetails', { glaze });
    } else {
      res.render('glazes', { action: 'show', glazes: [glaze], glaze });
    }
  } catch (error) {
    res.status(500).send('Error fetching glaze post details');
  }
};

export const searchPosts = async (req, res) => {
  const searchTerm = req.body.searchTerm; // Get the search term from the request body

  try {
    const posts = await Post.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive regex search for title
        { author: { $in: await User.find({ username: { $regex: searchTerm, $options: 'i' } }, '_id') } }
      ]
    }).populate('author');

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while searching for posts.');
  }
};


//FILTER PRODUCTS

export const filterPosts = async (req, res) => {
  console.log(req.body);
  let filterType = 0; //0 is glaze
  const _class = ["Handbuilding", "Clay Design & Engineering I", "Clay Design & Engineering II"];
  const filterValue = req.body.checkboxValue; // Get the search term from the request body
  if(_class.includes(filterValue)){
    filterType = 1; //1 is for class
  };
  
  let query = {glaze: filterValue};
  if(filterType){
    query = {"class": filterValue};
  }
  
  try {
    const posts = await Post.find(
      query, { _id: 1 });
    
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while searching for posts.');
  }
};












export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;
    const post = await Post.findOneAndUpdate({ _id: id , $expr: { $gt: [{ $size: "$imageFiles" }, 1] }}, { $pull: { imageFiles: image } });
    console.log(post);
    console.log(image);
    console.log(id);
    res.redirect('/editPost/'+ id );
  } catch (error) {
    res.status(500).send(error.toString());
  }
};









//
//export const getProducts = async (req, res) => {
//  const { name } = req.body;
//  let query = {};
//
//  if (name) {
//    query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
//  }
//
//  try {
//    const products = await Product.find(query).sort({price: -1});
//    res.json(products); // Send back JSON response
//  } catch (error) {
//    console.error('Error fetching products:', error);
//    res.status(500).send(error);
//  }
//};
//
//export const addToCart = async (req, res) => {
//  try {
//    let { productId, quantity } = req.body;
//    quantity = parseInt(quantity);
//    const product = await Product.findById(productId);
//    if (!product) {
//      return res.status(404).send('Product not found');
//    }
//    const price = product.price;
//  
//    const userId = req.user._id;
//    let user = await User.findOne({ _id: userId });
//    console.log(user);
//    
//    const itemIndex = user.cart.items.findIndex(item => item.productId.toString() === productId);
//    if (itemIndex > -1) {
//      user.cart.items[itemIndex].quantity += quantity;
//      user.cart.items[itemIndex].price = price;
//      req.flash('update', `Successfully added ${product.name} to cart!`)
//    } else {
//      user.cart.items.push({ productId, quantity, price });
//    }
//    user.cart.totalQuantity += quantity;
//    user.cart.totalPrice += price * quantity;
//    
//
//    await user.save();
//    const populatedUser = await User.findOne({ _id: userId }).populate('cart.items.productId');
//    res.redirect('/showCart');
//  } catch (error) {
//    console.error(error);
//    res.status(500).send('An error occurred');
//  }
//};
//
//export const showCart = async (req, res) => {
//  try {
//    const populatedUser = await User.findOne({ _id: req.user }).populate('cart.items.productId');
//    res.render('cart', {user: populatedUser});
//  } catch (error) {
//    console.error(error);
//    res.status(500).send('An error occurred');
//  }
//}
//
//
//export const purchase = async (req, res) => {
//  try {
//    const user = await User.findOne({ _id: req.user }).populate('cart.items.productId');
//
//    const cartItems = user.cart.items;
//
//    cartItems.forEach(cartItem => {
//      const { productId, quantity, price } = cartItem; 
//      
//      const itemIndex = user.purchases.items.findIndex(purchaseItem => purchaseItem.productId.toString() === productId.toString());
//
//      if (itemIndex > -1) {
//        user.purchases.items[itemIndex].quantity += quantity;
//        user.purchases.items[itemIndex].price = price;
//     req.flash('update', `Successfully purchased items!`)   
//      } else {
//        user.purchases.items.push({ productId: productId, quantity: quantity, price: price });
//      }
//      
//      user.purchases.totalQuantity += quantity;
//      user.purchases.totalPrice += price * quantity;
//    });
//
//    await user.save();
//    res.redirect('/clearCart'); 
//  } catch (error) {
//    console.error(error);
//    res.status(500).send('An error occurred');
//  }
//};
//
//export const user = async (req, res) => {
//  try {
//    const user = await User.findOne({ _id: req.user }).populate('purchases.items.productId');
//
//    res.render('user', {user: user}); 
//  } catch (error) {
//    console.error(error);
//    res.status(500).send('An error occurred');
//  }
//}
//
//export const clearCart = async (req, res) => {
//  try {
//    const user = await User.findOne({ _id: req.user });
//    user.cart = { items: [], totalQuantity: 0, totalPrice: 0 };
//    user.save();
//    req.flash('update', `Cleared cart`)
//    res.redirect('/showCart');
//  } catch (error) {
//    console.error(error);
//    res.status(500).send('An error occurred');
//  }
//}
//
//export const deleteItem = async (req, res) => {
//  console.log("check");
//  try {
//    let productId = req.params.productId;
//    console.log(productId);
//    const product = await Product.findById(productId);
//    if (!product) {
//      return res.status(404).send('Product not found');
//    }
//    const userId = req.user._id;
//    let user = await User.findOne({ _id: userId });
//    console.log(user);
//    if (user.cart) {
//      const itemIndex = user.cart.items.findIndex(item => item.productId.toString() === productId);
//      if (itemIndex > -1) { // only splice array when item is found
//        let quantity = user.cart.items[itemIndex].quantity;
//        let price = user.cart.items[itemIndex].price;
//        user.cart.items.splice(itemIndex, 1); // 2nd parameter means remove one item only
//        user.cart.totalQuantity -= quantity;
//        user.cart.totalPrice -= price * quantity;
//      } 
//      
//    } 
//
//    await user.save();
//    req.flash('update', `Deleted ${product.name} from cart!`)
//    res.redirect('/showCart');
//  } catch (error) {
//    console.error(error);
//    res.status(500).send('An error occurred');
//  }
//};
//
//
//





