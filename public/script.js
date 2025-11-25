async function carEnter() {
    const car_number = document.getElementById("carNumber").value;
    if (!car_number) return alert("Регистрээ оруулна уу!");

    const res = await fetch("/car-enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ car_number })
    });
    const data = await res.json();
    alert(`Машин бүртгэгдлээ. Log ID: ${data.log_id}`);
    loadParking();
}

async function carLeave() {
    const log_id = document.getElementById("logId").value;
    const amount = document.getElementById("amount").value;
    if (!log_id || !amount) return alert("Log ID болон төлбөр оруулна уу!");

    const res = await fetch("/car-leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log_id, amount })
    });
    const data = await res.json();
    alert(`Машин гарлаа. Төлбөр: ${data.payment.amount}`);
    loadParking();
}

async function loadParking() {
    const res = await fetch("/parking-list");
    const data = await res.json();
    const tbody = document.querySelector("#parkingTable tbody");
    tbody.innerHTML = "";
    data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.log_id}</td>
            <td>${row.car_number}</td>
            <td>${row.car_enter_time ? new Date(row.car_enter_time).toLocaleString() : ''}</td>
            <td>${row.car_leave_time ? new Date(row.car_leave_time).toLocaleString() : ''}</td>
        `;
        tbody.appendChild(tr);
    });
}

window.onload = loadParking;
