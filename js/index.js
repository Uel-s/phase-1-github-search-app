// Define the API endpoints
const searchApiUrl = 'https://api.github.com/search/users?q=';
const reposApiUrl = 'https://api.github.com/users/';

// Get the form element and add a submit event listener
const form = document.getElementById('github-form');
form.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting

  // Get the search input value
  const searchInputValue = document.getElementById('search').value;

  // Use fetch to get the user search results from the GitHub API
  fetch(searchApiUrl + searchInputValue + '&per_page=5') // Limit to 5 results for demo purposes
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('An error occurred while fetching user search results.');
      }
    })
    .then(data => {
      // Get the user list element and clear any existing content
      const userListElement = document.getElementById('user-list');
      userListElement.innerHTML = '';

      // Loop through the search results and create a list item element for each user
      data.items.forEach(user => {
        // Create an anchor element for the user's profile link
        const profileLinkElement = document.createElement('a');
        profileLinkElement.href = user.html_url;
        profileLinkElement.textContent = user.login;

        // Create an image element for the user's avatar
        const avatarElement = document.createElement('img');
        avatarElement.src = user.avatar_url;

        // Create a list item element for the user and append the profile link and avatar to it
        const userListItemElement = document.createElement('li');
        userListItemElement.appendChild(profileLinkElement);
        userListItemElement.appendChild(avatarElement);

        // Add a click event listener to the user list item to fetch the user's repositories
        userListItemElement.addEventListener('click', function() {
          // Use fetch to get the user's repositories from the GitHub API
          fetch(reposApiUrl + user.login + '/repos')
            .then(response => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error('An error occurred while fetching user repositories.');
              }
            })
            .then(data => {
              // Get the repos list element and clear any existing content
              const reposListElement = document.getElementById('repos-list');
              reposListElement.innerHTML = '';

              // Loop through the repositories and create a list item element for each one
              data.forEach(repo => {
                // Create an anchor element for the repository's link
                const repoLinkElement = document.createElement('a');
                repoLinkElement.href = repo.html_url;
                repoLinkElement.textContent = repo.name;

                // Create a list item element for the repository and append the link to it
                const repoListItemElement = document.createElement('li');
                repoListItemElement.appendChild(repoLinkElement);

                // Add the repository list item to the repos list element
                reposListElement.appendChild(repoListItemElement);
              });
            })
            .catch(error => {
              console.error(error);
            });
        });

        // Add the user list item to the user list element
        userListElement.appendChild(userListItemElement);
      });
    })
    .catch(error => {
      console.error(error);
    });
});