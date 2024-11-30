import './styles.css';
import PubSub from "pubsub-js";
import * as Storage from "./storage.js";
import * as Todo from "./todo.js";
import "./uihandler.js"


// Storage.js will load locally stored data
PubSub.publish("LOAD");
