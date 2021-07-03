const taskContainer = document.querySelector(".task__container");


let globalStore = [];


const generateNewCard = ({ id, imageURL, taskType, taskTitle, taskDescription }) => `
<div class="col-md-6 col-lg-4" id=${id} >

<div class="card ">
    <div class="card-header d-flex justify-content-end gap-2">
        <button type="button" id=${id} class="btn btn-outline-success " onclick="editCard.apply(this, arguments)"><i class="fas fa-pencil-alt" id=${id} onclick="editCard.apply(this, arguments)"></i></button>


        <button type="button" class="btn btn-outline-danger" id=${id} onclick="deleteCard.apply(this, arguments)"><i class="fas fa-dumpster-fire" id=${id} onclick="deleteCard.apply(this, arguments)"></i></button>
    </div>

    <img src=${imageURL} class="card-img-top" alt="..."/>
    <div class="card-body">
        <h5 class="card-title">${taskTitle}</h5>
        <p class="card-text">${taskDescription}</p>
        
        <a href="#" class="btn btn-primary">${taskType}</a>
    </div>
    <div class="card-footer text-muted ">
        <button type="button" id=${id} class="btn btn-outline-primary float-end">Open Task</button>
    </div>
</div>
</div>
`;


const loadInitialCardData = () => {
    //localstorage to get tasky card data
    const getCardData = localStorage.getItem("tasky");
    if (!getCardData) return;
    //convert from string to normal object
    const { cards } = JSON.parse(getCardData);

    //loop over those array of task object to create HTML card
    cards.map((cardObject) => {


        // inject it to DOM
        taskContainer.insertAdjacentHTML("beforeend", generateNewCard(cardObject));

        //update our global store
        globalStore.push(cardObject);
    });

};

const updateLocalStorage = () =>
    localStorage.setItem("tasky", JSON.stringify({ cards: globalStore })); //an object




const saveChanges = () => {
    const taskData = {
        id: `${Date.now()}`, //unique number for id
        imageURL: document.getElementById("imageURL").value,
        taskTitle: document.getElementById("tasktitle").value,
        taskType: document.getElementById("tasktype").value,
        taskDescription: document.getElementById("taskdescription").value,
    };


    taskContainer.insertAdjacentHTML("beforeend", generateNewCard(taskData));

    //storing our data inside local storage
    globalStore.push(taskData);

    updateLocalStorage();


};


const deleteCard = (event) => {
    //id
    event = window.event;

    const targetID = event.target.id;
    const tagname = event.target.tagName;
    //match element id in global storage
    //if match found delete it

    globalStore = globalStore.filter((cardObject) => cardObject.id !== targetID);
    //on refreshing deleted items will not reappear again
    updateLocalStorage();

    //contact parent

    if (tagname === "BUTTON") {
        return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode);
    } else {
        return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
    }
};

const editCard = (event) => {
    event = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;

    let parentElement;

    if (tagname === "BUTTON") {
        parentElement = event.target.parentNode.parentNode;
    } else {
        parentElement = event.target.parentNode.parentNode.parentNode;
    }

    let taskTitle = parentElement.childNodes[5].childNodes[1];
    let taskDescription = parentElement.childNodes[5].childNodes[3];
    let taskType = parentElement.childNodes[5].childNodes[5];
    let submitButton = parentElement.childNodes[7].childNodes[1];


    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    submitButton.setAttribute("onclick", "saveEditChanges.apply(this,arguments)");
    submitButton.innerHTML = "Save Changes";


};

const saveEditChanges = (event) => {
    event = window.event;
    const targetID = event.target.id;
    console.log(targetID);
    const tagname = event.target.tagName;

    let parentElement;

    if (tagname === "BUTTON") {
        parentElement = event.target.parentNode.parentNode;
    } else {
        parentElement = event.target.parentNode.parentNode.parentNode;
    }

    let taskTitle = parentElement.childNodes[5].childNodes[1];
    let taskDescription = parentElement.childNodes[5].childNodes[3];
    let taskType = parentElement.childNodes[5].childNodes[5];
    let submitButton = parentElement.childNodes[7].childNodes[1];

    const updatedData = {
        taskTitle: taskTitle.innerHTML,
        taskType: taskType.innerHTML,
        taskDescription: taskDescription.innerHTML,

    };

    globalStore = globalStore.map((task) => {
        if (task.id === targetID) {

            return {
                id: task.id,
                imageURL: task.imageURL,
                taskTitle: updatedData.taskTitle,
                taskType: updatedData.taskType,
                taskDescription: updatedData.taskDescription,
            };
        }
        return task;
    });
    //console.log({ updatedData });
    updateLocalStorage();
    //console.log(globalStore);
    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
    submitButton.removeAttribute("onclick");
    submitButton.innerHTML = "Open Task";
};