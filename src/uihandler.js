export default function(projectList){
    const body = document.querySelector("body");

    projectList.forEach(project => {
        const projectName = document.createElement("h1");
        projectName.textContent = project.name;
        body.append(projectName);

        project.todoList.forEach(todo => {
            const todoName = document.createElement("h2");
            todoName.textContent = todo.name;
            body.append(todoName);

            const ul = document.createElement("ul");
            body.append(ul);
            todo.todoItems.forEach(item => {
                const itemName = document.createElement("li");
                itemName.textContent = item.name;
                ul.append(itemName);

                const checked = document.createElement("input");
                checked.type = "checkbox";
                checked.value = item.isChecked;
                itemName.append(checked);

                const date = document.createElement("p");
                date.textContent = item.getDate();
                itemName.append(date);
            });
        });
    });
}