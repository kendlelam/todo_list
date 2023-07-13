import Todo from "./Todo";

export default class Project {

    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    deleteTodo(index){
        this.todos.splice(index, 1);
    }

    getTodos() {
        return this.todos;
    }
    
    setTodos(todos) {
        this.todos = todos;
    }
    
    getName(){
        return this.name;
    }

    isEmpty() {
        return this.todos.length == 0;
    }

}