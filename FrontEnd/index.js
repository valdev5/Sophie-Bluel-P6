const baseUrl = "http://localhost:5678/api/";
const workUrl = `${baseUrl}works`;

const fetchWorks = async () => {
  const response = await fetch(workUrl);
  return response.json();
};

const fetchCategories = async () => {
  const response = await fetch(`${baseUrl}categories`);
  return response.json();
};

const renderWorks = (data, category) => {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  const filteredData = category ? data.filter(work => work.category.name === category) : data;
  filteredData.forEach(({ title, imageUrl }) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = title;
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
};

const replaceWorks = async (category) => {
  const data = await fetchWorks();
  renderWorks(data, category);
};

const changeCategories = async () => {
  const categories = await fetchCategories();
  const sortBtnDiv = document.querySelector(".sort-btn");
  const allButton = document.querySelector("#btn-all");
  
  allButton.addEventListener("click", () => replaceWorks());

  categories.forEach(({ name }) => {
    const btn = document.createElement("button");
    btn.id = `btn-${name}`;
    btn.textContent = name;
    btn.addEventListener("click", () => replaceWorks(name));
    sortBtnDiv.appendChild(btn);
  });
};

const handleAuth = () => {
  const token = localStorage.getItem("token");
  const loginBtn = document.querySelector("#login-btn");
  const sortBtnDiv = document.querySelector(".sort-btn");
  const topBar = document.getElementById("top-bar");
  const modif = document.getElementById("update-works");

  if (token) {
    sortBtnDiv.style.display = "none";
    loginBtn.textContent = "logout";
    loginBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      location.reload();
    });
  } else {
    topBar.style.display = "none";
    modif.style.display = "none";
  }
};

const handleModalWorks = async () => {
  const response = await fetch(workUrl);
  if (response.ok) {
    const data = await response.json();
    const modalContent = document.querySelector('#modal-works .modal-content');
    modalContent.innerHTML = '';
    
    data.forEach(work => {
      const { id, imageUrl, title, categoryId } = work;
      const figure = document.createElement('figure');
      figure.classList.add('work-item', `category-id-${categoryId}`);
      figure.id = `work-item-popup-${id}`;
      
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = title;
      figure.appendChild(img);

      const figcaption = document.createElement('figcaption');
      figcaption.textContent = 'éditer';
      figure.appendChild(figcaption);

      const crossDragDrop = document.createElement('i');
      crossDragDrop.classList.add('fa-solid', 'fa-arrows-up-down-left-right', 'cross');
      figure.appendChild(crossDragDrop);

      const trashIcon = document.createElement('i');
      trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash');
      figure.appendChild(trashIcon);

      trashIcon.addEventListener('click', async (event) => {
        event.preventDefault();
        if (confirm("Voulez-vous supprimer cet élément ?")) {
          const deleteResponse = await fetch(`${workUrl}/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          });

          if (deleteResponse.ok) {
            document.getElementById(`work-item-${id}`).remove();
            document.getElementById(`work-item-popup-${id}`).remove();
          } else {
            alert("Erreur lors de la suppression.");
          }
        }
      });

      modalContent.appendChild(figure);
    });

    const modal = document.getElementById('modal');
    modal.style.display = "flex";
    document.getElementById('modal-works').style.display = "block";
  } else {
    console.error("Erreur de chargement des travaux");
  }
};

const setupModalEventListeners = () => {
  document.getElementById('update-works').addEventListener('click', (event) => {
    event.preventDefault();
    handleModalWorks();
  });

  document.querySelectorAll('#modal-works, #modal-edit').forEach(modal => {
    modal.addEventListener('click', event => event.stopPropagation());
  });

  document.getElementById('modal').addEventListener('click', (event) => {
    event.preventDefault();
    const modal = document.getElementById('modal');
    modal.style.display = "none";
    document.getElementById('modal-works').style.display = "none";
    document.getElementById('modal-edit').style.display = "none";
  });

  document.getElementById('button-to-close-first-window').addEventListener('click', (event) => {
    event.preventDefault();
    const modal = document.getElementById('modal');
    modal.style.display = "none";
    document.getElementById('modal-works').style.display = "none";
  });

  document.getElementById('button-to-close-second-window').addEventListener('click', (event) => {
    event.preventDefault();
    const modal = document.getElementById('modal');
    modal.style.display = "none";
    document.getElementById('modal-edit').style.display = "none";
  });

  document.getElementById('modal-edit-add').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('modal-works').style.display = "none";
    document.getElementById('modal-edit').style.display = "block";
  });

  document.getElementById('arrow-return').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('modal-works').style.display = "block";
    document.getElementById('modal-edit').style.display = "none";
  });
};

const handleImageUpload = () => {
  document.getElementById('form-image').addEventListener('change', () => {
    const fileInput = document.getElementById('form-image');
    const maxFileSize = 4 * 1024 * 1024; // 4MB

    if (fileInput.files[0].size > maxFileSize) {
      alert("Le fichier sélectionné est trop volumineux. La taille maximale est de 4 Mo.");
      fileInput.value = '';
    } else {
      const imagePreview = document.createElement('img');
      imagePreview.id = 'form-image-preview';
      imagePreview.src = URL.createObjectURL(fileInput.files[0]);
      const modalEditPhoto = document.querySelector('#modal-edit-new-photo');
      modalEditPhoto.appendChild(imagePreview);

      document.getElementById('photo-add-icon').style.display = "none";
      document.getElementById('new-image').style.display = "none";
      document.getElementById('photo-size').style.display = "none";
      modalEditPhoto.style.padding = "0";
    }
  });
};

const handleFormSubmission = () => {
  document.getElementById('modal-edit-work-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('form-title').value);
    formData.append('category', document.getElementById('form-category').value);
    formData.append('image', document.getElementById('form-image').files[0]);
    const test = document.getElementById('form-category').value;
    const response = await fetch(workUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: formData
    });

    if (response.ok) {
      replaceWorks();
      const modal = document.getElementById('modal');
      modal.style.display = "none";
      document.getElementById('modal-edit').style.display = "none";
      document.getElementById('modal-edit-work-form').reset();
    } else {
      alert("Erreur lors de l'ajout du projet.");
    }
  });
};
const setupModalSelect = async () => {
  const categories = await fetchCategories();
  const select = document.getElementById('form-category');
  categories.forEach((category) => {
    const { name, id } = category;
    const option = document.createElement('option');
    option.value = id;
    option.textContent = name;
    select.appendChild(option);
  });
}
const initialize = async () => {
  replaceWorks();
  setupModalSelect();
  changeCategories();
  handleAuth();
  setupModalEventListeners();
  handleImageUpload();
  handleFormSubmission();
};

initialize();
