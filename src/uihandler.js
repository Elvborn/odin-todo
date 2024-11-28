// DOM Elements
const createProjectBtn = document.querySelector(".create-project");

createProjectBtn.addEventListener("click", () => {
    PubSub.publish("CREATE-PROJECT", "name", "description");
});


function updateSide(msg, projectList){
    const ulProjectList = document.querySelector("#project-list");
    ulProjectList.innerHTML = "";

    Array.from(projectList).forEach(project => {
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
        ulProjectList.append(projectListItem);
    });
}

function updateContent(msg, project){
    const content = document.querySelector("#content");
    content.innerHTML = "";

    createDescriptionContent(project);
    createTodoContent(project);
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
        PubSub.publish("CREATE-TODO", "Todo NAME") ;
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
            PubSub.publish("CREATE-TODO-ITEM", {
                todo,
                name: "Test ITEM!"
            });
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
            dueDate.textContent = item.getDateAsString();
            console.log(item.dueDate);
            rightItems.append(dueDate);

            const itemEditBtn = document.createElement("button");
            itemEditBtn.className = "edit-button";
            itemEditBtn.textContent = "Edit";
            rightItems.append(itemEditBtn);
        });
    });
}

// Events
PubSub.subscribe("UPDATE-SIDE", updateSide);
PubSub.subscribe("UPDATE-CONTENT", updateContent);