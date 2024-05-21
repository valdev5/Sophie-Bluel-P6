const apiUrl = "http://localhost:5678/api/categories"

const fetchCategories = async ()=>{
    const categories = await fetch(apiUrl)
    return categories.json()
    
}
const replaceData = async ()=>{
    const data = await fetchCategories()
    const divToReplace = document.querySelector(".sort-btn")
    data.forEach(element => {
        const name = element.name
        const btn = document.createElement("button")
        btn.id =`btn-${name}`
        btn.textContent = name
        divToReplace.appendChild(btn);
        
    });
}

replaceData()