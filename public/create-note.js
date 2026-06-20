const form = document.getElementById("noteForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const title =
        document.getElementById("title").value;

    const content =
        document.getElementById("content").value;

    const token =
        localStorage.getItem("accessToken");

    const response = await fetch(
        "/api/auth/create-note",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                title,
                content
            })
        }
    );

    const data = await response.json();

    if(response.ok){

        document.getElementById("status").innerHTML =
        `
        <div class="alert alert-success">
            Note Created Successfully
        </div>
        `;

        form.reset();
    }
    else{

        document.getElementById("status").innerHTML =
        `
        <div class="alert alert-danger">
            ${data.message}
        </div>
        `;
    }

});