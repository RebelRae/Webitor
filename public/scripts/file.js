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
        const content = await this.file.text().catch((error) => { console.log(error) })
        console.log(content)
        this.fileContent = content
        this.textArea.value = content
        this.fileHandler.bump(this)
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

const fileHandler = new FileHandler()