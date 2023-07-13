import TodoList from "./TodoList"
import Project from "./Project";
import Todo from "./Todo";

const ListController = (()=> {
    let todoList = new TodoList();

    const saveTodoList = () => {
        localStorage.setItem('todoList', JSON.stringify(todoList));
    }
    
    const getTodoList = ()=>{
        todoList = Object.assign(new TodoList(), JSON.parse(localStorage.getItem('todoList')));
        todoList.setProjects(
            todoList
              .getProjects()
              .map((project) => Object.assign(new Project(), project))
          )
      
        todoList
            .getProjects()
            .forEach((project) =>
              project.setTodos(
                project.getTodos().map((task) => Object.assign(new Todo(), task))
              )
            )
      
          return todoList;
    }

    const getProjects = () => {
        return getTodoList().projects;
    }

    const getLength = () => {
        return getTodoList().projects.length;
    }

    const addProject = (projectName)=>{
        getTodoList().addProject(new Project(projectName));
        saveTodoList();
    }

    const deleteProject = (index) => {
        getTodoList().deleteProject(index);
        saveTodoList();
    }

    const setTaskComplete = (task, complete) =>{
        task.done = complete;
        saveTodoList();
    }

    const addTodo = (index, task) => {
        todoList.getProjectByIndex(index).addTodo(task);
        saveTodoList();
    }
    
    const deleteTodo = (project, todoIdx) => {
        project.deleteTodo(todoIdx);
        saveTodoList();
    }

    const getProjectByIndex = (index)=>{
        return getTodoList().getProjectByIndex(index);
    }

    return {getTodoList, getProjects, addProject, deleteProject, addTodo, deleteTodo, getProjectByIndex, getLength, setTaskComplete};

})();

export default ListController;