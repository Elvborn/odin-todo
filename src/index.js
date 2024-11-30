import './styles.css';
import PubSub from "pubsub-js";
import * as Storage from "./storage.js";
import * as Todo from "./todo.js";
import "./uihandler.js"


PubSub.publish("LOAD");

PubSub.subscribe("LOAD-COMPLETED", (msg, projects) => {
    if(projects.length > 0){
        Todo.loadProjects(projects);
        return;
    }

    // Default project
    Todo.createProject("Default Project", "This is the project description");
    Todo.projects[0].addTodo("Todo");
    Todo.projects[0].todoList[0].addItem("Create your own project!", null, 1);
});

