// Script for create-form.html

document.addEventListener("DOMContentLoaded", function () {
  const purposeSelect = document.getElementById("purposeSelect");
  const purposeFields = document.getElementById("purposeFields");

  purposeSelect.addEventListener("change", function () {
    const value = this.value;
    purposeFields.innerHTML = ""; // Clear previous

    if (value === "admission") {
      purposeFields.innerHTML = `
        <div class="mb-3">
          <label class="form-label" for="courseDepartment">Course/Department</label>
          <input type="text" class="form-control" id="courseDepartment" placeholder="e.g. Computer Science" />
        </div>
        <div class="mb-3">
          <label class="form-label" for="yearAdmission">Year of Admission</label>
          <input type="number" class="form-control" id="yearAdmission" placeholder="e.g. 2025" />
        </div>`;
    } else if (value === "facility") {
      purposeFields.innerHTML = `
        <div class="mb-3">
          <label class="form-label" for="facilityType">Facility Type</label>
          <input type="text" class="form-control" id="facilityType" placeholder="e.g. Library Room, Lab, Hall" />
        </div>
        <div class="mb-3">
          <label class="form-label" for="requiredDate">Required Date</label>
          <input type="date" class="form-control" id="requiredDate" />
        </div>`;
    } else if (value === "feedback") {
      purposeFields.innerHTML = `
        <div class="mb-3">
          <label class="form-label" for="feedbackType">Feedback Type</label>
          <select class="form-select" id="feedbackType">
            <option>Complaint</option>
            <option>Suggestion</option>
            <option>Appreciation</option>
          </select>
        </div>`;
    } else if (value === "appointment") {
      purposeFields.innerHTML = `
        <div class="mb-3">
          <label class="form-label" for="departmentDoctor">Department / Doctor / Teacher</label>
          <input type="text" class="form-control" id="departmentDoctor" placeholder="e.g. Dr. Sharma or Admin Dept." />
        </div>
        <div class="mb-3">
          <label class="form-label" for="preferredDate">Preferred Date</label>
          <input type="date" class="form-control" id="preferredDate" />
        </div>`;
    } else if (value === "resource") {
      purposeFields.innerHTML = `
        <div class="mb-3">
          <label class="form-label" for="resourceName">Resource Name</label>
          <input type="text" class="form-control" id="resourceName" placeholder="e.g. Projector, Book, Equipment" />
        </div>
        <div class="mb-3">
          <label class="form-label" for="quantity">Quantity</label>
          <input type="number" class="form-control" id="quantity" placeholder="e.g. 2" />
        </div>`;
    } else if (value === "other") {
      purposeFields.innerHTML = `
        <div class="mb-3">
          <label class="form-label" for="otherSpecify">Please Specify</label>
          <input type="text" class="form-control" id="otherSpecify" placeholder="Mention your specific request" />
        </div>`;
    }
  });

  // Handle form submission
  document.getElementById("institutionForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Gather form data
    const formData = {
      fullName: document.getElementById("fullName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      institutionType: document.getElementById("institutionType").value,
      purpose: document.getElementById("purposeSelect").value,
      description: document.getElementById("description").value,
    };

    // Add dynamic fields based on purpose
    switch (formData.purpose) {
      case "admission":
        formData.courseDepartment = document.getElementById("courseDepartment")?.value || "";
        formData.yearAdmission = document.getElementById("yearAdmission")?.value || "";
        break;
      case "facility":
        formData.facilityType = document.getElementById("facilityType")?.value || "";
        formData.requiredDate = document.getElementById("requiredDate")?.value || "";
        break;
      case "feedback":
        formData.feedbackType = document.getElementById("feedbackType")?.value || "";
        break;
      case "appointment":
        formData.departmentDoctor = document.getElementById("departmentDoctor")?.value || "";
        formData.preferredDate = document.getElementById("preferredDate")?.value || "";
        break;
      case "resource":
        formData.resourceName = document.getElementById("resourceName")?.value || "";
        formData.quantity = document.getElementById("quantity")?.value || "";
        break;
      case "other":
        formData.otherSpecify = document.getElementById("otherSpecify")?.value || "";
        break;
    }

    // Retrieve existing form data array from localStorage or initialize
    let formHistory = JSON.parse(localStorage.getItem("formHistory")) || [];

    // Add new form data to array
    formHistory.push(formData);

    // Save updated array back to localStorage
    localStorage.setItem("formHistory", JSON.stringify(formHistory));

    // Optionally, clear the form or show a success message
    alert("Form submitted and saved to history!");
    this.reset();
    purposeFields.innerHTML = "";
  });
});

// Script for form-history.html

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
      ].includes(key)
    ) {
      details += `<strong>${key}:</strong> ${data[key]}<br>`;
    }
  }
  return details || "N/A";
}

function loadFormHistory() {
  const formHistory = JSON.parse(localStorage.getItem("formHistory")) || [];
  const tbody = document.querySelector("#formHistoryTable tbody");
  tbody.innerHTML = "";

  if (formHistory.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center">No form submissions found.</td></tr>`;
    return;
  }

  formHistory.forEach((entry) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.fullName}</td>
      <td>${entry.email}</td>
      <td>${entry.phone}</td>
      <td>${entry.institutionType}</td>
      <td>${entry.purpose}</td>
      <td>${entry.description}</td>
      <td>${createDetailsCell(entry)}</td>
    `;
    tbody.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", loadFormHistory);
