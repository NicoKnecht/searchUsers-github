const searchInput = document.querySelector('#userNameInput');
searchButton = document.querySelector('#searchButton');
userImg = document.querySelector('#userImg');
userNickname = document.querySelector('#userNickname');
userRealname = document.querySelector('#userRealname');
userLocation = document.querySelector('#userLocation');
userpublicRepos = document.querySelector('#userPublicRepos');
userFollowers = document.querySelector('#userFollowers');





const searchUser = async () => {
    let username = searchInput.value;// si no fuse un .value, podria poner la var dentro de async directamente como parametro
    try {
        const url = `https://api.github.com/users/${username}`;
        const response = await fetch(url);// dentro del fech se podria poner un parametro objeto con method"get" etc
        const data = await response.json();

        console.log(data);//para ver el objeto que trae la response
        console.log(response);// para extraer errores http

        if (response.status == 200) {
            showUser(data);

        }
        else if (response.status == 404) {
            showNotFound(data);
        }
    } catch (err) { // typeError
        alert("Algo salio mal : \n" + err);
    }
}

const showUser = (data) => {
    document.querySelector(".userImg").style.display = "inline-block"// cambio display de img

    userNickname.innerText = data.login;// el objeto data es el que tre los datos y, de ahi, extraigo porpiedades con la data
    userRealname.innerText = data.name;
    userLocation.innerText = data.location;
    userpublicRepos.innerText = data.public_repos;
    userFollowers.innerText = data.followers;

    userImg.src = data.avatar_url; // modifico el atributo src
    searchInput.value = ""; // reseteamos input

}
const showNotFound = (data) => {
    userNickname.innerText = "No encontrado";
    document.querySelector(".userImg").style.display = "none";
    userRealname.innerText = "";
    userLocation.innerText = "";
    userpublicRepos.innerText = "";
    userFollowers.innerText = "";

}

const searchUserEnter = (event) => {

    if (event.keyCode == 13) {
        searchUser();
    }
}

searchButton.addEventListener("click", searchUser);
searchInput.addEventListener("keydown", searchUserEnter);
