const projects = [];

function Project(name, description){
    const todoList = [];
    let selected = false;

    const addTodo = (todoName) => {
        todoList.push(Todo(todoName));
    }

    const removeTodo = (todo) => {
        if(!todoList.includes(todo)) return;

        const index = todoList.indexOf(todo);
        todoList.splice(index, 0);
    }

    return {
        get name(){
            return name;
        },
        get description(){
            return description;
        },
        get todoList(){
            return todoList;
        },
        get selected(){
            return selected;
        },
        set selected(value){
            selected = value;
        },
        addTodo,
        removeTodo
    }
};

function Todo(name){
    const todoItems = [];

    const addItem = (itemName, dueDate, priority) => {
        todoItems.push(TodoItem(itemName, dueDate, priority));
    }

    const removeItem = (todoItem) => {
        if(!todoItems.includes(todoItem)) return;

        const index = todoItems.indexOf(todoItem);
        todoItems.splice(index, 0);
    }

    return {
        get name(){
            return name;
        },
        get todoItems(){
            return todoItems;
        },
        addItem,
        removeItem
    }
}

function TodoItem(name, dueDate, priority = 0) {
    let isChecked = false;

    const toggleChecked = () => {
        isChecked = !isChecked;
    }

    const getDateAsString = () => {
        return `${dueDate.getDate()} / ${dueDate.getMonth() + 1} - ${dueDate.getFullYear()}`;
    }

    return {
        get name() {
            return name;
        },
        get isChecked() {
            return isChecked;
        },
        get priority(){
            return priority;
        },
        get dueDate(){
            return dueDate;
        },
        getDateAsString,
        toggleChecked
    }
}

function getSelectedProject(){
    return projects.find(selectedProject => selectedProject.selected === true);
}

function createProject(name, description){
    projects.push(Project(name, description));
    PubSub.publish("UPDATE-SIDE", projects);
}

function setSelected(msg, selectedProject){    
    projects.forEach(project => {
        project.selected = project === selectedProject ? true : false;
    });

    PubSub.publish("UPDATE-SIDE", projects);
    PubSub.publish("UPDATE-CONTENT", selectedProject);
}

// Events
PubSub.subscribe("PROJECT-SELECTED", setSelected)
PubSub.subscribe("CREATE-PROJECT", createProjectEventHandler);
PubSub.subscribe("CREATE-TODO", createTodoEventHandler);
PubSub.subscribe("ITEM-CHECKBOX-CHANGED", itemCheckboxEventHandler);
PubSub.subscribe("CREATE-TODO-ITEM", createTodoItemEventHandler);

function createProjectEventHandler(msg, name, description){
    createProject(name, description);
}

function createTodoEventHandler(msg, name){
    console.log(getSelectedProject());
    getSelectedProject().addTodo(name);
    PubSub.publish("UPDATE-CONTENT", getSelectedProject());
}

function itemCheckboxEventHandler(msg, item){
    item.toggleChecked();
}

function createTodoItemEventHandler(msg, data){
    data.todo.addItem("Test Item", new Date("2015-11-28"), 1);
    PubSub.publish("UPDATE-CONTENT", getSelectedProject());

    console.log(data.todo.todoItems);
}
 
export { createProject };