class MenuItem {
    constructor(name, level = 1) {
        this.name = name
        this.level = level
        this.element = document.createElement('div')
        this.element.classList.add('menu-item')
        this.element.classList.add(`menu-item-${level}`)
        
        this.text = document.createElement('p')
        this.text.innerHTML = this.name
        
        this.element.appendChild(this.text)
        this.children = new Array()
    }
    addChild = (name) => {
        const child = new MenuItem(name, this.level + 1)
        this.children.push(child)
        this.element.appendChild(child.element)
        return child
    }
    disable = () => {
        this.element.classList.add('menu-btn-disabled')
    }
    onClick = (callback) => {
        this.element.addEventListener('click', callback)
    }
}

const fileMenu = new MenuItem('File')

const newMenuItem = fileMenu.addChild('New')
newMenuItem.addChild('Project')

const newFolderMenuItem = newMenuItem.addChild('Folder')
newFolderMenuItem.disable()
const newFileMenuItem = newMenuItem.addChild('File')
newFileMenuItem.disable()
const openMenuItem = fileMenu.addChild('Open')
const openFileMenuItem = openMenuItem.addChild('File')
openFileMenuItem.onClick(async() => {
    const files = await window.showOpenFilePicker({
        types: [
            {
                description: 'Editable Files',
                accept: {
                    'text/*': ['.js', '.html', '.txt', '.css']
                }
            }
        ],
        excludeAcceptAllOption: true,
        multi: true
    }).catch((error) => { console.log(error) })
    const file = await files[0].getFile().catch((error) => { console.log(error) })
    fileHandler.addFromFile(file)
    // new EditorFile(fileHandler, file)
})
const openProjectMenuItem = openMenuItem.addChild('Project')
openProjectMenuItem.onClick(async() => {
    const files = await window.showOpenFilePicker({
        types: [
            {
                description: 'Project Files',
                accept: {
                    'application/zip': ['.zip', '.itc']
                }
            }
        ],
        excludeAcceptAllOption: true,
        multi: false
    }).catch((error) => { console.log(error) })
    const file = await files[0].getFile().catch((error) => { console.log(error) })
    const zipFileReader = new zip.BlobReader(file)
    const zipReader = new zip.ZipReader(zipFileReader)
    const entries = await zipReader.getEntries()
    entries.forEach(entry => {
        console.log(entry.filename)
    })
    // const data = await file.getData().catch((error) => { console.log(error) })
    console.log(entries)//.Blob())
})
fileMenu.addChild('Save')

const editMenu = new MenuItem('Edit')
editMenu.addChild('Cut')
const copyMenuItem = editMenu.addChild('Copy')
copyMenuItem.addChild('Selection')
copyMenuItem.addChild('Block')
copyMenuItem.addChild('Line')
editMenu.addChild('Paste')

const helpMenu = new MenuItem('Help')
helpMenu.disable()

const settingsMenu = new MenuItem('Settings')
settingsMenu.disable()

const aboutMenu = new MenuItem('About')
aboutMenu.addChild('Nothing')

document.getElementById('menu-bar').appendChild(fileMenu.element)
document.getElementById('menu-bar').appendChild(editMenu.element)
document.getElementById('menu-bar').appendChild(helpMenu.element)
document.getElementById('menu-bar').appendChild(settingsMenu.element)
document.getElementById('menu-bar').appendChild(aboutMenu.element)
