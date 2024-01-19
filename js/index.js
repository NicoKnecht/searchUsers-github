const searchInput = document.querySelector('#userNameInput');
const searchButton = document.querySelector('#searchButton');
const userImg = document.querySelector('#userImg');
const userNickname = document.querySelector('#userNickname');
const userRealname = document.querySelector('#userRealname');
const userLocation = document.querySelector('#userLocation');
const userpublicRepos = document.querySelector('#userPublicRepos');
const userFollowers = document.querySelector('#userFollowers');



// Función para validar el nombre de usuario con expresiones regulares.
const isValidUsername = (username) => {
    // Utiliza una expresión regular para validar el nombre de usuario.
    const regex = /^[a-zA-Z0-9_-]{1,39}$/;
    return regex.test(username);
};



// Función para buscar usuarios similares y obtener sugerencias.
const searchSimilarUsers = async (query) => {
    try {
        const searchUrl = `https://api.github.com/search/users?q=${query}`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (searchResponse.status === 200) {
            // Devuelve un array de objetos con nombre de usuario y enlace al perfil.
            return searchData.items.map((item) => ({
                username: item.login,
                profileUrl: item.html_url,
            }));
        } else {
            // Si hay algún error en la búsqueda, devuelve un array vacío.
            return [];
        }
    } catch (err) {
        // Maneja errores durante la búsqueda de usuarios similares.
        console.error("Error al buscar usuarios similares:", err);
        return [];
    }
};

// Función para mostrar sugerencias de usuarios similares.
const showSimilarUsers = (similarUsers) => {
    const suggestionsList = document.querySelector("#suggestionsList");
    suggestionsList.innerHTML = "Resultados similares:";

    // Mostrar sugerencias en la interfaz de usuario.
    similarUsers.forEach((user) => {
        const suggestionItem = document.createElement("li");
        suggestionItem.innerHTML = ` <a href="${user.profileUrl}" target="_blank">${user.username}</a>`;
        suggestionsList.appendChild(suggestionItem);
    });

    // Mostrar la lista de sugerencias.
    suggestionsList.style.display = "block";
};



const showUser = (data) => {
    document.querySelector(".userImg").style.display = "inline-block"// cambio display de img

    userNickname.innerText = data.login;// el objeto data es el que tre los datos y, de ahi, extraigo porpiedades con la data
    userRealname.innerText = data.name;
    userLocation.innerText = data.location;
    userpublicRepos.textContent = data.public_repos;
    userFollowers.textContent = data.followers;

    userImg.src = data.avatar_url; // modifico el atributo src
    searchInput.value = ""; // reseteamos input

}
const showNotFound = (data) => {
    userNickname.textContent = "No encontrado";
    document.querySelector(".userImg").style.display = "none";
    userRealname.textContent = "";
    userLocation.textContent = "";
    userpublicRepos.textContent = "";
    userFollowers.textContent = "";

}

// Función principal 
const searchUser = async () => {
    let username = searchInput.value.trim();// si no fuse un .value, podria poner la var dentro de async directamente como parametro
    suggestionsList.style.display = "none";
    // Valida el formato del nombre de usuario.
    if (!isValidUsername(username)) {
        alert("Nombre de usuario no válido. Por favor, ingrese un nombre de usuario válido.");
        return;
    }

    try {
        const url = `https://api.github.com/users/${username}`;
        const response = await fetch(url);// dentro del fech se podria poner un parametro objeto con method"get" etc
        const data = await response.json();

        console.log(data);//para ver el objeto que trae la response
        console.log(response);// para extraer errores http

        //respuesta según el código de estado HTTP
        if (response.status == 200) {
            showUser(data);

            // Búsqueda de usuarios similares y sugerencias.
            const similarUsers = await searchSimilarUsers(username);
            console.log("Usuarios similares:", similarUsers);
            // Muestra sugerencias de usuarios similares en la interfaz.
            showSimilarUsers(similarUsers);

        }
        else if (response.status == 404) {
            showNotFound(data);

            // Búsqueda de usuarios similares y sugerencias.
            const similarUsers = await searchSimilarUsers(username);
            console.log("Usuarios similares:", similarUsers);
            // Muestra sugerencias de usuarios similares en la interfaz.
            showSimilarUsers(similarUsers);
        }

    } catch (err) { // typeError
        alert("Algo salio mal : \n" + err);
    }
}




const init = () => {
    searchButton.addEventListener("click", searchUser);
    searchInput.addEventListener("keydown", (event) => {
        if (event.keyCode === 13) {
            searchUser();
        }
    });
};

init();