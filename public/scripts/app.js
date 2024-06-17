/* ------------------------------------------------------------- *
|                                                               |
| Application Variables                                         |
|                                                               |
* ------------------------------------------------------------- */
const jsZip = new JSZip()
const projectManager = new ProjectManager()

/* ------------------------------------------------------------- *
|                                                               |
| GUI Variables                                                 |
|                                                               |
* ------------------------------------------------------------- */
const root = document.querySelector(':root')
const docStyle = getComputedStyle(root)

const cursor = {
    x: 0,
    y: 0,
    down: false
}

let sideBarwidth = 300
let sidebarOpen = true
let sideBarAnimating = false
let sideBarInterval = null

/* ------------------------------------------------------------- *
|                                                               |
| GUI Functions                                                 |
|                                                               |
* ------------------------------------------------------------- */
closeSideBar = () => {
    let width = parseInt(docStyle.getPropertyValue('--side-bar-width'))
    if(width <= 0) {
        sideBarAnimating = false
        sidebarOpen = false
        clearInterval(sideBarInterval)
        return
    }
    width -= 10
    root.style.setProperty('--side-bar-width', `${width}px`)
}
openSideBar = () => {
    let width = parseInt(docStyle.getPropertyValue('--side-bar-width'))
    if(width >= sideBarwidth) {
        sideBarAnimating = false
        sidebarOpen = true
        clearInterval(sideBarInterval)
        return
    }
    width += 10
    root.style.setProperty('--side-bar-width', `${width}px`)
}

/* ------------------------------------------------------------- *
|                                                               |
| Initialize first-level menus                                  |
| Disable unused menus                                          |
| Append to DOM                                                 |
|                                                               |
* ------------------------------------------------------------- */
const fileMenu = new MenuItem('File')
const editMenu = new MenuItem('Edit')
const helpMenu = new MenuItem('Help')
const settingsMenu = new MenuItem('Settings')
const aboutMenu = new MenuItem('About')

helpMenu.disable()
settingsMenu.disable()
aboutMenu.disable()

document.getElementById('menu-bar').appendChild(fileMenu.element)
document.getElementById('menu-bar').appendChild(editMenu.element)
document.getElementById('menu-bar').appendChild(helpMenu.element)
document.getElementById('menu-bar').appendChild(settingsMenu.element)
document.getElementById('menu-bar').appendChild(aboutMenu.element)


/* ------------------------------------------------------------- *
|                                                               |
| File Menu Configuration                                       |
|                                                               |
* ------------------------------------------------------------- */
// New
const newMenuItem = fileMenu.addChild('New')
    const newProjectMenuItem = newMenuItem.addChild('Project')
    const newFolderMenuItem = newMenuItem.addChild('Folder')
    const newFileMenuItem = newMenuItem.addChild('File')
    newFolderMenuItem.disable()
    newFileMenuItem.disable()
// Open
const openMenuItem = fileMenu.addChild('Open')
    const openFileMenuItem = openMenuItem.addChild('File')
    const openProjectMenuItem = openMenuItem.addChild('Project')
// Save
const saveMenuItem = fileMenu.addChild('Save')
saveMenuItem.disable()


newProjectMenuItem.onClick(async() => {
    const projectName = prompt('Project name', 'New Project')
    projectManager.createNewProject(projectName)
})

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
    projectManager.fileHandler.addFromFile(file)
    // new EditorFile(fileHandler, file)
})

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
    let zFile = await files[0].getFile().catch((error) => { console.log(error) })
    const projectName = zFile.name.split('.').slice(0, -1).join('.')
    zFile = await jsZip.loadAsync(zFile)
    zFile.name = projectName
    // TODO : Catch failures
    projectManager.loadProjectFromFile(zFile)
})

/* ------------------------------------------------------------- *
|                                                               |
| Edit Menu Configuration                                       |
|                                                               |
* ------------------------------------------------------------- */
// Cut
const cutMenuItem = editMenu.addChild('Cut')
cutMenuItem.disable()
// Copy
const copyMenuItem = editMenu.addChild('Copy')
    const selectionMenuItem = copyMenuItem.addChild('Selection')
    const blockMenuItem = copyMenuItem.addChild('Block')
    const lineMenuItem = copyMenuItem.addChild('Line')
    selectionMenuItem.disable()
    blockMenuItem.disable()
    lineMenuItem.disable()
// Paste
const pasteMenuItem = editMenu.addChild('Paste')
pasteMenuItem.disable()


saveTextAsFile = () => {
    const fileBlob = new Blob([ textArea.value ], { type: 'plain/text' })
    const filename = prompt('filename', 'website.html')
    if(!filename) return

    const downloadLink = document.createElement("a")
    downloadLink.download = filename
    downloadLink.style.display = 'none'
    downloadLink.href = URL.createObjectURL(fileBlob)
    downloadLink.click()
}


/* ------------------------------------------------------------- *
|                                                               |
| Inputs                                                        |
|                                                               |
* ------------------------------------------------------------- */
document.body.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX
    cursor.y = e.clientY
})
document.body.addEventListener('mousedown', (e) => { cursor.down = true })
document.body.addEventListener('mouseup', (e) => { cursor.down = false })
document.addEventListener('keydown', (event) => {
    switch(event.key.toLowerCase()) {
        case '-':
            if((event.metaKey || event.ctrlKey) && !sideBarAnimating) {
                event.preventDefault()
                let lineHeight = parseInt(docStyle.getPropertyValue('--editor-line-height'))
                lineHeight--
                if(lineHeight < 4) lineHeight = 4
                root.style.setProperty('--editor-line-height', `${lineHeight}pt`)
            }
            break
        case '=':
            if((event.metaKey || event.ctrlKey) && !sideBarAnimating) {
                event.preventDefault()
                let lineHeight = parseInt(docStyle.getPropertyValue('--editor-line-height'))
                lineHeight++
                if(lineHeight > 24) lineHeight = 24
                root.style.setProperty('--editor-line-height', `${lineHeight}pt`)
            }
            break
        case 'b':
            if((event.metaKey || event.ctrlKey) && !sideBarAnimating) {
                event.preventDefault()
                sideBarInterval = sidebarOpen? setInterval(closeSideBar, 1) : setInterval(openSideBar, 1)
                sideBarAnimating = true
            }
            break
        case 's':
            if(event.metaKey || event.ctrlKey) {
                event.preventDefault()
                if(event.shiftKey)
                    if(projectManager.currentProject)
                        projectManager.saveProjectToLocalStorage(projectManager.currentProject)
                    else
                        alert('no project to save')
                else {
                    // Save current file
                }
            }
            break
        default:
            break
    }
})
