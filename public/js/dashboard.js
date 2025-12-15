document.addEventListener("DOMContentLoaded", () => {
  const addToolBtn = document.getElementById("addToolBtn");
  const table = document.getElementById("equipmentTable");

  addToolBtn.addEventListener("click", () => {
    const name = prompt("Masukkan nama alat:");
    if (name) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${name}</td>
        <td>
          <button class="edit">Edit</button>
          <button class="delete">Hapus</button>
        </td>
      `;
      table.appendChild(row);
    }
  });

  table.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
      e.target.closest("tr").remove();
    } else if (e.target.classList.contains("edit")) {
      const td = e.target.closest("tr").querySelector("td");
      const newName = prompt("Edit nama alat:", td.textContent);
      if (newName) td.textContent = newName;
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const paketBox = document.querySelector(".paket-add-box");

  paketBox.addEventListener("click", () => {
    alert("Tambahkan paket langganan baru!");
  });

  const form = document.getElementById("gymForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Data gym baru berhasil dikirim!");
  });
});

