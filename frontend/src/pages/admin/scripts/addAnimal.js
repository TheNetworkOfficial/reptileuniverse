document
  .getElementById('add-animal-form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1) Grab each field by its ID:
    const name = document.getElementById('animal-name').value;
    const species = document.getElementById('animal-species').value;
    const age = document.getElementById('animal-age').value;
    // …etc for each text field…

    // 2) Grab the <input type="file" multiple> element:
    const imagesInput = document.getElementById('animal-images');

    // 3) Build a FormData object:
    const formData = new FormData();
    formData.append('name', name);
    formData.append('species', species);
    formData.append('age', age);
    // Append any other text fields similarly…
    // e.g. formData.append('location', locationValue);

    // 4) Now append each selected file (if any):
    for (const file of imagesInput.files) {
      // “images” must match the name= attribute on the <input>.
      // If multiple files are allowed, multer (in the backend) will see req.files as an array.
      formData.append('images', file);
    }

    // 5) Send the request to your POST /api/reptiles route:
    try {
      const res = await fetch('/api/reptiles', {
        method: 'POST',
        body: formData,
        // do NOT set Content-Type manually; the browser will set
        // “multipart/form-data; boundary=----WebKitFormBoundary…”
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Unknown error');
      }

      const newReptile = await res.json();
      // Do whatever you want on success (e.g. close popup, refresh list, etc.)
      console.log('Created reptile:', newReptile);
    } catch (err) {
      console.error('Failed to create reptile:', err);
    }
});