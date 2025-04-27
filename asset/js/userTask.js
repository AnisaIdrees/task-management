import {
  db,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  Timestamp,
  deleteDoc,
  onSnapshot,updateDoc,
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
    // Reference to 'tasks' collection
    const tasksCollection = collection(db, "tasks");

    // Add task to Firestore
    await addDoc(tasksCollection, {
      title,
      description,
      assign,
      createdAt: new Date(), // Adding timestamp
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
    // Catch any errors and log them
    console.error("Error adding task: ", error);
    alert("Error adding task. Please try again.");
  }
};

document.getElementById("task-form")?.addEventListener("submit", createTaks);



// ----------------------------- fetch data ------------------------------//
let taskContainer = document.getElementById('task-container');

let fetchTask = async ()=>{

  try {
    
    const tasksQuery = query(
      collection(db, "tasks"),
    );
    onSnapshot(tasksQuery, (querySnapshot) => {
      taskContainer.innerHTML = "";
      // if (isFirstTimeLoad) {
      //   taskContainer.innerHTML = "";
      // }
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const taskData = doc.data();
          const taskId = doc.id;
          console.log("Number of blog posts fetched:");


          const taskCard = document.createElement("div");
          taskCard.classList.add("task-card");
          taskCard.setAttribute("data-id", doc.id); // Store the document ID to avoid duplicates

          taskCard.innerHTML = `
             
      <div class="task-card">
        <div class="task-card-header">
            <h3 class="task-title">${taskData.title}</h3>
            <p class="task-status">Status</p>
        </div>
        <div class="task-card-body">
            <p><strong>Description:</strong> ${taskData.description}</p>
        </div>
        <div class="task-card-footer">
         <button class="btn-edit btn btn-sm btn-warning">Edit</button>
        <button class="btn-delete">Delete</button>
        </div>
    </div>
              
            `;

            taskCard.querySelector('.btn-edit')
            ?.addEventListener('click', () => editTask(taskId));

            taskCard.querySelector('.btn-delete')
            .addEventListener('click', () => deleteTask(taskId));

          taskContainer.appendChild(taskCard);
        });
      } else {
        console.log("No blog posts found!");
      }
    })
  } catch (error) {
    console.log('fetch nhi hua ',error);
    
  }


}
fetchTask()

// ///------------------------------edit----------------------------------/
async function editTask(taskId) {
  // 1) Document reference banao
  const ref = doc(db, "tasks", taskId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    console.error("No such task!", id);
    return;
  }
  const t = snap.data();

  // 2) Modal fields fill karo
  document.getElementById('edit-task-id').value          = taskId;
  document.getElementById('edit-task-title').value       = t.title;
  document.getElementById('edit-task-status').value      = t.status;
  document.getElementById('edit-task-description').value = t.description;

  // 3) Modal dikhao
  new bootstrap.Modal(document.getElementById('editTaskModal')).show();
}
window.editTask = editTask;
document.getElementById('editTaskForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // 1) Hidden field se correct ID le lo
  const taskId = document.getElementById('edit-task-id').value;

  // 2) Baaki form values lo
  const title       = document.getElementById('edit-task-title').value;
  const status      = document.getElementById('edit-task-status').value;
  const description = document.getElementById('edit-task-description').value;

  try {
    // 3) Firestore document reference isi taskId se banao
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { title, status, description });

    // 4) Modal band karo
    bootstrap.Modal.getInstance(
      document.getElementById('editTaskModal')
    ).hide();
  } catch (err) {
    console.error("Error updating task:", err);
  }
});


// ------- delete task --------//
async function deleteTask(taskId) {
  // SweetAlert se confirm karo
  const confirmDelete = await Swal.fire({
    title: 'Kya aap sure hain?',
    text: "Ye task permanently delete ho jayega!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#bc5dcf',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Haan, delete karo',
    cancelButtonText: 'Nahi, cancel karo'
  });

  if (confirmDelete.isConfirmed) {
    try {
      // Firestore se task delete karna
      await deleteDoc(doc(db, "tasks", taskId));
      Swal.fire('Deleted!', 'Task successfully delete ho gaya.', 'success');
    } catch (err) {
      Swal.fire('Error!', 'Task delete nahi ho saka.', 'error');
    }
  }
}

// Ye function delete button ke saath call ho sakta hai
