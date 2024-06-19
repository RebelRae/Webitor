class Project {
    constructor(name, manager) {
        this.manager = manager
        this.name = name? name : 'New Project'
        this.tags = new Array()
        this.encrypted = false
        this.fileTree = new FSTrie(this)
    }
    openFileInEditor = (file) => { this.manager.openFileInEditor(file) }
}

class ProjectManager {
    constructor() {
        this.projects = new Array()
        this.currentProject = null
        // this.fileHandler = new FileHandler()
        this.editor = new Editor(this)
    }
    createNewProject = (name) => {
        this.currentProject = new Project(name, this)
        this.projects.push(this.currentProject)
        return this.currentProject
    }
    loadProjectFromFile = async (file) => {
        this.currentProject = new Project(file.name, this)
        const sideBar = document.getElementById('side-bar')
        sideBar.innerHTML = ''
        Object.keys(file.files).forEach(entry => {
            const node = this.currentProject.fileTree.addNode(file.files[entry])
            if(node.terminal) {
                const element = node.element
            }
                // console.log(node)
        })
    
        sideBar.appendChild(this.currentProject.fileTree.root.element)
        this.currentProject.fileTree.root.setProject(file)
    }
    saveProjectToLocalStorage = async (project) => {
        const zipFileWriter = new zip.BlobWriter()
        const zipWriter = new zip.ZipWriter(zipFileWriter)
        const saveProject = await zipWriter.close() // TODO : Send to FileHandler
        localStorage.setItem(project.name, saveProject)
    }
    openFileInEditor = (file) => {
        this.editor.openFile()
    }
}