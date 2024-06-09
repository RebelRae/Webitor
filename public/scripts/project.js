class Project {
    constructor(name) {
        this.name = name? name : 'New Project'
        this.tags = new Array()
        this.encrypted = false
    }
}

class ProjectManager {
    constructor() {
        this.projects = new Array()
        this.currentProject = null
        this.fileHandler = new FileHandler()
    }

    createNewProject = (name) => {
        this.currentProject = new Project(name)
        this.projects.push(this.currentProject)
        return this.currentProject
    }
    saveProjectToLocalStorage = async (project) => {
        const zipFileWriter = new zip.BlobWriter()
        const zipWriter = new zip.ZipWriter(zipFileWriter)
        const saveProject = await zipWriter.close() // TODO : Send to FileHandler
        localStorage.setItem(project.name, saveProject)
    }
}