// update 2
let token = localStorage.getItem('token') || '';
let userRole = localStorage.getItem('role') || '';

function toggleModal() {
  document.getElementById('auth-modal').style.display = 'flex';
}

window.onclick = function (event) {
  if (event.target.classList.contains('modal')) {
    document.getElementById('auth-modal').style.display = 'none';
  }
}

function switchTab(tab) {
  document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('signup-form').style.display = tab === 'signup' ? 'block' : 'none';
  document.getElementById('login-tab').classList.toggle('active', tab === 'login');
  document.getElementById('signup-tab').classList.toggle('active', tab === 'signup');
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  token = '';
  userRole = '';
  alert('Logged out successfully.');
  location.reload();
}

async function fetchMovies() {
  const search = document.getElementById('search').value.trim();

  const res = await fetch(`http://localhost:8000/api/movies${search ? '?search=' + encodeURIComponent(search) : ''}`, {
    method: 'GET',
    mode: 'cors'
  });

  if (!res.ok) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Failed to fetch movies.',
    });
    return;
  }

  const movies = await res.json();

  const list = document.getElementById('movieList');
  list.innerHTML = '';

  if (movies.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'No Movies Found',
      text: 'Try searching with a different title.',
    });
    return;
  }

  movies.forEach(m => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${m.title}</h3>
      <p><strong>Genre:</strong> ${m.genre || 'N/A'}</p>
      <p><strong>Year:</strong> ${m.year || 'N/A'}</p>
      <p><strong>ISBN:</strong> ${m.isbn}</p>
      <p><strong>Director:</strong> ${m.director?.firstname || ''} ${m.director?.lastname || ''}</p>
      <div class="actions">
        ${userRole === 'admin' ? `<button onclick="deleteMovie('${m.id}')">Delete</button>` : ''}
      </div>
    `;
    list.appendChild(card);
  });

  // Show logout button if logged in
  document.getElementById('logout-btn').style.display = token ? 'inline-block' : 'none';
}

async function deleteMovie(id) {
  if (!confirm("Are you sure you want to delete this movie?")) return;

  const res = await fetch(`http://localhost:8000/api/movies/${id}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (res.status === 403) {
    alert('Session expired or unauthorized. Please login again.');
    logout();
    return;
  }

  if (!res.ok) {
    alert('Failed to delete movie.');
    return;
  }

  alert('Movie deleted successfully!');
  fetchMovies();
}

document.getElementById('movie-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  if (userRole !== '') {
    alert('Only admins can add movies.');
    return;
  }

  const title = document.getElementById('title').value;
  const isbn = document.getElementById('isbn').value;
  const genre = document.getElementById('genre').value;
  const year = parseInt(document.getElementById('year').value);
  const firstname = document.getElementById('firstname').value;
  const lastname = document.getElementById('lastname').value;

  const res = await fetch('http://localhost:8000/api/movies', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, isbn, genre, year, director: { firstname, lastname } })
  });

  if (res.status === 403) {
    alert('Session expired or unauthorized. Please login again.');
    logout();
    return;
  }

  if (!res.ok) {
    alert('Failed to add movie.');
    return;
  }

  alert('Movie added successfully!');
  e.target.reset();
  fetchMovies();
});

async function login() {
  const user = document.getElementById('login-username').value;
  const pass = document.getElementById('login-password').value;

  const res = await fetch('http://localhost:8000/api/login', {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: user, password: pass })
  });

  if (!res.ok) {
    alert('Login failed.');
    return;
  }

  const data = await res.json();
  token = data.token;
  userRole = data.role;

  localStorage.setItem('token', token);
  localStorage.setItem('role', userRole);

  alert(`Logged in as: ${userRole}`);
  document.getElementById('auth-modal').style.display = 'none';
  fetchMovies();
}

async function signup() {
  const user = document.getElementById('signup-username').value;
  const pass = document.getElementById('signup-password').value;

  const res = await fetch('http://localhost:8000/api/signup', {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: user, password: pass })
  });

  if (!res.ok) {
    alert('Signup failed.');
    return;
  }

  alert('Signup successful. Please login.');
  document.getElementById('auth-modal').style.display = 'none';
}

fetchMovies();
document.getElementById('logout-btn').style.display = token ? 'inline-block' : 'none';


// update 1
// let token = localStorage.getItem('token') || '';
// let userRole = localStorage.getItem('role') || '';

// function toggleModal() {
//   document.getElementById('auth-modal').style.display = 'flex';
// }

// window.onclick = function (event) {
//   if (event.target.classList.contains('modal')) {
//     document.getElementById('auth-modal').style.display = 'none';
//   }
// }

// function switchTab(tab) {
//   document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
//   document.getElementById('signup-form').style.display = tab === 'signup' ? 'block' : 'none';
//   document.getElementById('login-tab').classList.toggle('active', tab === 'login');
//   document.getElementById('signup-tab').classList.toggle('active', tab === 'signup');
// }

// async function fetchMovies() {
//   const search = document.getElementById('search').value.trim();

//   const res = await fetch(`http://localhost:8000/api/movies${search ? '?search=' + encodeURIComponent(search) : ''}`);

//   if (!res.ok) {
//     Swal.fire({
//       icon: 'error',
//       title: 'Oops...',
//       text: 'Failed to fetch movies.',
//     });
//     return;
//   }

//   const movies = await res.json();

//   const list = document.getElementById('movieList');
//   list.innerHTML = '';

//   if (movies.length === 0) {
//     Swal.fire({
//       icon: 'info',
//       title: 'No Movies Found',
//       text: 'Try searching with a different title.',
//     });
//     return;
//   }

//   movies.forEach(m => {
//     const card = document.createElement('div');
//     card.className = 'card';
//     card.innerHTML = `
//       <h3>${m.title}</h3>
//       <p><strong>Genre:</strong> ${m.genre || 'N/A'}</p>
//       <p><strong>Year:</strong> ${m.year || 'N/A'}</p>
//       <p><strong>ISBN:</strong> ${m.isbn}</p>
//       <p><strong>Director:</strong> ${m.director?.firstname || ''} ${m.director?.lastname || ''}</p>
//       <div class="actions">
//         ${userRole === 'admin' ? `<button onclick="deleteMovie('${m.id}')">Delete</button>` : ''}
//       </div>
//     `;
//     list.appendChild(card);
//   });
// }

// async function deleteMovie(id) {
//   if (!confirm("Are you sure you want to delete this movie?")) return;

//   const res = await fetch(`http://localhost:8000/api/movies/${id}`, {
//     method: 'DELETE',
//     headers: { 'Authorization': `Bearer ${token}` }
//   });

//   if (!res.ok) {
//     alert('Failed to delete movie.');
//     return;
//   }

//   alert('Movie deleted successfully!');
//   fetchMovies();
// }

// document.getElementById('movie-form').addEventListener('submit', async (e) => {
//   e.preventDefault();

//   if (userRole !== 'admin') {
//     alert('Only admins can add movies.');
//     return;
//   }

//   const title = document.getElementById('title').value;
//   const isbn = document.getElementById('isbn').value;
//   const genre = document.getElementById('genre').value;
//   const year = parseInt(document.getElementById('year').value);
//   const firstname = document.getElementById('firstname').value;
//   const lastname = document.getElementById('lastname').value;

//   const res = await fetch('http://localhost:8000/api/movies', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     },
//     body: JSON.stringify({ title, isbn, genre, year, director: { firstname, lastname } })
//   });

//   if (!res.ok) {
//     alert('Failed to add movie.');
//     return;
//   }

//   alert('Movie added successfully!');
//   e.target.reset();
//   fetchMovies();
// });

// async function login() {
//   const user = document.getElementById('login-username').value;
//   const pass = document.getElementById('login-password').value;

//   const res = await fetch('http://localhost:8000/api/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ username: user, password: pass })
//   });

//   if (!res.ok) {
//     alert('Login failed.');
//     return;
//   }

//   const data = await res.json();
//   token = data.token;
//   userRole = data.role;

//   localStorage.setItem('token', token);
//   localStorage.setItem('role', userRole);

//   alert(`Logged in as: ${userRole}`);
//   document.getElementById('auth-modal').style.display = 'none';
//   fetchMovies();
// }

// async function signup() {
//   const user = document.getElementById('signup-username').value;
//   const pass = document.getElementById('signup-password').value;

//   const res = await fetch('http://localhost:8000/api/signup', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ username: user, password: pass })
//   });

//   if (!res.ok) {
//     alert('Signup failed.');
//     return;
//   }

//   alert('Signup successful. Please login.');
//   document.getElementById('auth-modal').style.display = 'none';
// }

// fetchMovies();




// function toggleModal() {
//   document.getElementById('auth-modal').style.display = 'flex';
// }

// window.onclick = function (event) {
//   if (event.target.classList.contains('modal')) {
//     document.getElementById('auth-modal').style.display = 'none';
//   }
// }

// function switchTab(tab) {
//   document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
//   document.getElementById('signup-form').style.display = tab === 'signup' ? 'block' : 'none';
//   document.getElementById('login-tab').classList.toggle('active', tab === 'login');
//   document.getElementById('signup-tab').classList.toggle('active', tab === 'signup');
// }

// async function fetchMovies() {
//   const search = document.getElementById('search').value.trim();

//   const res = await fetch(`http://localhost:8000/api/movies${search ? '?search=' + encodeURIComponent(search) : ''}`);
  
//   if (!res.ok) {
//     Swal.fire({
//       icon: 'error',
//       title: 'Oops...',
//       text: 'Failed to fetch movies.',
//     });
//     return;
//   }

//   const movies = await res.json();

//   const list = document.getElementById('movieList');
//   list.innerHTML = '';

//   if (movies.length === 0) {
//     Swal.fire({
//       icon: 'info',
//       title: 'No Movies Found',
//       text: 'Try searching with a different title.',
//     });
//     return;
//   }

//   movies.forEach(m => {
//     const card = document.createElement('div');
//     card.className = 'card';
//     card.innerHTML = `
//       <h3>${m.title}</h3>
//       <p><strong>Genre:</strong> ${m.genre || 'N/A'}</p>
//       <p><strong>Year:</strong> ${m.year || 'N/A'}</p>
//       <p><strong>ISBN:</strong> ${m.isbn}</p>
//       <p><strong>Director:</strong> ${m.director?.firstname || ''} ${m.director?.lastname || ''}</p>
//       <div class="actions">
//         <button onclick="deleteMovie('${m.id}')">Delete</button>
//       </div>
//     `;
//     list.appendChild(card);
//   });
// }


// async function deleteMovie(id) {
//   if (!confirm("Are you sure you want to delete this movie?")) return;

//   const res = await fetch(`http://localhost:8000/api/movies/${id}`, { method: 'DELETE' });
//   if (!res.ok) {
//     alert('Failed to delete movie.');
//     return;
//   }

//   alert('Movie deleted successfully!');
//   fetchMovies();
// }

// document.getElementById('movie-form').addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const title = document.getElementById('title').value;
//   const isbn = document.getElementById('isbn').value;
//   const genre = document.getElementById('genre').value;
//   const year = parseInt(document.getElementById('year').value);
//   const firstname = document.getElementById('firstname').value;
//   const lastname = document.getElementById('lastname').value;

//   const res = await fetch('http://localhost:8000/api/movies', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ title, isbn, genre, year, director: { firstname, lastname } })
//   });

//   if (!res.ok) {
//     alert('Failed to add movie.');
//     return;
//   }

//   alert('Movie added successfully!');
//   e.target.reset();
//   fetchMovies();
// });

// function login() {
//   const user = document.getElementById('login-username').value;
//   const pass = document.getElementById('login-password').value;
//   alert(`(Stub) Logged in as: ${user}`);
//   document.getElementById('auth-modal').style.display = 'none';
// }

// function signup() {
//   const user = document.getElementById('signup-username').value;
//   const pass = document.getElementById('signup-password').value;
//   alert(`(Stub) Signed up as: ${user}`);
//   document.getElementById('auth-modal').style.display = 'none';
// }

// fetchMovies();
