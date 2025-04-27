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
} from './firebaseConfig.js';



// create task


const createTaks = async (e)=>{
    e.preventDefault()
    let title = document.getElementById('task-title').value;
    let description = document.getElementById('task-desc').value;
    let assign = document.getElementById('task-assign').value;
    console.log(title,description,assign);
    
    try {
        // Reference to 'tasks' collection
        const tasksCollection = collection(db, "tasks");

        // Add task to Firestore
        await addDoc(tasksCollection, {
            title,
            description,
            assign,
            createdAt: new Date()  // Adding timestamp
        });

        // On successful addition
        alert("Task added successfully!");
        document.getElementById('task-form').reset();
    } catch (error) {
        // Catch any errors and log them
        console.error("Error adding task: ", error);
        alert("Error adding task. Please try again.");
    }



}

document.getElementById('task-form')?.addEventListener('submit',createTaks)



document.addEventListener('DOMContentLoaded', function() {
    const taskContainer = document.getElementById('task-container');
    if (!taskContainer) {
        console.error("taskContainer not found!");
        return;
    }
  
    try {
      const tasksQuery = query(collection(db, "tasks"));
      onSnapshot(tasksQuery, (querySnapshot) => {
        taskContainer.innerHTML = ""; // fresh kar do
  
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const taskData = doc.data();
            const taskId = doc.id;
  
            const taskCard = document.createElement("div");
            taskCard.classList.add("task-card");
            taskCard.setAttribute("data-id", taskId);
  
            taskCard.innerHTML = `
              <h3>${taskData.title}</h3>
              <p>${taskData.description}</p>
            `;
  
            taskContainer.appendChild(taskCard);
          });
        } else {
          console.log("No tasks found!");
        }
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  });
  
  