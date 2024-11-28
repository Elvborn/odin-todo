import './styles.css';
import PubSub from "pubsub-js";
import * as Todo from "./todo.js";
import "./uihandler.js"

Todo.createProject("Default Project", "This is the default project");
Todo.createProject("Default Project #2", "");