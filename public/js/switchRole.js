const switchRoleForm = document.getElementById('switchRoleForm');

switchRoleForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const uid = document.getElementById('uid').value;

  fetch('/api/users/premium/' + uid, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ uid: uid })
  })
    .then(response => {
        if (response.ok) {
            alert('Role switched successfully!');
            window.location.href = '/userProfile'; 
        } else {
            response.json().then(data => {
                alert(data.message);
            });
        }
    })
    .catch(error => {
        console.error('Error switching role:', error);
        alert('An error occurred while switching role.');
    });
});