class EditorFile {
    constructor(handler, file) {
        this.fileHandler = handler
        this.file = file? file : new FileSystemFileHandle()

        this.textArea = document.createElement('textarea')
        this.textArea.setAttribute('id', 'text-area')
        this.textArea.setAttribute('spellcheck', false)
        this.textArea.addEventListener('input', () => { this.fileHandler.editor.highlight() })
        this.textArea.addEventListener('scroll', () => { this.fileHandler.editor.highlight() })
        this.textArea.addEventListener('keydown', (event) => { this.fileHandler.editor.input(event) })

        this.outputArea = document.createElement('pre')
        this.outputArea.setAttribute('id', 'output-area')
        this.outputArea.setAttribute('class', 'language-javascript')

        this.lineNumberArea = document.createElement('div')
        this.lineNumberArea.setAttribute('id', 'line-number-div')

        this.tab = document.createElement('div')
        this.tab.innerHTML = this.file.name

        this.loadFile()
    }
    loadFile = async () => {
        const content = await this.file.async('string').catch((error) => { console.log(error) })
        console.log(content)
        this.fileContent = content
        this.textArea.value = content
        // this.fileHandler.bump(this)
    }
}

class FileHandler {
    constructor() {
        this.editor = new Editor()
        this.currentFile = null
        this.files = new Array()
    }
    addFromFile = (file) => {
        this.files.push(new EditorFile(this, file))
    }
    bump = (editorFile) => {
        const tabBar = document.getElementById('tab-bar')
        const workArea = document.getElementById('work-area')
        console.log(editorFile.file)
        
        tabBar.appendChild(editorFile.tab)

        workArea.innerHTML = ''
        workArea.appendChild(editorFile.lineNumberArea)
        workArea.appendChild(editorFile.outputArea)
        workArea.appendChild(editorFile.textArea)

        this.editor.highlight()
    }
}

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
            // const content = await file.async('string')
            // console.log(content)
            // const editorFile = new EditorFile(null, file)
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
