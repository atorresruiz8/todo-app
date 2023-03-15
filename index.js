 // Model
      // If localStorage has a todo array, then use it
      // Otherwise, use default array
      let todos;
      
      // Retrieve localStorage
      const savedTodos = JSON.parse(localStorage.getItem("todos"));
      
      // Check if it's an array
      if (Array.isArray(savedTodos)) {
        todos = savedTodos;
      } else {
          todos = [
            { title: "Get Groceries", dueDate: "2023-03-14", id: "id1" }, 
            { title: "Wash the car", dueDate: "2023-03-14", id: "id2" }, 
            { title: "Make dinner", dueDate: "2023-03-14", id: "id3" }
          ];
      }

      // Creates a todo
      const createTodo = (title, dueDate) => {
        const id = "" + new Date().getTime();
        todos.push({
          title: title,
          dueDate: dueDate,
          id: id
        });

        saveTodos();
      }

      // Deletes a todo
      const removeTodo = idToDelete => {
        todos = todos.filter(todo => {
          // If the id of this todo matches idToDelete, return false
          // For everything else, return true
          if (todo.id === idToDelete) {
            return false;
          } else {
            return true;
          }
        });

        saveTodos();
      }

      const toggleTodo = (todoId, checked) => {
        todos.forEach(todo => {
          if (todo.id === todoId) {
            todo.isDone = checked;
          }
        })
      }

      const saveTodos = () => {
        localStorage.setItem("todos", JSON.stringify(todos));
      }

      const setEditing = todoId => {
        todos.forEach(todo => {
          if (todo.id === todoId) {
            todo.isEditing = true;
          }
        });

        saveTodos();
      }

      const updateTodo = (todoId, newTitle, newDate) => {
        todos.forEach(todo => {
          if (todo.id === todoId) {
            todo.title = newTitle;
            todo.dueDate = newDate;
            todo.isEditing = false;
          }
        });

        saveTodos();
      }

      // Controller
      const addTodo = () => {
        const textbox = document.getElementById("todo-title");
        const title = textbox.value;

        const datePicker = document.getElementById("date-picker");
        const dueDate = datePicker.value;

        createTodo(title, dueDate);
        render();
      }

      const checkTodo = event => {
        const checkBox = event.target;

        const todoId = checkBox.dataset.todoId;
        const checked = checkBox.checked;

        toggleTodo(todoId, checked);
        render();
      }

      const onEdit = event => {
        const editButton = event.target;
        const todoId = editButton.dataset.todoId;

        setEditing(todoId);
        render();
      }

      const onUpdate = event => {
        const updateButton = event.target;
        const todoId = updateButton.dataset.todoId;

        const textbox = document.getElementById("edit-title" + todoId);
        const newTitle = textbox.value;

        const datePicker = document.getElementById("edit-date" + todoId);
        const newDate = datePicker.value;

        updateTodo(todoId, newTitle, newDate);
        render();
      }

      const onDelete = todoToDelete => {
        return () => {
          removeTodo(todoToDelete.id);
          render();
        }

      }

      // View
      const render = () => {
        // reset the list to be empty 
        document.getElementById("todo-list").innerHTML = "";

        todos.forEach(todo => {
          // Create a div to contain each todo
          const element = document.createElement("div");

          // Create a checkbox for each todo
          const checkBox = document.createElement("input");
          checkBox.type = "checkbox";
          checkBox.onchange  = checkTodo;
          checkBox.dataset.todoId = todo.id;
          if (todo.isDone === true) {
            checkBox.checked = true;
          } else {
            checkBox.checked = false;
          }
          element.prepend(checkBox);

          if (todo.isEditing === true) {
            // While editing, render a new textbox, date picker and an update button instead of what we
            // had before
            const textbox = document.createElement("input");
            textbox.type = "text";
            textbox.id = "edit-title" + todo.id;
            element.appendChild(textbox);

            const datePicker = document.createElement("input");
            datePicker.type = "date";
            datePicker.id = "edit-date" + todo.id;
            element.appendChild(datePicker);

            const updateButton = document.createElement("button");
            updateButton.innerText = "Update";
            updateButton.dataset.todoId = todo.id;
            updateButton.onclick = onUpdate;
            element.appendChild(updateButton);
          } else {
            // If not editing, render the title and due date
            element.innerText = todo.title + " " + todo.dueDate;

            // Create an edit button for each todo
            const editButton = document.createElement("button");
            editButton.innerText = "Edit";
            editButton.style = "margin-left: 12px";
            editButton.onclick = onEdit;
            editButton.dataset.todoId = todo.id;
            element.appendChild(editButton);

            // Create a delete button for each todo
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.style = 'margin-left: 12px';
            deleteButton.onclick = onDelete(todo);
            element.appendChild(deleteButton);
          }

          // Render the todos onto the screen
          const todoList = document.getElementById("todo-list");
          todoList.appendChild(element);
        });
      }

      // Render the screen
      render();