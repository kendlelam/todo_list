import Project from "./Project";

export default class TodoList {
    constructor() {
        this.projects = [];
        this.projects.push(new Project("Home"));
    }

    addProject(project) {
        this.projects.push(project);
    }

    deleteProject(index) {
        this.projects.splice(index, 1);
    }

    getProjectByIndex(index) {
        return this.projects[index];
    }

    setProjects(projects){
        this.projects=projects;
    }

    getProjects(){
        return this.projects;
    }
}