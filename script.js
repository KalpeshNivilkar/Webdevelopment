// Define currentPage based on window location
const currentPage = window.location.pathname.split("/").pop();

function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}

function setLoggedInUser(user) {
  localStorage.setItem("loggedInUser", JSON.stringify(user));
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "log-in.html";
}

const signUpForm = document.getElementById("signUpForm");
if (signUpForm) {
  signUpForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    const user = {
      fullName,
      email,
      phone,
      password,
    };

    setLoggedInUser(user);

    const formHistory = JSON.parse(localStorage.getItem("formHistory")) || [];
    formHistory.push({
      fullName,
      email,
      phone,
      institutionType: "",
      purpose: "",
      description: "",
      userEmail: email,
    });
    localStorage.setItem("formHistory", JSON.stringify(formHistory));

    window.location.href = "index.html";
  });
}


const createForm = document.getElementById("createForm");
if (createForm) {
  createForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
      alert("Please log in to submit a form.");
      window.location.href = "log-in.html";
      return;
    }

    const institutionType = document.getElementById("institutionType")?.value || "";
    const purposeSelect = document.getElementById("purposeSelect");
    const purpose = purposeSelect ? purposeSelect.value : "";
    const description = document.getElementById("description")?.value || "";

    // Collect dynamic purpose fields values from visible purpose-entry div
    const dynamicEntries = {};
    const purposeFieldsDivs = document.querySelectorAll(".purpose-entry");
    purposeFieldsDivs.forEach(div => {
      if (div.style.display !== "none") {
        const inputs = div.querySelectorAll("input, select, textarea");
        inputs.forEach(input => {
          if (input.name) {
            dynamicEntries[input.name] = input.value;
          }
        });
      }
    });

    const formHistory = JSON.parse(localStorage.getItem("formHistory")) || [];
    formHistory.push({
      fullName: loggedInUser.fullName,
      email: loggedInUser.email,
      phone: loggedInUser.phone,
      institutionType,
      purpose,
      description,
      dynamicEntries,
      userEmail: loggedInUser.email,
    });
    localStorage.setItem("formHistory", JSON.stringify(formHistory));

    alert("Form submitted successfully.");
    createForm.reset();
    window.location.href = "form-history.html";
  });
}

// Dynamic purpose details logic
const purposeSelect = document.getElementById("purposeSelect");
const purposeFieldsDiv = document.getElementById("purposeFields");

if (purposeSelect && purposeFieldsDiv) {
  purposeSelect.addEventListener("change", function () {
    const selectedPurpose = this.value;

    const purposeFieldsDivs = document.querySelectorAll(".purpose-entry");
    purposeFieldsDivs.forEach((div) => {
      div.style.display = "none";
    });

    const selectedDiv = document.getElementById(`${selectedPurpose}Fields`);
    if (selectedDiv) {
      selectedDiv.style.display = "block";
    }
  });
}

if (currentPage === "form-history.html") {
  function createDetailsCell(data) {
    let details = "";

    // Include dynamicEntries if present
    if (data.dynamicEntries) {
      for (const key in data.dynamicEntries) {
        details += `<strong>${key}:</strong> ${data.dynamicEntries[key]}<br>`;
      }
    }

    for (const key in data) {
      if (
        ![
          "fullName",
          "email",
          "phone",
          "institutionType",
          "purpose",
          "description",
          "userEmail",
          "dynamicEntries"
        ].includes(key)
      ) {
        details += `<strong>${key}:</strong> ${data[key]}<br>`;
      }
    }
    return details || "N/A";
  }

  function loadFormHistory() {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
      alert("Please log in to view form history.");
      window.location.href = "log-in.html";
      return;
    }

    const formHistory = JSON.parse(localStorage.getItem("formHistory")) || [];
    const tbody = document.querySelector("#formHistoryTable tbody");
    tbody.innerHTML = "";

    const userForms = formHistory.filter(
      (entry) => entry.userEmail.toLowerCase() === loggedInUser.email.toLowerCase()
    );

    if (userForms.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center">No form submissions found.</td></tr>`;
      return;
    }

    userForms.forEach((entry, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${entry.fullName}</td>
        <td>${entry.email}</td>
        <td>${entry.phone}</td>
        <td>${entry.institutionType}</td>
        <td>${entry.purpose}</td>
        <td>${entry.description}</td>
        <td>${createDetailsCell(entry)}</td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteFormEntry(${index})">Delete</button></td>
      `;
      tbody.appendChild(row);
    });
  }

  window.deleteFormEntry = function (index) {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
      alert("Please log in to delete form entries.");
      window.location.href = "log-in.html";
      return;
    }

    let formHistory = JSON.parse(localStorage.getItem("formHistory")) || [];

    const userForms = formHistory.filter(
      (entry) => entry.userEmail.toLowerCase() === loggedInUser.email.toLowerCase()
    );

    userForms.splice(index, 1);

    const otherUsersForms = formHistory.filter(
      (entry) => entry.userEmail.toLowerCase() !== loggedInUser.email.toLowerCase()
    );

    const updatedFormHistory = otherUsersForms.concat(userForms);
    localStorage.setItem("formHistory", JSON.stringify(updatedFormHistory));
    loadFormHistory();
  };

  // ❗ FIX: Direct call instead of nested DOMContentLoaded
  loadFormHistory();
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function (event) {
    event.preventDefault();
    logout();
  });
}
