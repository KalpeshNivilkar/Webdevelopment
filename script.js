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
    const purpose = document.getElementById("purpose")?.value || "";
    const description = document.getElementById("description")?.value || "";

    const formHistory = JSON.parse(localStorage.getItem("formHistory")) || [];
    formHistory.push({
      fullName: loggedInUser.fullName,
      email: loggedInUser.email,
      phone: loggedInUser.phone,
      institutionType,
      purpose,
      description,
      userEmail: loggedInUser.email,
    });
    localStorage.setItem("formHistory", JSON.stringify(formHistory));

    alert("Form submitted successfully.");
    createForm.reset();
    window.location.href = "form-history.html";
  });
}

if (currentPage === "form-history.html") {
  function createDetailsCell(data) {
    let details = "";
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

const logoutLink = document.getElementById("logoutLink");
if (logoutLink) {
  logoutLink.addEventListener("click", function (event) {
    event.preventDefault();
    logout();
  });
}
