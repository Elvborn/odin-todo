import './styles.css';
import * as Todo from "./todo.js";
import display from "./uihandler.js";

const project = Todo.Project("Default Project", "This is the default project");

const todo = Todo.Todo("Todo name");
project.addTodo(todo);

for(let i=0; i < 10; i++){
    todo.addItem(Todo.TodoItem(`Item #${i}`, new Date("11/11/2011"), 1));
}

console.log(project);

const projects = [project];
display(projects);