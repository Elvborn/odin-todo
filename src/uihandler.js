// DOM Elements
const createProjectBtn = document.querySelector(".create-project");
createProjectBtn.addEventListener("click", () => {
    displayProjectDialog();
});


function updateSide(msg, projectList){
    const ulProjectList = document.querySelector("#project-list");
    ulProjectList.innerHTML = "";

    createProjectContent(ulProjectList, projectList);
}

function updateContent(msg, project){
    const content = document.querySelector("#content");
    content.innerHTML = "";

    createDescriptionContent(project);
    createTodoContent(project);
}

function createProjectContent(parentElement, projectList){
    projectList.forEach(project => {
        const projectListItem = document.createElement("li");

        projectListItem.addEventListener("click", (event) => {
            if(event.target.className === "selected") return;

            PubSub.publish("PROJECT-SELECTED", project);
            console.log(`Project selected: ${project.name}`);
        });

        const projectTitleElement = document.createElement("h3");
        projectTitleElement.textContent = project.name;

        if(project.selected)
            projectListItem.className = "selected";

        projectListItem.append(projectTitleElement);
        parentElement.append(projectListItem);
    });
}

function createDescriptionContent(project){
    const detailsContainer = document.createElement("div");
    detailsContainer.id = "project-details";
    content.append(detailsContainer);

    const detailsTitle = document.createElement("h2");
    detailsTitle.className = "content-title";
    detailsTitle.textContent = project.name;
    detailsContainer.append(detailsTitle);

    const detailsEditBtn = document.createElement("button");
    detailsEditBtn.className = "edit-button";
    detailsEditBtn.textContent = "Edit Project";
    detailsContainer.append(detailsEditBtn);

    const detailsNewBtn = document.createElement("button");
    detailsNewBtn.className = "new-button";
    detailsNewBtn.textContent = "New Todo";
    detailsContainer.append(detailsNewBtn);
    detailsNewBtn.addEventListener("click", () => {
        displayTodoDialog();
    });

    if(project.description != undefined && project.description.length > 0){
        const detailsDescriptionContainer= document.createElement("div");
        detailsDescriptionContainer.className = "item-container";
        detailsDescriptionContainer.textContent = project.description;
        detailsContainer.append(detailsDescriptionContainer);
    }
}

function createTodoContent(project){
    project.todoList.forEach(todo => {
        const todoContainer = document.createElement("div");
        todoContainer.className = "todo";
        content.append(todoContainer);

        const todoTitle = document.createElement("h2");
        todoTitle.className = "content-title";
        todoTitle.textContent = todo.name;
        todoContainer.append(todoTitle);

        const todoNewBtn = document.createElement("button");
        todoNewBtn.className = "new-button";
        todoNewBtn.textContent = "Add Item";
        todoNewBtn.addEventListener("click", () => {
            displayItemDialog(todo);
        });
        todoContainer.append(todoNewBtn);

        todo.todoItems.forEach((item, i) => {
            const itemContainer = document.createElement("div");
            itemContainer.classList.add("item-container");
            if(item.priority != undefined && item.priority > 0)
                itemContainer.classList.add(`priority${item.priority}`);
            todoContainer.append(itemContainer);
            
            const itemCB = document.createElement("input");
            itemCB.type = "checkbox";
            itemCB.id = `checkbox_${i}`;
            itemCB.name = `checkbox_${i}`;
            itemCB.checked = item.isChecked;
            itemCB.addEventListener("change", () => {
                PubSub.publish("ITEM-CHECKBOX-CHANGED", item);
            });
            itemContainer.append(itemCB);

            const itemName = document.createElement("label");
            itemName.textContent = item.name;
            itemName.setAttribute("for", `checkbox_${i}`);
            itemContainer.append(itemName);

            const rightItems = document.createElement("div");
            itemContainer.append(rightItems);

            const dueDate = document.createElement("p");
            dueDate.className = "due-date";
            dueDate.textContent = item.getDateAsString() === null ? "" : `Due: ${item.getDateAsString()}`;
            rightItems.append(dueDate);

            const itemEditBtn = document.createElement("button");
            itemEditBtn.className = "edit-button";
            itemEditBtn.textContent = "Edit";
            rightItems.append(itemEditBtn);
        });
    });
}

function displayProjectDialog(){
    const dialog = document.querySelector("#project-dialog");
    const form = document.querySelector("#project-form");
    const submitBtn = document.querySelector("#project-submit");

    dialog.showModal();

    form.addEventListener("submit", (event) => {
        submitBtn.click();
    });

    submitBtn.addEventListener("click", () => {
        const formData = Object.fromEntries(new FormData(form));
        if(formData.projectName.length === 0) return;
        
        PubSub.publish("CREATE-PROJECT", {
            name: formData.projectName,
            description: formData.projectDescription
        });

        form.reset();
        dialog.close();
    });
}

function displayTodoDialog(){
    const dialog = document.querySelector("#todo-dialog");
    const form = document.querySelector("#todo-form");
    const submitBtn = document.querySelector("#todo-submit");

    dialog.showModal();

    form.addEventListener("submit", (event) => {
        submitBtn.click();
    });

    submitBtn.addEventListener("click", () => {
        const formData = Object.fromEntries(new FormData(form));
        if(formData.todoName.length === 0) return;
        
        PubSub.publish("CREATE-TODO", formData.todoName);

        form.reset();
        dialog.close();
    });
}

function displayItemDialog(todo){
    const dialog = document.querySelector("#item-dialog");
    const form = document.querySelector("#item-form");
    const submitBtn = document.querySelector("#item-submit");

    dialog.showModal();

    form.addEventListener("submit", (event) => {
        submitBtn.click();
    });

    submitBtn.addEventListener("click", () => {
        const formData = Object.fromEntries(new FormData(form));

        let date = isNaN(new Date(formData.itemDate)) ? null : new Date(formData.itemDate);

        const formValid = (
            formData.itemName.length !== 0 &&
            formData.itemPriority !== undefined
        );

        if(!formValid) return;

        console.log(date);
        
        PubSub.publish("CREATE-TODO-ITEM", {
            todo,
            name: formData.itemName,
            date,
            priority: Number(formData.itemPriority)
        });

        form.reset();
        dialog.close();
    });
}

// Events
PubSub.subscribe("UPDATE-SIDE", updateSide);
PubSub.subscribe("UPDATE-CONTENT", updateContent);