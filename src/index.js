document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  const addToyForm = document.querySelector('.add-toy-form');
  const toyForm = document.querySelector('.container');
  let addToy = false;

  // Toggle form visibility
  document.querySelector('#new-toy-btn').addEventListener('click', () => {
    addToy = !addToy;
    if (addToy) {
      toyForm.style.display = 'block';
    } else {
      toyForm.style.display = 'none';
    }
  });

  // Fetch all toys and render them
  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(res => res.json())
      .then(toys => {
        toyCollection.innerHTML = '';
        toys.forEach(toy => renderToy(toy));
      })
      .catch(error => console.error('Error fetching toys:', error));
  }

  // Render a single toy card
  function renderToy(toy) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    
    // Add event listener to like button
    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => increaseLikes(toy));
    
    toyCollection.appendChild(card);
  }

  // Add a new toy
  addToyForm.addEventListener('submit', event => {
    event.preventDefault();
    
    const formData = new FormData(addToyForm);
    const name = formData.get('name');
    const image = formData.get('image');
    
    const newToy = {
      name,
      image,
      likes: 0
    };
    
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newToy)
    })
    .then(res => res.json())
    .then(toy => {
      renderToy(toy);
      addToyForm.reset();
    })
    .catch(error => console.error('Error adding toy:', error));
  });

  // Increase likes for a toy
  function increaseLikes(toy) {
    const newLikes = toy.likes + 1;
    
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
    .then(res => res.json())
    .then(updatedToy => {
      // Find the toy card and update the likes display
      const toyCards = document.querySelectorAll('.card');
      toyCards.forEach(card => {
        if (card.querySelector('h2').textContent === updatedToy.name) {
          card.querySelector('p').textContent = `${updatedToy.likes} Likes`;
        }
      });
    })
    .catch(error => console.error('Error updating likes:', error));
  }

  // Initial fetch of toys
  fetchToys();
});