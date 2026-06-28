const token =
    localStorage.getItem("accessToken");



async function logout(){

    const response = await fetch(
        "/api/auth/logout",
        {
            method: "GET",
            credentials: "include"
        }
    );

    const data = await response.json();

    if(response.ok){

        localStorage.removeItem("accessToken");

        alert(data.message);

        window.location.href = "/register.html";
    }
}

async function logoutAll(){

    const response = await fetch(
        "/api/auth/logout-all",
        {
            method: "GET",
            credentials: "include"
        }
    );

    const data = await response.json();

    if(response.ok){

        localStorage.removeItem("accessToken");

        alert(data.message);

        window.location.href = "/register.html";
    }
}

getProfile();