import {
  db,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  Timestamp,
  deleteDoc,
  onSnapshot,
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
            <button class="btn-edit">Edit</button>
            <button class="btn-delete">Delete</button>
        </div>
    </div>
              
            `;

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