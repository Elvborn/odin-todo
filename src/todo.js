function Project(name, description){
    const todoList = [];

    const addTodo = (todo) => {
        todoList.push(todo);
    }

    const removeTodo = (todo) => {
        if(!todoList.includes(todo)) return;

        const index = _todoList.indexOf(todo);
        todoList.splice(index, 0);
    }

    return {
        name,
        description,
        todoList,
        addTodo,
        removeTodo
    }
};

function Todo(name){
    const todoItems = [];

    const addItem = (todoItem) => {
        todoItems.push(todoItem);
    }

    const removeItem = (todoItem) => {
        if(!todoItems.includes(todoItem)) return;

        const index = todoItems.indexOf(todoItem);
        todoItems.splice(index, 0);
    }

    return {
        name,
        todoItems,
        addItem,
        removeItem
    }
}

function TodoItem(name, dueDate, priority) {
    let isChecked = false;

    const toggleChecked = () => {
        isChecked = !isChecked;
    }

    const getDate = () => {
        return `${dueDate.getDate()} / ${dueDate.getMonth()} - ${dueDate.getYear()}`;
    }

    return {
        name,
        isChecked,
        priority,
        getDate,
        toggleChecked
    }
}

export { Project, Todo, TodoItem };