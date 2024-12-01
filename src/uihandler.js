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
    const detailsContainer = createElement("div");
    detailsContainer.id = "project-details";
    content.append(detailsContainer);

    const detailsTitle = createElement("h2", {
        innerText: project.name,
        attributes: {
            class: "content-title"
        }
    });
    detailsContainer.append(detailsTitle);

    const detailsEditBtn = createElement("button", {
        innerText: "Edit Project",
        attributes: {
            class: "edit-button"
        }
    });
    detailsContainer.append(detailsEditBtn);

    const detailsNewBtn = createElement("button", {
        innerText: "New Todo",
        attributes: {
            class: "new-button"
        }
    });;
    detailsNewBtn.addEventListener("click", () => {
        displayTodoDialog();
    });
    detailsContainer.append(detailsNewBtn);

    if(project.description != undefined && project.description.length > 0){
        const detailsDescriptionContainer= createElement("div", {
            innerText: project.description,
            attributes: {
                class: "item-container"
            }
        });
        detailsContainer.append(detailsDescriptionContainer);
    }
}

function createTodoContent(project){
    project.todoList.forEach(todo => {
        const todoContainer = createElement("div", {
            attributes: {
                class: "todo"
            }
        });
        content.append(todoContainer);

        const todoTitle = createElement("h2", {
            innerText: todo.name,
            attributes: {
                class: "content-title"
            }
        });
        todoContainer.append(todoTitle);

        const todoNewBtn = createElement("button", {
            innerText: "Add Item",
            attributes: {
                class: "new-button"
            }
        });
        todoNewBtn.addEventListener("click", () => {
            displayItemDialog(todo);
        });
        todoContainer.append(todoNewBtn);

        // Todo items
        todo.todoItems.forEach((item, i) => {
            const itemContainer = createElement("div", {
                attributes: {
                    class: "item-container"
                }
            });

            if(item.priority != undefined && item.priority > 0)
                itemContainer.classList.add(`priority${item.priority}`);
            todoContainer.append(itemContainer);
            
            const itemCB = createElement("input", {
                attributes:{
                    type: "checkbox",
                    id: `checkbox_${i}`,
                    name: `checkbox_${i}`,
                },
                options: {
                    checked: item.isChecked
                }
            });
            itemCB.addEventListener("change", () => {
                PubSub.publish("ITEM-CHECKBOX-CHANGED", item);
            });
            itemContainer.append(itemCB);

            const itemName = createElement("label", {
                innerText: item.name,
                attributes:{
                    for: `checkbox_${i}`
                }
            });
            itemContainer.append(itemName);

            const rightItems = createElement("div");
            itemContainer.append(rightItems);
            
            const dueDate = createElement("p", {
                innerText: item.getDateAsString() === null ? "" : item.getDateAsString(),
                attributes: {
                    class: "due-date"
                }
            });
            rightItems.append(dueDate);

            const itemEditBtn = createElement("button", {
                innerText: "Edit",
                attributes: {
                    class: "edit-button"
                }
            });
            itemEditBtn.addEventListener("click", () => {
                displayItemDialog(todo, item);
            });
            rightItems.append(itemEditBtn);
        });
    });
}

function displayProjectDialog(){
    const dialog = document.querySelector("#project-dialog");
    dialog.innerHTML = "";

    const form = createElement("form", {
        attributes: {
            id: "project-form",
            method: "dialog"
        }
    });
    dialog.append(form);

    const legend = createElement("label", {
        innerText: "Create Project"
    });
    form.append(legend);

    // Name
    const nameContainer = createElement("div");
    form.append(nameContainer);

    const nameLabel = createElement("label", {
        innerText: "Project Name",
        attributes: {
            for: "project-name"
        }
    });
    nameContainer.append(nameLabel);

    const nameInput = createElement("input", {
        attributes: {
            type: "text",
            name: "projectName",
            id: "project-name",
            placeholder: "Required",
            required: true
        }
    });
    nameContainer.append(nameInput); 

    // Description
    const descriptionContainer = createElement("div");
    form.append(descriptionContainer);

    const descriptionLabel = createElement("label", {
        innerText: "Description",
        attributes: {
            for: "project-description"
        }
    });
    descriptionContainer.append(descriptionLabel);

    const descriptionInput = createElement("input", {
        attributes: {
            name: "projectDescription",
            id: "project-description",
            rows: 3
        }
    });
    descriptionContainer.append(descriptionInput); 

    // Buttons
    const buttonContainer = createElement("div", {
        attributes: {
            class: "buttons"
        }
    });
    form.append(buttonContainer);

    const returnBtn = createElement("button", {
        innerText: "Cancel",
        attributes: {
            class: "delete-button",
            formNoValidate: true,
        }
    });
    buttonContainer.append(returnBtn);

    const submitBtn = createElement("button", {
        innerText: "Create",
        attributes: {
            id: "item-submit",
            class: "new-button",
            type: "submit"
        }
    });
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

    const form = createElement("form", {
        attributes: {
            id: "todo-form",
            method: "dialog"
        }
    });
    dialog.append(form);

    const legend = createElement("legend", {
        innerText: "Create Todo"
    });
    form.append(legend);

    // Name
    const nameContainer = createElement("div");
    form.append(nameContainer);

    const nameLabel = createElement("label", {
        innerText: "Todo Name",
        attributes:{
            for: "todo-name"
        }
    });
    nameContainer.append(nameLabel);

    const nameInput = createElement("input", {
        attributes:{
            type: "text",
            name: "todoName",
            id: "todo-name",
            placeholder: "Required",
            required: true
        }
    });
    nameContainer.append(nameInput); 

    // Buttons
    const buttonContainer = createElement("div", {
        attributes: {
            class: "buttons"
        }
    });
    form.append(buttonContainer);

    const returnBtn = createElement("button", {
        innerText: "Cancel",
        attributes: {
            class: "delete-button",
            formNoValidate: true
        }
    });
    buttonContainer.append(returnBtn);

    const submitBtn = createElement("button", {
        innerText: "Create",
        attributes: {
            id: "item-submit",
            class: "new-button",
            type: "submit",
        }
    });
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

function displayItemDialog(todo, item = null){
    const dialog = document.querySelector("#item-dialog");
    dialog.innerHTML = "";

    const form = createElement("form", {
        attributes: {
            method: "dialog",
            id: "item-form"
        }
    });

    form.addEventListener("keypress", (event) => {        
        if(event.key === "Enter"){
            event.preventDefault();
            submitBtn.click();
        }
    });

    dialog.append(form);

    const legend = createElement("legend", {
        innerText: "Create Todo Item"
    });
    form.append(legend);

    // Name
    const nameContainer = createElement("div");
    form.append(nameContainer);

    nameLabel = createElement("label", {
        innerText: "Item Name",
        attributes: {
            for: "item-name"
        }
    });
    nameContainer.append(nameLabel);

    const nameInput = createElement("input", {
        attributes: {
            type: "text",
            name: "itemName",
            id: "item-name",
            placeholder: "Required",
            required: true,
            value: item === null ? "" : item.name,
        }
    });
    nameContainer.append(nameInput);

    // Due date
    const dateContainer = createElement("div");
    form.append(dateContainer);

    const dateLabel = createElement("label", {
        innerText: "Due Date",
        attributes: {
            for: "item-date"
        }
    });
    dateContainer.append(dateLabel);

    const dateInput = createElement("input", {
        attributes: {
            type: "date",
            name: "itemDate",
            id: "item-date",
            value: item === null ? "" : item.getDateAsInputFormat()
        }
    });
    dateContainer.append(dateInput);

    // Selector
    const priorityContainer = createElement("div");
    form.append(priorityContainer);

    const priorityLabel = createElement("label", {
        innerText: "Priority",
        attributes: {
            for: "item-priority"
        }
    });
    priorityContainer.append(priorityLabel);

    const select = createElement("select", {
        attributes: {
            name: "itemPriority",
            id: "item-priority",
            
        }
    });

    const option1 = createElement("option", {
        innerText: "Default",
        attributes:{
            value: 0
        }
    });

    const option2 = createElement("option", {
        innerText: "Important",
        attributes:{
            value: 1
        }
    });

    const option3 = createElement("option", {
        innerText: "Urgent",
        attributes:{
            value: 2
        }
    });

    select.options.add(option1);
    select.options.add(option2);
    select.options.add(option3);

    select.value = item === null ? 0 : item.priority;

    priorityContainer.append(select);

    // Buttons
    const buttonContainer = createElement("div", {
        attributes: {
            class: "buttons"
        }
    });
    form.append(buttonContainer);

    const returnBtn = createElement("button", {
        innerText: "Cancel",
        attributes: {
            class: "delete-button",
        },
        options: {
            formNoValidate: true
        }
    });

    returnBtn.addEventListener("click", (event) => {
        event.preventDefault();
        dialog.close();
    });


    buttonContainer.append(returnBtn);

    if(item !== null){
        const deleteBtn = createElement("button", {
            innerText: "Delete",
            attributes: {
                id: "item-delete",
                class: "delete-button"
            },
            options: {
                formNoValidate: true
            }
        });

        deleteBtn.addEventListener("click", (event) => {
            event.preventDefault();
            PubSub.publish("DELETE-TODO-ITEM", {
                todo,
                item
            });
            dialog.close();
        });

        buttonContainer.append(deleteBtn); 
    }

    const submitBtn = createElement("button", {
        innerText: item === null ? "Create" : "Save",
        attributes: {
            id: "item-submit",
            class: "new-button",
            type: "submit"
        }
    });

    submitBtn.addEventListener("click", () => {
        const formData = Object.fromEntries(new FormData(form));

        let date = isNaN(new Date(formData.itemDate)) ? null : new Date(formData.itemDate);

        const formValid = (
            formData.itemName.length !== 0 &&
            formData.itemPriority !== undefined
        );

        if(!formValid) return;

        const eventMsg = item === null ? "CREATE-TODO-ITEM" : "UPDATE-TODO-ITEM";
        PubSub.publish(eventMsg, {
            todo,
            item,
            name: formData.itemName,
            date,
            priority: Number(formData.itemPriority)
        });

        form.reset();
        dialog.close();
    });

    buttonContainer.append(submitBtn);

    dialog.showModal();
}

function createElement(type, elementData = {}){
    element = document.createElement(type);
    
    if(elementData.hasOwnProperty("innerText"))
        element.textContent = elementData.innerText;

    if(elementData.hasOwnProperty("attributes")){
        for(const [key, value] of Object.entries(elementData.attributes)){
            element.setAttribute(key, value);
        }
    }

    if(elementData.hasOwnProperty("options")){
        for(const [key, value] of Object.entries(elementData.options)){
            element[key] = value;
        }
    }

    return element;
}

// Events
PubSub.subscribe("UPDATE-SIDE", updateSide);
PubSub.subscribe("UPDATE-CONTENT", updateContent);