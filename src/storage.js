import {Project, Todo, TodoItem, projects} from "./todo.js";

function save(){
    localStorage.projects = JSON.stringify(projects);
}

function load(){
    const data = localStorage.projects;
    const isDataValid = (localStorage.length > 0 && data !== undefined)
    
    const jsonProjectData = isDataValid ? JSON.parse(data) : [];

    const loadedProjects = [];

    // Default project setup
    if(jsonProjectData.length === 0){
        const project = Project("Default Project", "This is the project description");
        const todo = Todo("Todo");
        const todoItem = TodoItem("Create your own project!", null, 2);
        todo.todoItems.push(todoItem);
        project.todoList.push(todo);
        loadedProjects.push(project);
    }else{
        jsonProjectData.forEach(jsonProject => {
            const project = Project(jsonProject.name, jsonProject.description);
    
            jsonProject.todoList.forEach(jsonTodo => {
                const todo = Todo(jsonTodo.name);
    
                jsonTodo.todoItems.forEach(jsonItem => {
                    const date = jsonItem.dueDate ? new Date(jsonItem.dueDate) : null;

                    const item = TodoItem(jsonItem.name, date, jsonItem.priority);
    
                    if(jsonItem.isChecked) item.isChecked = true;
                
                    todo.todoItems.push(item);
                });
    
                project.todoList.push(todo);
            });
    
            loadedProjects.push(project);
        });   
    }

    PubSub.publish("LOAD-COMPLETED", loadedProjects);
}


function clear(){
    localStorage.clear();
    load();
}

// Events
PubSub.subscribe("SAVE", save);
PubSub.subscribe("LOAD", load);
PubSub.subscribe("RESET", clear);