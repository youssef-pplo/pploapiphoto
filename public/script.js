window.onload = function () {
  fetchImages(); // Fetch images when the page loads
};

let selectedImage = '';

// Fetch images and display them in the gallery
function fetchImages() {
  fetch('/api/images')
    .then((response) => response.json())
    .then((images) => {
      const gallery = document.getElementById('image-gallery');
      gallery.innerHTML = ''; // Clear any existing images in the gallery

      images.forEach((image) => {
        const imgElement = document.createElement('img');
        imgElement.src = `/images/${image}`; // For original images
        // Correct image path
        imgElement.alt = image;
        imgElement.width = 100; // Thumbnail size
        imgElement.classList.add('thumbnail');

        imgElement.addEventListener('click', () => {
          selectImageForResize(image, imgElement); // Select image for resizing
        });

        gallery.appendChild(imgElement); // Add the image to the gallery
      });
    })
    .catch((error) => console.error('Error fetching images:', error));
}

// Store selected image for resizing
function selectImageForResize(image, imgElement) {
  selectedImage = image; // Set the selected image
  console.log(`Selected Image: ${image}`);

  // Optionally, highlight the selected image for user feedback
  const gallery = document.getElementById('image-gallery');
  const images = gallery.querySelectorAll('.thumbnail');
  images.forEach((img) => img.classList.remove('selected')); // Remove selection from other images
  imgElement.classList.add('selected'); // Add 'selected' class to the clicked image
}

// Resize the selected image
document.getElementById('resize-button').addEventListener('click', function () {
  const width = document.getElementById('width').value;
  const height = document.getElementById('height').value;

  if (selectedImage && width && height) {
    fetch(
      `/api/images/resize?image=${selectedImage}&width=${width}&height=${height}`
    )
      .then((response) => response.blob()) // Expecting the image blob in the response
      .then((blob) => {
        // Create a URL from the blob and append the resized image to the page
        const resizedImageUrl = URL.createObjectURL(blob);
        const imgElement = document.createElement('img');
        imgElement.src = resizedImageUrl; // Set the resized image URL
        imgElement.alt = selectedImage;
        imgElement.width = 100; // Display resized image with thumbnail size
        document.body.appendChild(imgElement); // Append the image to the body
      })
      .catch((error) => console.error('Error resizing image:', error));
  } else {
    alert('Please select an image and specify width and height.');
  }
});

// Image upload functionality
// Resize the selected image
document.getElementById('resize-button').addEventListener('click', function () {
  const width = document.getElementById('width').value;
  const height = document.getElementById('height').value;

  if (selectedImage && width && height) {
    fetch(
      `/api/images/resize?image=${selectedImage}&width=${width}&height=${height}`
    )
      .then((response) => response.json()) // Expecting the resized image URL in the response
      .then((data) => {
        const resizedImageUrl = data.resizedImageUrl; // Get the resized image URL
        const imgElement = document.createElement('img');
        imgElement.src = resizedImageUrl; // Set the resized image URL
        imgElement.alt = selectedImage;
        imgElement.width = 100; // Display resized image with thumbnail size
        document.body.appendChild(imgElement); // Append the image to the body
      })
      .catch((error) => console.error('Error resizing image:', error));
  } else {
    alert('Please select an image and specify width and height.');
  }
});
