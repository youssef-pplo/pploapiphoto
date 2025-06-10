# Image Processing API

This project is a web service that allows for the uploading and resizing of images through a RESTful API.

---

## How to Run

1.  Install dependencies: `npm install`
2.  Build the project from TypeScript to JavaScript: `npm run build`
3.  Start the server: `npm start`

The server will be running at `http://localhost:3000`.

---

## Available API Endpoints

Your API is available under the base path `/api`.

### 1. List Available Images

Returns a list of all image filenames that can be resized.

* **URL:** `/api/images`
* **Method:** `GET`
* **Success Response:**
    * **Code:** 200 OK
    * **Content:** `["fjord.jpg", "santamonica.jpg", "newly-uploaded.jpg"]`

### 2. Upload a New Image

Uploads a new image file to be used for resizing.

* **URL:** `/api/images/upload`
* **Method:** `POST`
* **Body:** `multipart/form-data` with a field named `image` that contains the image file.
* **Success Response:**
    * **Code:** 200 OK
    * **Content:** `{ "message": "Image uploaded successfully!", "filename": "new-image.jpg" }`

### 3. Resize an Image

Takes an existing image and resizes it to the specified dimensions. This endpoint returns the image file directly.

* **URL:** `/api/images/resize`
* **Method:** `GET`
* **Query Parameters:**
    * `filename` (string, **required**): The name of the image to resize.
    * `width` (number, **required**): The desired width in pixels.
    * `height` (number, **required**): The desired height in pixels.
* **Success Response:**
    * **Code:** 200 OK
    * **Content:** The resized image data (e.g., `image/jpeg`).
* **Example URL:** `/api/images/resize?filename=fjord.jpg&width=200&height=200`