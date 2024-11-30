let projects = [];

function Project(name, description){
    const todoList = [];
    let selected = false;

    const addTodo = (todoName) => {
        todoList.push(Todo(todoName));
        PubSub.publish("SAVE");
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

    const getDateAsString = () => {
        if(dueDate === null) return dueDate;
        
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
    const newProject = Project(name, description); 
    projects.push(newProject);

    PubSub.publish("PROJECT-SELECTED", newProject);
    PubSub.publish("SAVE");
}

function loadProjects(jsonData){
    if(jsonData.length === 0) return;

    projects = [];
    jsonData.forEach(jsonProject => {
        const project = Project(jsonProject.name, jsonProject.description);

        jsonProject.todoList.forEach(jsonTodo => {
            const todo = Todo(jsonTodo.name);

            jsonTodo.todoItems.forEach(jsonItem => {
                const item = TodoItem(jsonItem.name, jsonItem.dueDate, jsonData.priority);

                if(jsonItem.isChecked) item.toggleChecked();
            
                todo.todoItems.push(item);
            });

            project.todoList.push(todo);
        });

        projects.push(project);
    });

    setSelectedProject(projects[0]);
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
PubSub.subscribe("CREATE-PROJECT", createProjectEventHandler);
PubSub.subscribe("CREATE-TODO", createTodoEventHandler);
PubSub.subscribe("ITEM-CHECKBOX-CHANGED", itemCheckboxEventHandler);
PubSub.subscribe("CREATE-TODO-ITEM", createTodoItemEventHandler);

function createProjectEventHandler(msg, data){
    createProject(data.name, data.description);
}

function createTodoEventHandler(msg, name){
    getSelectedProject().addTodo(name);
    PubSub.publish("UPDATE-CONTENT", getSelectedProject());
}

function itemCheckboxEventHandler(msg, item){
    item.toggleChecked();
}

function createTodoItemEventHandler(msg, data){
    data.todo.addItem(data.name, data.date, data.priority);
    PubSub.publish("UPDATE-CONTENT", getSelectedProject());
}
 
export { 
    projects,
    createProject, 
    loadProjects
};