class Editor {
    constructor() {
        this.zoom = 1.0 // TODO : Settings
    }
    
    highlight = () => {
        const textArea = document.getElementById('text-area')
        const outputArea = document.getElementById('output-area')
        const lineNumberArea = document.getElementById('line-number-div')
        const numberOfLines = textArea.value.split('\n').length

        lineNumberArea.innerHTML = ''
        for(let i = 1; i <= numberOfLines; i++)
            lineNumberArea.innerHTML += `${i}\n`
        lineNumberArea.scrollTop = textArea.scrollTop
        outputArea.scrollTop = textArea.scrollTop
        outputArea.innerHTML = textArea.value

        outputArea.scrollLeft = textArea.scrollLeft
        outputArea.removeAttribute('data-highlighted')
        hljs.highlightElement(outputArea)
    }

    input = (event) => {
        const textArea = document.getElementById('text-area')
        let indentValue = 4
        let indentChar = ' '
        switch(event.key) {
            case 's':
            case 'S':
                if(event.metaKey || event.ctrlKey) {
                    event.preventDefault()
                    saveTextAsFile()
                }
                break
            case 'Enter': {
                event.preventDefault()
                const { selectionStart, selectionEnd, value } = textArea
                let beforeCaret = value.substring(0, selectionStart)
                let afterCaret = value.substring(selectionEnd)
    
                let numIndents =
                    (beforeCaret.match(/{|\[/g) || []).length
                    - (beforeCaret.match(/}|\]/g) || []).length
                    + (beforeCaret.match(/'|"/g) || []).length % 2
                let indentation = indentChar.repeat(numIndents * indentValue)
    
                            
                if(afterCaret.length > 0 &&  afterCaret[0].match(/}|\]|'|"/g)) {
                    afterCaret = `\n${indentChar.repeat((numIndents-1) * indentValue)}` + afterCaret
                }
    
                const indentedText = `${beforeCaret}\n${indentation}${afterCaret}`;
                textArea.value = indentedText;
    
                const newCaretPosition = selectionStart + indentation.length + 1;
    
                textArea.setSelectionRange(newCaretPosition, newCaretPosition);
                this.highlight()
                break
            }
            case '\'':
            case '\"':
            case '\`':
            case '<':
            case '(':
            case '{':
            case '[': {
                event.preventDefault()
                const { selectionStart, selectionEnd, value } = textArea
                const before = value.substring(0, selectionStart)
                const selection = value.substring(selectionStart, selectionEnd)
                const after = value.substring(selectionEnd)
    
                const indentedText =
                    event.key == '<'? `${before}<${selection}>${after}` :
                    event.key == '('? `${before}(${selection})${after}` :
                    event.key == '{'? `${before}{${selection}}${after}` :
                    event.key == '['? `${before}[${selection}]${after}` :
                    event.key == '\''? `${before}'${selection}'${after}` :
                    event.key == '\"'? `${before}"${selection}"${after}` :
                    `${before}\`${selection}\`${after}`
    
                textArea.value = indentedText
    
                textArea.setSelectionRange(selectionStart + 1, selectionEnd + 1)
                this.highlight()
                break
            }
            case '>':
            case ')':
            case '}':
            case ']': {
                const { selectionStart, selectionEnd, value } = textArea
                const before = value.substring(0, selectionStart)
                const selection = value.substring(selectionStart, selectionEnd)
                const after = value.substring(selectionEnd)
                if(before.length > 0 && before[before.length-1].match(/{|\[|\(|\</g) &&  after[0].match(/}|\]|\)|\>/g)) {
                    event.preventDefault()
                    textArea.setSelectionRange(selectionStart + 1, selectionEnd + 1)
                } else {
                    textArea.setSelectionRange(selectionStart, selectionEnd)
                }
                this.highlight()
                break
            }
            default:
                break
        }
    }
}