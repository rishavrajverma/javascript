let localStorageData =
  JSON.parse(localStorage.getItem("jobApplications")) || [];
let editIndex = null;

//take all required DOM elements
const companyName = document.getElementById("company");
const role = document.getElementById("role");
const jobType = document.getElementById("jobType");
const locationAddresh = document.getElementById("location");
const locationLabel = document.getElementById("locationLabel");
const statusSelection = document.getElementById("status");
const erorCompany = document.getElementById("erorCompany");
const erorJobRole = document.getElementById("erorJobRole");
const erorJobType = document.getElementById("erorJobType");
const erorLocation = document.getElementById("erorLocation");
const erorJobStatus = document.getElementById("erorJobStatus");
const form = document.getElementById("applicationForm");
const submit = document.getElementById("submitBtn");
const tableList = document.getElementById("List");
const statusCounts = document.getElementById("statusCounts");
const clearBtn = document.getElementById("clearBtn");

//implement show and hide condition based on jobtype selection
jobType.addEventListener("change", () => {
  let isRemote = jobType.value === "Remote";
  locationAddresh.disabled = isRemote;
  locationAddresh.style.display = isRemote ? "none" : "block";
  locationLabel.style.display = isRemote ? "none" : "block";
  erorLocation.style.display = isRemote ? "none" : "block";
  jobType.value !== ""
    ? ((erorJobType.style.display = "none"), (jobType.style.borderColor = ""))
    : (erorJobType.style.display = "block");
});

//change application status validation handle
statusSelection.addEventListener("change", () => {
  statusSelection.value !== ""
    ? ((erorJobStatus.style.display = "none"),
      (statusSelection.style.borderColor = ""))
    : (erorJobStatus.style.display = "block");
});
//add current date
document.getElementById("date").value = new Date().toISOString().split("T")[0];

//check validation
function validation() {
  let isValid = true;

  companyName.value.trim() === ""
    ? ((companyName.style.borderColor = "red"),
      (erorCompany.style.display = "block"),
      (isValid = false))
    : ((companyName.style.borderColor = ""),
      (erorCompany.style.display = "none"));

  role.value.trim() === ""
    ? ((role.style.borderColor = "red"),
      (erorJobRole.style.display = "block"),
      (isValid = false))
    : ((erorJobRole.style.display = "none"), (role.style.borderColor = ""));

  jobType.value.trim() === ""
    ? ((jobType.style.borderColor = "red"),
      (erorJobType.style.display = "block"),
      (isValid = false))
    : ((erorJobType.style.display = "none"), (jobType.style.borderColor = ""));

  jobType.value !== "Remote" && locationAddresh.value.trim() === ""
    ? ((locationAddresh.style.borderColor = "red"),
      (erorLocation.style.display = "block"),
      (isValid = false))
    : ((erorLocation.style.display = "none"),
      (locationAddresh.style.borderColor = ""));

  statusSelection.value.trim() === ""
    ? ((statusSelection.style.borderColor = "red"),
      (erorJobStatus.style.display = "block"),
      (isValid = false))
    : ((erorJobStatus.style.display = "none"),
      (statusSelection.style.borderColor = ""));

  return isValid;
}
//form submition process on submit event based on edit/new form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  //validation function
  if (!validation()) {
    return;
  }
  //collect all form data
  const formData = {
    name: document.getElementById("company").value,
    role: document.getElementById("role").value,
    jobType: jobType.value,
    location:
      jobType.value === "Remote" ? "-----------" : locationAddresh.value,
    date: document.getElementById("date").value,
    status: document.getElementById("status").value,
    notes: document.getElementById("notes").value,
  };
  //check edit mood or new form data
  if (editIndex !== null) {
    localStorageData[editIndex] = formData;
    editIndex = null;
    submit.textContent = "Add Application";
  } else {
    localStorageData.push(formData);
  }
  //set final data after stringify
  localStorage.setItem("jobApplications", JSON.stringify(localStorageData));
  form.reset();
  //change condition for locationAddresh
  locationAddresh.style.display = "block";
  locationAddresh.disabled = false;
  locationLabel.style.display = "block";
  showForm();
});

//show table
function showForm(filteredData = null) {
  let data = filteredData || localStorageData;
  const counts = { Applied: 0, Interviewing: 0, Hired: 0, Rejected: 0 };
  //remove other elements befor attaching any table rows
  tableList.innerHTML = "";

  data.forEach((element, index) => {
    counts[element.status] = (counts[element.status] || 0) + 1;

    const row = document.createElement("tr");
    row.style.maxHeight = "2px";
    row.innerHTML = `
    <td >${index + 1}.</td>
    <td >${element.name}</td>
    <td >${element.role}</td>
    <td >${element.jobType}</td>
    <td >${element.location}</td>
    <td >${element.date}</td>
    <td class='text-${
      { element }.element.status == "Hired"
        ? "success"
        : { element }.element.status == "Rejected"
        ? "danger"
        : null
    }'>${element.status}</td>
    <td class="w-25">${element.notes}</td>
    <td class="text-end">
       <button class="btn btn-sm btn-warning py-0" onclick="editApplication(${index})">Edit</button>
       <button class="btn btn-sm btn-danger py-0" onclick="deleteApplication(${index})">Delete</button>
      </td>
    `;
    tableList.appendChild(row);
  });
  const total = localStorageData.length;
  statusCounts.innerHTML = `<div>Job Application : ${total} | Applied: ${counts.Applied} | Interviewing : ${counts.Interviewing} | Hired : <span class='text-success fw-bold'>${counts.Hired}</span> | Rejected: <span class='text-danger fw-bold'>${counts.Rejected}</span></div>`;
  if (total === 0) {
    tableList.innerHTML =
      "<tr><td colspan='9' class='text-center py-4'><h3>No application found !</h3><p>Add new appliction</p></td></tr>";
  }
}

// if (filtered.length === 0 || undefined) {
//   tableList.innerHTML = '<h3 class="text-center py-2">No records !</h3>';
// }

//search
document.getElementById("searchInput").addEventListener("input", (e) => {
  const search = e.target.value.toLowerCase().trim();
  const filtered = localStorageData.filter((element) => {
    return (
      element.name.toLowerCase().includes(search) ||
      element.role.toLowerCase().includes(search) ||
      element.status.toLowerCase().includes(search)
    );
  });
  showForm(filtered);

  //add condition for no result found in given lists or undefined
  if (filtered.length === 0 && localStorageData.length > 0) {
    tableList.innerHTML =
      '<tr><td colspan=9 ><h3 class="text-center py-2">No search result found !</h3></tr></td>';
  }
});

//clear btn for search
clearBtn.addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  showForm();
});

//Edit form
function editApplication(index) {
  const formData = localStorageData[index];
  //destructure all fields and set to forms
  document.getElementById("company").value = formData.name;
  document.getElementById("role").value = formData.role;
  jobType.value = formData.jobType;
  //dispatch change event for setting hide/show of location
  jobType.dispatchEvent(new Event("change"));
  locationAddresh.value =
    formData.location == "-----------" ? "" : formData.location;
  document.getElementById("date").value = formData.date;
  document.getElementById("status").value = formData.status;
  document.getElementById("notes").value = formData.notes;
  erorLocation.style.display = "none";

  submit.textContent = "Update Application";
  editIndex = index;
}

//Delete form
function deleteApplication(index) {
  if (confirm("Are you sure want to delete ?")) {
    localStorageData.splice(index, 1);
    localStorage.setItem("jobApplications", JSON.stringify(localStorageData));
    showForm();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  showForm();
});
