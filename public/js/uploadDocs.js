const uploadForm = document.getElementById('uploadForm');
const uploadStatus = document.getElementById('uploadStatus');

uploadForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const uid = document.getElementById('uid').value;
  const formData = new FormData(uploadForm);

  // Add the uid to the FormData object
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

  // Display upload status
  uploadStatus.textContent = 'Uploading documents...';

  fetch('/api/users/' + uid + '/documents', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (response.ok) {
      // Handle successful upload
      uploadStatus.textContent = 'Documents uploaded successfully!';
      // Redirect to the appropriate page
      window.location.href = '/userProfile';
    } else {
      // Handle error
      response.json().then(data => {
        uploadStatus.textContent = data.message;
      });
    }
  })
  .catch(error => {
    console.error('Error uploading documents:', error);
    uploadStatus.textContent = 'An error occurred while uploading documents.';
  });
});
