const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}

async function loadDashboard() {

    const res = await fetch("http://localhost:5000/api/dashboard/stats", {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const data = await res.json();

    document.getElementById("stats").innerHTML = `
        <h3>Estadísticas</h3>
        <p>Alumnos: ${data.data.totalAlumnos}</p>
        <p>Materias: ${data.data.totalMaterias}</p>
        <p>Relaciones: ${data.data.totalRelaciones}</p>
    `;
}

async function loadAlumnos() {

    const res = await fetch("http://localhost:5000/api/alumnosConMaterias");

    const data = await res.json();

    document.getElementById("alumnos").innerHTML = `
        <h3>Alumnos</h3>
        ${data.data.map(a => `
            <div style="background:#334155; padding:10px; margin:5px; border-radius:8px;">
                <b>${a.nombre} ${a.apellido}</b><br>
                Edad: ${a.edad}<br>
                Materias: ${a.materias || "Sin materias"}
            </div>
        `).join("")}
    `;
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}