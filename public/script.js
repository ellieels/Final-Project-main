let filterTypes = {};
// Assuming filterTypes is your object containing sets
const intersectionOfAllFilters = () => {
    const allSets = Object.values(filterTypes);
    
    // Start with the first set as the base for intersection
    return allSets.reduce((intersection, currentSet) => {
        return new Set([...intersection].filter(item => currentSet.has(item)));
    });
};
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}



function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#blah').attr('src', e.target.result).width(150).height(200);
    };

    reader.readAsDataURL(input.files[0]);
  }
}
/*
document.addEventListener('DOMContentLoaded', () => {
  const posts = document.querySelectorAll('.post');
  const popups = document.querySelectorAll('.popup');
  const overlay = document.createElement('div');
  overlay.classList.add('popup-overlay');
  document.body.appendChild(overlay);

  posts.forEach((post, index) => {
    post.addEventListener('click', () => {
      popups[index].style.display = 'block';
      overlay.style.display = 'block';
    });
  });

  document.querySelectorAll('.close').forEach((closeButton, index) => {
    closeButton.addEventListener('click', () => {
      popups[index].style.display = 'none';
      overlay.style.display = 'none';
    });
  });

  overlay.addEventListener('click', () => {
    popups.forEach(popup => popup.style.display = 'none');
    overlay.style.display = 'none';
  });
});
*/

document.addEventListener('DOMContentLoaded', () => {
  const posts = document.querySelectorAll('.post');
  const popups = document.querySelectorAll('.popup');
  const overlay = document.createElement('div');
  overlay.classList.add('popup-overlay');
  document.body.appendChild(overlay);

  posts.forEach((post) => {
    const postId = post.id.split('-')[1]; // Extract post ID from element ID
    post.addEventListener('click', () => {
      const popup = document.getElementById(`popup-${postId}`); // Get popup by ID
      if (popup) {
        popup.style.display = 'block';
        overlay.style.display = 'block';
      }
    });
  });

  document.querySelectorAll('.close').forEach((closeButton) => {
    closeButton.addEventListener('click', () => {
      const popup = closeButton.closest('.popup'); // Get the closest popup
      if (popup) {
        popup.style.display = 'none';
        overlay.style.display = 'none';
      }
    });
  });

  overlay.addEventListener('click', () => {
    popups.forEach(popup => popup.style.display = 'none');
    overlay.style.display = 'none';
  });
});




//GLAZE POPUP
document.addEventListener('DOMContentLoaded', () => {
  const glazePosts = document.querySelectorAll('.glazePost');
  const popups = document.querySelectorAll('.glaze-popup');
  const overlay = document.createElement('div');
  overlay.classList.add('popup-overlay');
  document.body.appendChild(overlay);

  glazePosts.forEach((post, index) => {
    post.addEventListener('click', () => {
      popups[index].style.display = 'block';
      overlay.style.display = 'block';
    });
  });

  document.querySelectorAll('.close').forEach((closeButton, index) => {
    closeButton.addEventListener('click', () => {
      popups[index].style.display = 'none';
      overlay.style.display = 'none';
    });
  });

  overlay.addEventListener('click', () => {
    popups.forEach(popup => popup.style.display = 'none');
    overlay.style.display = 'none';
  });
});





//IMAGES BUTTON
document.addEventListener('DOMContentLoaded', () => {
  const popups = document.querySelectorAll('.popup');
  popups.forEach((popup, index) => {
    const nextImageButton = popup.querySelector('.next-image');
    const imageElement = popup.querySelector('.popup-image');
    const imageFiles = posts[index].imageFiles;
    let currentImageIndex = 0;

    nextImageButton.addEventListener('click', () => {
      currentImageIndex = (currentImageIndex + 1) % imageFiles.length;
      imageElement.src = `/images/${imageFiles[currentImageIndex]}`;
    });
  });
});

//HTMX
 document.addEventListener('htmx:afterSwap', (event) => {
      if (event.detail.target.id === 'glaze-popup-content') {
        document.getElementById('glaze-popup-content').classList.add('active');
      }
    });

    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('close')) {
        document.getElementById('glaze-popup-content').classList.remove('active');
      }
    });







//search
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchInput').addEventListener('input', updatePosts);

});


/*
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchInput').addEventListener('input', updatePosts);
});

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.createElement('div');
  const popups = document.querySelectorAll('.popup');
  overlay.classList.add('popup-overlay');
  document.body.appendChild(overlay);
  initializePosts ();
  
  overlay.addEventListener('click', () => {
    popups.forEach(popup => popup.style.display = 'none');
    overlay.style.display = 'none';
  });
  document.querySelectorAll('.close').forEach((closeButton, index) => {
    closeButton.addEventListener('click', () => {
      popups[index].style.display = 'none';
      document.getElementById(closeButton.parentElement.parentElement.id).style.display = 'none';
      overlay.style.display = 'none';
    });
  });
});

function initializePosts () => {
  const posts = document.querySelectorAll('.post');
  
  posts.forEach((post, index) => {
    post.addEventListener('click', () => {
      popups[index].style.display = 'block';
      overlay.style.display = 'block';
    });
  });
  
};
*/



/*
async function updatePosts() {
  try {
    const searchTerm = document.getElementById('searchInput').value;

    const response = await fetch('/searchPosts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchTerm }),
    });

    if (response.ok) {
      const posts = await response.json();
      const container = document.getElementById('postsList');
      container.innerHTML = '';
      posts.forEach(post => {
        const postElement = `
          <div class="post" id="popupTrigger-${post._id}">
              <div class="image-container">
                <img class="post-image" src="/images/${post.imageFiles[0]}" alt="">
              </div>
              <h2 class="post-title">${post.title}</h2>
              <p class="post-author">${post.author ? post.author.username : 'Unknown Author'}</p>
            </div>
        `;
        container.innerHTML += postElement;
      });
    } else {
      console.error('Response not ok with status:', response.status);
    }
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
}
*/





async function updatePosts() {
  try {
    const searchTerm = document.getElementById('searchInput').value;

    const response = await fetch('/searchPosts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchTerm }),
    });

    if (response.ok) {
      const posts = await response.json();
      const container = document.getElementById('postsList');
      container.innerHTML = '';

      // Sort posts in descending order based on createdAt date
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      posts.forEach(post => {
        const postElement = `
          <div class="post" id="popupTrigger-${post._id}">
              <div class="image-container">
                <img class="post-image" src="/images/${post.imageFiles[0]}" alt="">
              </div>
              <h2 class="post-title">${post.title}</h2>
              <p class="post-author">${post.author ? post.author.username : 'Unknown Author'}</p>
            </div>
        `;
        container.innerHTML += postElement;
      });

      // Re-attach event listeners for the new posts
      attachPopupListeners();
    } else {
      console.error('Response not ok with status:', response.status);
    }
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
}


function attachPopupListeners() {
  const posts = document.querySelectorAll('.post');
  const overlay = document.querySelector('.popup-overlay');
  console.log(overlay);
  
  posts.forEach((post) => {
    const postId = post.id.split('-')[1]; // Extract post ID
    post.addEventListener('click', () => {
      const popup = document.getElementById(`popup-${postId}`); // Get popup by ID
      if (popup) {
        popup.style.display = 'block';
        overlay.style.display = 'block';
      }
    });
  });

  // Re-attach close event listeners
  document.querySelectorAll('.close').forEach((closeButton) => {
    closeButton.addEventListener('click', () => {
      const popup = closeButton.closest('.popup'); // Get the closest popup
      if (popup) {
        popup.style.display = 'none';
        overlay.style.display = 'none';
      }
    });
  });
  
  overlay.addEventListener('click', () => {
    const popups = document.querySelectorAll('.popup'); // Get all popups
    popups.forEach(popup => popup.style.display = 'none');
    overlay.style.display = 'none';
  });
}

// Call attachPopupListeners on initial load
attachPopupListeners();


function openFilter() {
      document.getElementById("filterPanel").style.right = "0";
      document.addEventListener('click', closeOnOutsideClick); // Add click listener for outside clicks
    }

    function closeFilter() {
      document.getElementById("filterPanel").style.right = "-300px";
      document.removeEventListener('click', closeOnOutsideClick); // Remove click listener to prevent unnecessary checks
    }

    function closeOnOutsideClick(event) {
      const filterPanel = document.getElementById('filterPanel');
      if (!filterPanel.contains(event.target) && event.target !== document.querySelector('.open-btn')) {
        closeFilter();
      }
    }
//updatePosts();

// Course Popup

document.addEventListener('DOMContentLoaded', () => {
  const coursePosts = document.querySelectorAll('.coursePost'); // Target the course posts
  const popups = document.querySelectorAll('.course-popup'); // Target the correct class for the popups
  const overlay = document.createElement('div');
  overlay.classList.add('popup-overlay');
  document.body.appendChild(overlay);

  coursePosts.forEach((post, index) => {
    post.addEventListener('click', () => {
      const popup = document.getElementById(`course-popup-${index}`); // Use the correct popup ID
      if (popup) {
        popup.style.display = 'block';
        overlay.style.display = 'block';
      }
    });
  });

  document.querySelectorAll('.close').forEach((closeButton, index) => {
    closeButton.addEventListener('click', () => {
      popups[index].style.display = 'none';
      overlay.style.display = 'none';
    });
  });

  overlay.addEventListener('click', () => {
    popups.forEach(popup => popup.style.display = 'none');
    overlay.style.display = 'none';
  });
});





//ART FILTER


document.addEventListener('DOMContentLoaded', () => {
  const posts = document.querySelectorAll('.post');
  const checkboxes = document.querySelectorAll('.gallery-checkbox');
  const clearFiltersButton = document.getElementById('clearFiltersButton');
  
  // Handle the Clear All Filters button click
  clearFiltersButton.addEventListener('click', () => {
    // Uncheck all checkboxes
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    // Clear the filterTypes object
    filterTypes = {};  // Ensure filterTypes can be reassigned here

    // Show all posts after clearing filters
    posts.forEach(post => {
      post.style.display = 'block';
    });

    console.log('All filters cleared');
  });

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', async (event) => {
      const value = event.target.value;
      let filterName = null;
      if(event.target.name == "glaze[]"){
        filterName = event.target.id;
      }
      else {
        filterName = event.target.value;
      }

      console.log(`Checkbox clicked with value: ${value}`);
      
      if (!event.target.checked) {
        delete filterTypes[filterName];
        console.log(filterTypes);
      } else {
        // Send a POST request using fetch
        try {
          const response = await fetch('/filterPosts', { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ checkboxValue: value }),
          });
          
          // Check if the response is successful
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          // Parse the JSON from the response
          const data = await response.json();
          console.log('Response from server:', data);

          const filteredPosts = data.map(post =>
            document.getElementById("popupTrigger-" + post._id)
          );

          filterTypes[filterName] = new Set(filteredPosts);

        } catch (error) {
          console.error('Error with fetch operation:', error);
        }
      }

      // Update the display of posts based on filters
      if (isEmpty(filterTypes)) {
        posts.forEach(post => {
          post.style.display = 'block';
        });
      } else { 
        posts.forEach(post => {
          post.style.display = 'none';
        });
        
        const totalFilter = intersectionOfAllFilters();
        for (let post of totalFilter) {
          post.style.display = 'block';
        }
      }
    });
  });
});



/*
document.addEventListener('DOMContentLoaded', () => {
  const posts = document.querySelectorAll('.post');
  const checkboxes = document.querySelectorAll('.gallery-checkbox');
  
    // Handle the Clear All Filters button click
  clearFiltersButton.addEventListener('click', () => {
    // Uncheck all checkboxes
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    // Clear the filterTypes object
    filterTypes = {};

    // Show all posts after clearing filters
    posts.forEach(post => {
      post.style.display = 'block';
    });

    // Optional: If you want to reset any other state that controls posts display, you can do so here
    console.log('All filters cleared');
  });

  checkboxes.forEach(checkbox => {
 
    checkbox.addEventListener('click', async (event) => {
      const value = event.target.value;
      let filterName = null;
      if(event.target.name == "glaze[]"){
        filterName = event.target.id;
      }
      else {
        filterName = event.target.value;
      }
      
      console.log(`Checkbox clicked with value: ${value}`);
      
      if (!event.target.checked) {
        console.log("test");
        delete filterTypes[filterName]; 
        console.log(filterTypes);
      } else {
        // Send a POST request using fetch
        try {
          const response = await fetch('/filterPosts', { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ checkboxValue: value }),
          });
  // Check if the response is successful
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          // Parse the JSON from the response
          const data = await response.json();
          console.log('Response from server:', data);

         const filteredPosts = data.map(post =>
          document.getElementById("popupTrigger-"+ post._id)
         );

          filterTypes[filterName] = new Set(filteredPosts);
          
        } catch (error) {
          console.error('Error with fetch operation:', error);
        }
        
      };
      
    


      
      if(isEmpty(filterTypes)){
        posts.forEach((post) => {
          post.style.display = 'block';
        });
      } else { 
        posts.forEach((post) => {
            post.style.display = 'none';
          });
        const totalFilter = intersectionOfAllFilters();
        for(let post of totalFilter){
          console.log(post.id);
          post.style.display = 'block';
        };
      };
      
    });
  });
});

*/



/*
document.addEventListener('DOMContentLoaded', function () {
    const filterGlazeCheckboxes = document.querySelectorAll('input[name="glaze[]"]');
    const filterClassCheckboxes = document.querySelectorAll('input[name="class[]"]');
    const posts = document.querySelectorAll('.post');

    // Event listener for filter checkboxes
    filterGlazeCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', filterPosts);
    });
    
    filterClassCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', filterPosts);
    });

    function filterPosts() {
        const selectedGlazes = Array.from(filterGlazeCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        const selectedClasses = Array.from(filterClassCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        posts.forEach(post => {
            // Extract the glazes and class from each post
            const postGlazes = post.querySelector('.post-glaze').innerText.split(', ').map(g => g.trim());
            const postClass = post.querySelector('.post-class').innerText.trim();

            // Check if the post matches the selected glazes and classes
            const glazeMatch = selectedGlazes.length === 0 || selectedGlazes.some(glaze => postGlazes.includes(glaze));
            const classMatch = selectedClasses.length === 0 || selectedClasses.includes(postClass);

            // Show or hide the post based on the matches
            if (glazeMatch && classMatch) {
                post.style.display = ''; // Show post
            } else {
                post.style.display = 'none'; // Hide post
            }
        });
    }
});
*/