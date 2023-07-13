import ListController from "./ListController";
import Todo from "./Todo";
import {format, endOfToday} from 'date-fns';


export default class UI {


    static loadStart() {
        UI.displayProjects();
        UI.openProject(0);
        UI.initProjectButtons();
        UI.initModal();
    }

    static displayProjects() {
        const projectList = document.querySelector(".project-list");
        projectList.innerHTML = '';
        ListController.getProjects().forEach((element, index) => {
            const project = document.createElement("div");
            project.classList.add("project-label");
            project.innerHTML = `
                <div class="project-name">${element.getName()}</div>
                
            `
            
            if (index != 0){
                project.innerHTML +=   `<div class="remove">&#10006;</div>`;
                project.querySelector(".remove").addEventListener("click", ()=>{
                    ListController.deleteProject(index);
                    this.displayProjects();
                    this.openProject(index-1);
                    this.displayTodos(ListController.getProjectByIndex(index-1));
                })
            }
            
            project.querySelector(".project-name").dataset.index = index;
            project.querySelector(".project-name").addEventListener("click", UI.handleProjectClick);
            projectList.appendChild(project);
        });
    }

    static displayTodos(project) {
        const todoPanel = document.querySelector('.task-content');
        todoPanel.innerHTML = '';
        if (project.isEmpty()) {
            todoPanel.textContent = "No todos here yet!";
            todoPanel.classList.add("empty");
        } else {
            todoPanel.classList.remove("empty");
        }
        project.getTodos().forEach((element, index)=> {
            const newTask = document.createElement("div");
            newTask.classList.add("task-label");
            newTask.dataset.index = index;
            newTask.innerHTML = `
            <div class="project-panel pad10">
                <div class="center"><input type="checkbox"></div>
                
                <div class="task-prio ${element.priority}">${element.priority}</div>
                <div class="task-title">${element.title}</div>
            </div>
            <div class="right-task">
                <div class="dueDate pad10">${element.dueDate}</div>
                
                <div class="expand">&or;</div>
                <div class="expand delete">&#10006;</div>
            </div>
            
            `;

            newTask.querySelector("input").addEventListener("change", ()=>{
                if(newTask.querySelector("input").checked == true){
                    ListController.setTaskComplete(element, true);
    
                    
                } else {
                    ListController.setTaskComplete(element, false);
                }
            });

            newTask.querySelector(".expand").addEventListener("click", ()=>{
                if (newTask.nextSibling && newTask.nextSibling.classList.contains("dropdown")){
                    newTask.parentNode.removeChild(newTask.nextSibling);
                    newTask.querySelector(".expand").innerHTML = "&or;";
                } else {
                    newTask.querySelector(".expand").innerHTML = "&and;";
                    const dropdown = document.createElement("div");
                    dropdown.classList.add("dropdown");
                    dropdown.innerHTML = `
                       <div class="description-title">${element.title} description</div>
                        <div class="description-content" >${element.description}</div>
                    `;
                    newTask.parentNode.insertBefore(dropdown, newTask.nextSibling);
                }
                
                
            });

            newTask.querySelector(".expand.delete").addEventListener("click", ()=>{
                ListController.deleteTodo(project, newTask.querySelector(".expand.delete").dataset.index);
                this.displayTodos(project);
                
                
            });

            if (element.done){
                newTask.querySelector("input").checked = true;
            }
            
            todoPanel.appendChild(newTask);
        });

    }

    static handleProjectClick(){
        
        UI.openProject(this.dataset.index);
        
    }

    static openProject (index){
        const thisProject = ListController.getProjectByIndex(index);
        const allLabels = document.querySelectorAll(".project-label");
        const labelArray = [...allLabels];
        labelArray.forEach(e=>{
            e.classList.remove("active");
        })
        const projectButton = document.querySelector('[data-index="' + index + '"]');
        projectButton.parentNode.classList.add("active");
        const todoTitle = document.querySelector(".todo-title");
        todoTitle.textContent = "Todos: " + thisProject.getName();
        UI.initTaskButtons(index);
        UI.displayTodos(ListController.getProjectByIndex(index));
    }



    static initProjectButtons(){
        const addProject = document.getElementById("add-project");
        const finalAdd = document.getElementById("confirmProject");
        const cancelProject = document.getElementById("cancelProject");
        addProject.addEventListener("click", UI.openAddProjectUI);
        finalAdd.addEventListener("click", UI.handleAddProject);
        cancelProject.addEventListener("click",UI.closeAddProjectUI);
        

    }

    static openAddProjectUI() {
        const addProjectUI = document.querySelector(".project-textarea");
        addProjectUI.classList.add("visible");
        
    }

    static closeAddProjectUI() {
        const addProjectUI = document.querySelector(".project-textarea");
        const projectName = document.getElementById("projectName")
        addProjectUI.classList.remove("visible");
        projectName.value='';
        
    }

    static handleAddProject(){
        const projectName = document.getElementById("projectName").value;
        if (projectName){
            ListController.addProject(projectName);
            UI.displayProjects();
            UI.closeAddProjectUI();
            UI.openProject(ListController.getLength()-1);
        }  
        
    }

    static initTaskButtons(index) {
        const addTask = document.getElementById("add-task-button");
        addTask.addEventListener("click", (event)=>{
            UI.addTaskForm(index);
        });
        

    }

    static addTaskForm(index) {
        const modal = document.querySelector(".modal-background");
        modal.classList.add("active");
        modal.dataset.projectIndex = index;
    }

    static initModal(){
        const modal = document.querySelector(".modal-background");
        const close = document.getElementById("closeModal");
        close.addEventListener("click", UI.closeModal);
        const dateSelector = document.getElementById("duedate");
        dateSelector.setAttribute("min", format(endOfToday(), "yyyy-MM-dd"));
        const form = document.querySelector(".addForm");
        form.addEventListener("submit",(event)=>{
            let projectIdx = modal.dataset.projectIndex;
            event.preventDefault();
            const project = ListController.getProjectByIndex(projectIdx);
            const title = document.getElementById("title").value;
            const description = document.getElementById("description").value;
            let date = document.getElementById("duedate").value;
            date = "Due: " + format(new Date(date.replace(/-/g, '/')), 'MMMM d yyyy');
            let prio = null;
            if(document.getElementById("lowPrio").checked) {
                prio = "Low";
            } else if (document.getElementById("medPrio").checked) {
                prio = "Medium";
            } else {
                prio = "High";
            }
            ListController.addTodo(projectIdx, new Todo(title, description, date, prio));
            UI.closeModal();
            UI.displayTodos(project);
            form.reset();
        });
        
    }

    static closeModal(){
        const modal = document.querySelector(".modal-background");
        modal.classList.remove("active");
    }

}