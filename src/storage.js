import * as Todo from "./todo.js";

function save(){
    localStorage.projects = JSON.stringify(Todo.projects);

    console.log("Project saved!");
    console.log(Todo.projects.length);
}

function load(){
    const data = localStorage.projects;
    const isDataValid = (localStorage.length > 0 && data.projects !== "undefined")
    
    const projects = isDataValid ? JSON.parse(data) : [];
    PubSub.publish("LOAD-COMPLETED", projects);
}

// Events
PubSub.subscribe("SAVE", save);
PubSub.subscribe("LOAD", load);