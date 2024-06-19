class FSNode {
    constructor(name = 'Project Directory', project) {
        this.project = project
        this.children = new Map()
        this.terminal = false
        this.folderOpen = false

        this.element = document.createElement('div')
        this.element.classList.add('side-bar-item')
        this.element.classList.add('side-bar-item-folder')

        this.outerDiv = document.createElement('div')
        this.outerDiv.classList.add('side-bar-item-outer')

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttributeNS('http://www.w3.org/2000/svg', 'width', '16')
        svg.setAttributeNS('http://www.w3.org/2000/svg', 'height', '16')
        svg.setAttributeNS('http://www.w3.org/2000/svg', 'viewBox', '0 0 16 16')
        svg.innerHTML = ICONS.bs['folder2-open']
        this.outerDiv.appendChild(svg)

        const nameSpan = document.createElement('span')
        nameSpan.innerText = name
        this.outerDiv.appendChild(nameSpan)

        this.innerDiv = document.createElement('div')
        this.innerDiv.classList.add('side-bar-item-inner')
        this.innerDiv.style.display = 'none'

        this.dropLine = document.createElement('div')
        this.dropLine.classList.add('side-bar-drop-line')
        this.innerDiv.appendChild(this.dropLine)

        this.dirContent = document.createElement('div')
        this.dirContent.classList.add('side-bar-subnav')
        this.innerDiv.appendChild(this.dirContent)

        this.element.appendChild(this.outerDiv)
        this.element.appendChild(this.innerDiv)

        this.outerDiv.addEventListener('click', this.toggleOpen)
    }

    toggleOpen = () => {
        this.innerDiv.style.display = this.folderOpen? 'none' : 'block'
        this.folderOpen = !this.folderOpen
    }
    setFile = (file) => {
        this.openFile = async () => {
            this.project.openFileInEditor(file)
        }
        this.outerDiv.addEventListener('dblclick', this.openFile)
        this.outerDiv.removeEventListener('click', this.toggleOpen)
        delete this.toggleOpen
        delete this.folderOpen

        const path = file.name.split('/')
        const filename = path[path.length-1]

        this.element.className = ''
        this.element.classList.add('side-bar-item')
        this.element.classList.add('side-bar-item-file')
        this.outerDiv.innerHTML = ''

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttributeNS('http://www.w3.org/2000/svg', 'width', '16')
        svg.setAttributeNS('http://www.w3.org/2000/svg', 'height', '16')
        svg.setAttributeNS('http://www.w3.org/2000/svg', 'viewBox', '0 0 16 16')
        svg.innerHTML = ICONS.bs['file-earmark-text']
        this.outerDiv.appendChild(svg)

        const nameSpan = document.createElement('span')
        nameSpan.innerText = filename
        this.outerDiv.appendChild(nameSpan)
        
        this.terminal = true
        delete this.children
    }
    setProject = (zFile) => {
        console.log(zFile)
        this.innerDiv.style.display = 'block'
        this.dropLine.style.display = 'none'
        this.outerDiv.removeEventListener('click', this.toggleOpen)
        delete this.toggleOpen
        delete this.folderOpen

        this.element.className = ''
        this.element.classList.add('side-bar-item')
        this.element.classList.add('side-bar-item-project')
        this.outerDiv.innerHTML = ''

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttributeNS('http://www.w3.org/2000/svg', 'width', '16')
        svg.setAttributeNS('http://www.w3.org/2000/svg', 'height', '16')
        svg.setAttributeNS('http://www.w3.org/2000/svg', 'viewBox', '0 0 16 16')
        svg.innerHTML = ICONS.bs['box']
        this.outerDiv.appendChild(svg)

        const nameSpan = document.createElement('span')
        nameSpan.innerText = zFile.name
        this.outerDiv.appendChild(nameSpan)
    }
}

class FSTrie {
    constructor(project) {
        this.project = project
        this.root = new FSNode(null, this.project)
    }
    addNode = (file) => {
        const nodePath = file.name
        const subdirs = nodePath.split('/')
        let node = this.root
        if(subdirs[subdirs.length -1] == '') subdirs.pop()
        for(const name of subdirs) {
            if(!node.children.has(name)) {
                const childNode = new FSNode(name, this.project)
                node.innerDiv.append(childNode.element)
                node.children.set(name, childNode)
            }
            node = node.children.get(name)
        }
        if(!file.dir) node.setFile(file)
        return node
    }
}
