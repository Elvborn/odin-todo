let projects = [];

function Project(name, description){
    const todoList = [];
    let selected = false;

    const addTodo = (todoName) => {
        todoList.push(Todo(todoName));

        PubSub.publish("SAVE");
        PubSub.publish("UPDATE-CONTENT", getSelectedProject());
    }

    const removeTodo = (todo) => {
        if(!todoList.includes(todo)) return;

        const index = todoList.indexOf(todo);
        todoList.splice(index, 1);

        PubSub.publish("SAVE");
        PubSub.publish("UPDATE-CONTENT", getSelectedProject());
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
        set todoList(value){
            todoList = value;
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

        PubSub.publish("SAVE");
        PubSub.publish("UPDATE-CONTENT", getSelectedProject());
    }

    const removeItem = (todoItem) => {
        if(!todoItems.includes(todoItem)) return;

        const index = todoItems.indexOf(todoItem);
        todoItems.splice(index, 1);

        PubSub.publish("SAVE");
        PubSub.publish("UPDATE-CONTENT", getSelectedProject());
    }

    return {
        get name(){
            return name;
        },
        get todoItems(){
            return todoItems;
        },
        set todoItems(value){
            todoItems = value;
        },
        addItem,
        removeItem
    }
}

function TodoItem(name, dueDate, priority = 0) {
    let isChecked = false;

    const toggleChecked = () => {
        isChecked = !isChecked;
        PubSub.publish("SAVE");
    }

    const update = (newName, newDate, newPriority) => {
        name = newName;
        dueDate = newDate;
        priority = newPriority;

        PubSub.publish("SAVE");
        PubSub.publish("UPDATE-CONTENT", getSelectedProject());
    }

    const getDateAsString = () => {
        if(dueDate === null) return dueDate;
        
        return `${dueDate.getDate()} / ${dueDate.getMonth() + 1} - ${dueDate.getFullYear()}`;
    }

    const getDateAsInputFormat = () => {
        if(dueDate === null) return dueDate;

        const day = ("0" + dueDate.getDate()).slice(-2);
        const month = ("0" + (dueDate.getMonth() + 1)).slice(-2);
        return dueDate.getFullYear()+"-"+(month)+"-"+(day);
    }

    return {
        get name() {
            return name;
        },
        get isChecked() {
            return isChecked;
        },
        set isChecked(value){
            isChecked = value;
        },
        get priority(){
            return priority;
        },
        get dueDate(){
            return dueDate;
        },
        update,
        getDateAsString,
        getDateAsInputFormat,
        toggleChecked
    }
}

function getSelectedProject(){
    return projects.find(selectedProject => selectedProject.selected === true);
}

function createProject(name, description){
    const newProject = Project(name, description); 
    projects.push(newProject);

    PubSub.publish("PROJECT-SELECTED", newProject);
    PubSub.publish("SAVE");
}

function setSelectedProject(msg, selectedProject){    
    if(selectedProject === undefined)
        selectedProject = projects[0];
    
    projects.forEach(project => {
        project.selected = project === selectedProject ? true : false;
    });

    PubSub.publish("UPDATE-SIDE", projects);
    PubSub.publish("UPDATE-CONTENT", selectedProject);
}

// Events
PubSub.subscribe("PROJECT-SELECTED", setSelectedProject)

PubSub.subscribe("CREATE-PROJECT", (msg, data) => {
    createProject(data.name, data.description);
});

PubSub.subscribe("CREATE-TODO", (msg, name) => {
    getSelectedProject().addTodo(name);
});

PubSub.subscribe("ITEM-CHECKBOX-CHANGED", (msg, item) => {
    item.toggleChecked();
});

PubSub.subscribe("CREATE-TODO-ITEM", (msg, data) => {
    data.todo.addItem(data.name, data.date, data.priority);
});

PubSub.subscribe("UPDATE-TODO-ITEM", (msg, data) => {
    data.item.update(data.name, data.date, data.priority);
});

PubSub.subscribe("DELETE-TODO-ITEM", (msg, data) => {
    data.todo.removeItem(data.item);
});

PubSub.subscribe("LOAD-COMPLETED", (msg, loadedProjects) => {
    projects = loadedProjects;
    PubSub.publish("PROJECT-SELECTED", projects[0]);
});
 
export { 
    projects,
    createProject,
    Project,
    Todo,
    TodoItem
};