const apiUrl = "http://localhost:5678/api/works"

const fetchWorks = async ()=>{
    const works = await fetch(apiUrl)
    return works.json()
    
}

const replaceData = async ()=>{
    const data = await fetchWorks()
    const divToReplace = document.querySelector(".gallery")
    divToReplace.innerHTML= ""
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

replaceData()


