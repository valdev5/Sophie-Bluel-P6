const baseUrl = "http://localhost:5678/api/"
const fetchWorks = async ()=>{
    const works = await fetch(baseUrl + "works")
    return works.json()
    
}

const replaceWorks = async (category)=>{
    let data = await fetchWorks()
    const divToReplace = document.querySelector(".gallery")
    divToReplace.innerHTML= ""
    if (category) {
            data = data.filter(el=>el.category.name === category)  
    }
    data.forEach(element => {
        const title = element.title
        const source = element.imageUrl
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        image.src = source;
        image.alt = title;
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = title;
        figure.appendChild(image);
        figure.appendChild(figcaption);
        divToReplace.appendChild(figure);
        
    });
}



const fetchCategories = async ()=>{
    const categories = await fetch(baseUrl + "categories")
    return categories.json()
    
}
const changeCategories = async ()=>{
    const data = await fetchCategories()
    const divToReplace = document.querySelector(".sort-btn")
    const allButton = document.querySelector("#btn-all")
    allButton.addEventListener ("click",()=>{
        replaceWorks()
    })
    data.forEach(element => {
        const name = element.name
        const btn = document.createElement("button")
        btn.id =`btn-${name}`
        btn.textContent = name
        divToReplace.appendChild(btn);
        btn.addEventListener ("click", (e)=>{
            console.log(e)
            replaceWorks(name)
            
        })
        
    });
}

changeCategories()


if (localStorage.getItem("token")){
   const loginBtn = document.querySelector ("#login-btn")
   loginBtn.textContent = "logout"
   loginBtn.addEventListener("click",()=>{
    localStorage.removeItem ("token")
   })
}



