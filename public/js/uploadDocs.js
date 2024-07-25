const uploadForm = document.getElementById('uploadForm');

uploadForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the form from submitting

  const uid = document.getElementById('uid').value;
  const formData = new FormData(uploadForm);

  formData.append('uid', uid);

  // File type validation
  const docsFile = formData.get('docs');
  if (docsFile && !docsFile.type.startsWith('application/')) {
    alert('Please upload valid document files (PDF, DOCX, TXT).');
    return; // Prevent submission
  }

  const profileFile = formData.get('profile');
  if (profileFile && !profileFile.type.startsWith('image/')) {
    alert('Please upload a valid image file for the profile.');
    return; // Prevent submission
  }

  const productFile = formData.get('product');
  if (productFile && !productFile.type.startsWith('image/')) {
    alert('Please upload a valid image file for the product.');
    return; // Prevent submission
  }

  // You might need to add a progress bar or indicator here
  alert('Uploading documents...');

  fetch('/api/users/' + uid +'/documents', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (response.ok) {
      // Handle successful upload
      alert('Documents uploaded successfully!');
      // Redirect to the appropriate page
      window.location.href = '/login'; // Replace with your desired redirect
    } else {
      // Handle error
      response.json().then(data => {
        alert(data.message);
      });
    }
  })
  .catch(error => {
    console.error('Error uploading documents:', error);
    alert('An error occurred while uploading documents.');
  });
});
