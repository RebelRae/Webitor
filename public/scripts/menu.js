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
