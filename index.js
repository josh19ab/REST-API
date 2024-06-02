document.getElementById('fetch-posts').addEventListener('click', fetchPosts);

function fetchPosts() {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '<p class="loading">Loading...</p>'; // Show loading indicator

    //Frtch user details and post
    Promise.all([
        fetch('https://jsonplaceholder.typicode.com/posts').then(response => response.json()),
        fetch('https://jsonplaceholder.typicode.com/users').then(response => response.json())
    ]).then(([posts, users]) => {
        postsContainer.innerHTML = ''; 

       // Create a usermap lookup
        const userMap = {};
        users.forEach(user => {
            userMap[user.id] = user;
        });

        posts.slice(0, 10).forEach(post => {    //Limting to 10 Posts
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <p><strong>User:</strong> ${userMap[post.userId].name} (${userMap[post.userId].email})</p>
            `;
            postElement.addEventListener('click', () => displayPostDetails(post.id)); //To open post details
            postsContainer.appendChild(postElement);
        });
    }).catch(error => {
        console.error('Error fetching posts:', error);
        postsContainer.innerHTML = '<p class="error">Error fetching posts. Please try again later.</p>'; // Display error message
    });
}

//Post details
function displayPostDetails(postId) {
    const modal = document.getElementById('post-modal');
    const postDetails = document.getElementById('post-details');
    modal.style.display = 'block';
    postDetails.innerHTML = '<p class="loading">Loading post details...</p>';

    //Fetch comments by post id
    Promise.all([
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(response => response.json()),
        fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`).then(response => response.json())
    ]).then(([post, comments]) => {
        postDetails.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <h3>Comments</h3>
            ${comments.map(comment => `
                <div class="comment">
                    <p><strong>${comment.name} (${comment.email}):</strong></p>
                    <p>${comment.body}</p>
                </div>
            `).join('')}
        `;
    }).catch(error => {
        console.error('Error fetching post details:', error);
        postDetails.innerHTML = '<p class="error">Error fetching post details. Please try again later.</p>';
    });

   
    document.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}
