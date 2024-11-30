// DOM Elements
const createProjectBtn = document.querySelector(".create-project");
createProjectBtn.addEventListener("click", () => {
    displayProjectDialog();
});

const resetBtn = document.querySelector(".reset");
resetBtn.addEventListener("click", () => {
    PubSub.publish("RESET");
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
            console.log("First:");
            console.log(todo.name);

            displayItemDialog(todo);
        });
        todoContainer.append(todoNewBtn);

        // Todo items
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
            dueDate.textContent = item.getDateAsString() === null ? "" : item.getDateAsString();
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
    dialog.innerHTML = "";

    const form = document.createElement("form");
    form.id = "project-form";
    form.method = "dialog"
    dialog.append(form);

    const legend = document.createElement("legend");
    legend.textContent = "Create Project";
    form.append(legend);

    // Name
    const nameContainer = document.createElement("div");
    form.append(nameContainer);

    const nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "project-name");
    nameLabel.textContent = "Project Name";
    nameContainer.append(nameLabel);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "projectName";
    nameInput.id = "project-name";
    nameInput.placeholder = "Required";
    nameInput.required = true;
    nameContainer.append(nameInput); 

    // Description
    const descriptionContainer = document.createElement("div");
    form.append(descriptionContainer);

    const descriptionLabel = document.createElement("label");
    descriptionLabel.setAttribute("for", "project-description");
    descriptionLabel.textContent = "Description";
    descriptionContainer.append(descriptionLabel);

    const descriptionInput = document.createElement("textarea");
    descriptionInput.name = "projectDescription";
    descriptionInput.id = "project-description";
    descriptionInput.rows = 3;
    descriptionContainer.append(descriptionInput); 

    // Buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "buttons";
    form.append(buttonContainer);

    const returnBtn = document.createElement("button");
    returnBtn.className = "delete-button";
    returnBtn.formNoValidate = true;
    returnBtn.textContent = "Cancel";
    buttonContainer.append(returnBtn);

    const submitBtn = document.createElement("button");
    submitBtn.id = "item-submit";
    submitBtn.className = "new-button";
    submitBtn.type = "submit";
    submitBtn.textContent = "Create";
    buttonContainer.append(submitBtn);

    // Event listeners
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

    dialog.showModal();
}

function displayTodoDialog(){
    const dialog = document.querySelector("#todo-dialog");
    dialog.innerHTML = "";

    const form = document.createElement("form");
    form.id = "todo-form";
    form.method = "dialog"
    dialog.append(form);

    const legend = document.createElement("legend");
    legend.textContent = "Create Todo";
    form.append(legend);

    // Name
    const nameContainer = document.createElement("div");
    form.append(nameContainer);

    const nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "todo-name");
    nameLabel.textContent = "Todo Name";
    nameContainer.append(nameLabel);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "todoName";
    nameInput.id = "todo-name";
    nameInput.placeholder = "Required";
    nameInput.required = true;
    nameContainer.append(nameInput); 

    // Buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "buttons";
    form.append(buttonContainer);

    const returnBtn = document.createElement("button");
    returnBtn.className = "delete-button";
    returnBtn.formNoValidate = true;
    returnBtn.textContent = "Cancel";
    buttonContainer.append(returnBtn);

    const submitBtn = document.createElement("button");
    submitBtn.id = "item-submit";
    submitBtn.className = "new-button";
    submitBtn.type = "submit";
    submitBtn.textContent = "Create";
    buttonContainer.append(submitBtn);

    // Event listeners
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

    dialog.showModal();
}

function displayItemDialog(todo){
    const dialog = document.querySelector("#item-dialog");
    dialog.innerHTML = "";

    const form = document.createElement("form");
    form.method = "dialog";
    form.id = "item-form";
    dialog.append(form);

    const legend = document.createElement("legend");
    legend.textContent = "Create Todo Item";
    form.append(legend);

    // Name
    const nameContainer = document.createElement("div");
    form.append(nameContainer);

    const nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "item-name");
    nameLabel.textContent = "Item Name";
    nameContainer.append(nameLabel);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "itemName";
    nameInput.id = "item-name";
    nameInput.placeholder = "Required";
    nameInput.required = true;
    nameContainer.append(nameInput);

    // Due date
    const dateContainer = document.createElement("div");
    form.append(dateContainer);

    const dateLabel = document.createElement("label");
    dateLabel.setAttribute("for", "item-date");
    dateLabel.textContent = "Due date";
    dateContainer.append(dateLabel);

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.name = "itemDate";
    dateInput.id = "item-date";
    dateContainer.append(dateInput);

    // Selector
    const priorityContainer = document.createElement("div");
    form.append(priorityContainer);

    const priorityLabel = document.createElement("label");
    priorityLabel.setAttribute("for", "item-priority");
    priorityLabel.textContent = "Priority";
    priorityContainer.append(priorityLabel);

    const select = document.createElement("select");
    select.name = "itemPriority";
    select.id = "item-priority";

    const option1 = document.createElement("option");
    option1.value = "0";
    option1.textContent = "Default";
    const option2 = document.createElement("option");
    option2.value = "1";
    option2.textContent = "Important";
    const option3 = document.createElement("option");
    option3.value = "2";
    option3.textContent = "Urgent";

    select.options.add(option1);
    select.options.add(option2);
    select.options.add(option3);
    priorityContainer.append(select);

    // Buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "buttons";
    form.append(buttonContainer);

    const returnBtn = document.createElement("button");
    returnBtn.className = "delete-button";
    returnBtn.formNoValidate = true;
    returnBtn.textContent = "Cancel";
    buttonContainer.append(returnBtn);

    const submitBtn = document.createElement("button");
    submitBtn.id = "item-submit";
    submitBtn.className = "new-button";
    submitBtn.type = "submit";
    submitBtn.textContent = "Create";
    buttonContainer.append(submitBtn);

    // Event listeners
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
        
        PubSub.publish("CREATE-TODO-ITEM", {
            todo,
            name: formData.itemName,
            date,
            priority: Number(formData.itemPriority)
        });

        form.reset();
        dialog.close();
    });

    dialog.showModal();
}

// Events
PubSub.subscribe("UPDATE-SIDE", updateSide);
PubSub.subscribe("UPDATE-CONTENT", updateContent);