import {
  db,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  auth,
  setDoc,
  Timestamp,
  deleteDoc,
  onSnapshot,
  updateDoc,
  query,
} from "./firebaseConfig.js";

// create task

const createTaks = async (e) => {
  e.preventDefault();

  
  let title = document.getElementById("task-title").value;
  let description = document.getElementById("task-desc").value;
  let assign = document.getElementById("task-assign").value;
  console.log(title, description, assign);

  try {
    const tasksCollection = collection(db, "tasks");

    // Add task to Firestore
    await addDoc(tasksCollection, {
      title,
      description,
      assign,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    });

    // On successful addition
    Swal.fire({
      title: "Task submitted",
      icon: "success",
      confirmButtonText: "OK",
    });

    document.getElementById("task-form").reset();
    window.location.href = "/index.html"; // redirection
  } catch (error) {
    console.error("Error adding task: ", error);
    alert("not Logged in ");
  }
};

document.getElementById("task-form")?.addEventListener("submit", createTaks);













// ----------------------------- fetch data ------------------------------//
let taskContainer = document.getElementById("task-container");
let dotSpinner = document.querySelector('.dot-spinner');
function showLoader() {
  dotSpinner.style.visibility = 'visible';
}

function hideLoader() {
  dotSpinner.style.visibility = 'hidden';
}

let fetchTask = async () => {
  showLoader();  
  try {
    const tasksQuery = query(collection(db, "tasks"));

    onSnapshot(tasksQuery, (querySnapshot) => {
      taskContainer.innerHTML = "";

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const taskData = doc.data();
          const taskId = doc.id;

          const taskCard = document.createElement("div");
          taskCard.classList.add("task-card");
          taskCard.setAttribute("data-id", taskId);

          // Set initial status color based on status
          let statusColorClass = getStatusColor(taskData.status);

          taskCard.innerHTML = `
            <div class="task-card-header">
              <h3 class="task-title">${taskData.title}</h3>

              <!-- Status dropdown -->
              <div class="status-dropdown">
                <button class="status-btn ${statusColorClass}">${taskData.status || "Status"}</button>
                <div class="status-menu">
                  <div class="status-option" data-status="To Do">To Do</div>
                  <div class="status-option" data-status="Progress">Pending</div>
                  <div class="status-option" data-status="Done">Done</div>
                </div>
              </div>

            </div>
            <div class="task-card-body">
              <p><strong>Description:</strong> ${taskData.description}</p>
            </div>
            <div class="task-card-footer">
              <button class="btn-edit btn btn-sm btn-warning">Edit</button>
              <button class="btn-delete btn btn-sm btn-danger">Delete</button>
            </div>
          `;

          // Edit/Delete
          taskCard.querySelector('.btn-edit')?.addEventListener('click', () => editTask(taskId));
          taskCard.querySelector('.btn-delete')?.addEventListener('click', () => deleteTask(taskId));

          // Status dropdown click
          const statusBtn = taskCard.querySelector('.status-btn');
          const statusMenu = taskCard.querySelector('.status-menu');

          statusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            statusMenu.classList.toggle('show');
          });

          // Select option
          statusMenu.querySelectorAll('.status-option').forEach(option => {
            option.addEventListener('click', async () => {
              const selectedStatus = option.getAttribute('data-status');
              await updateTaskStatus(taskId, selectedStatus);

              // Update UI without reloading
              statusBtn.textContent = selectedStatus;
              statusBtn.className = `status-btn ${getStatusColor(selectedStatus)}`;

              statusMenu.classList.remove('show');
            });
          });

          document.addEventListener('click', () => {
            statusMenu.classList.remove('show');
          });

          taskContainer.appendChild(taskCard);
        });
      } else {
        console.log("No tasks found!");
      }
      hideLoader();
    });
  } catch (error) {
    console.log('fetch nhi hua', error);
    hideLoader(); // important
  }
};

fetchTask();
function getStatusColor(status) {
  switch (status) {
    case "To Do":
      return "status-todo"; // blue
    case "Progress":
      return "status-pending"; // yellow
    case "Done":
      return "status-done"; // green
    default:
      return "status-default"; // gray
  }
}

// ///------------------------------edit----------------------------------/
async function editTask(taskId) {
  const ref = doc(db, "tasks", taskId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    console.error("No such task!", id);
    alert('you are not logged in  , please login first')
    return;
  }
  const t = snap.data();

  document.getElementById("edit-task-id").value = taskId;
  document.getElementById("edit-task-title").value = t.title;
  document.getElementById("edit-task-status").value = t.status;
  document.getElementById("edit-task-description").value = t.description;

  new bootstrap.Modal(document.getElementById("editTaskModal")).show();
}
window.editTask = editTask;
document
  ?.getElementById("editTaskForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const taskId = document.getElementById("edit-task-id").value;

    const title = document.getElementById("edit-task-title").value;
    const status = document.getElementById("edit-task-status").value;
    const description = document.getElementById("edit-task-description").value;

    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { title, status, description });

      // modal close
      bootstrap.Modal.getInstance(
        document.getElementById("editTaskModal")
      ).hide();
    } catch (err) {
      console.error("Error updating task:", err);
      
      
    }
  });

// ------- delete task --------//
async function deleteTask(taskId) {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
    console.log("Task deleted:", taskId);
  } catch (err) {
    console.error("Delete failed:", err);
  }
}
