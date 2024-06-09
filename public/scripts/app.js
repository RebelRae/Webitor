const textArea = document.createElement('textarea')
const outputArea = document.getElementById('output-area')
const lineNumberArea = document.getElementById('line-number-div')

// outputArea.setAttribute('class', 'language-javascript')

// const root = document.querySelector(':root')
// loop = () => {
//   let hue = parseFloat(getComputedStyle(root).getPropertyValue('--theme-hue')) + 0.1
//   if(hue >= 360)
//     hue = 0
//   root.style.setProperty('--theme-hue', hue)
//   requestAnimationFrame(loop)
// }
// loop()

// let indentValue = 4
// let indentChar = ' '

// textArea.setAttribute('spellcheck', false)
// textArea.addEventListener('input', () => { highlight() })
// textArea.addEventListener('scroll', () => { highlight() })
// textArea.addEventListener('keydown', (event) => {
//     switch(event.key) {
//         case 's':
//         case 'S':
//             if(event.metaKey || event.ctrlKey) {
//                 event.preventDefault()
//                 saveTextAsFile()
//             }
//             break
//         case 'Enter': {
//             event.preventDefault()
//             const { selectionStart, selectionEnd, value } = textArea
//             let beforeCaret = value.substring(0, selectionStart)
//             let afterCaret = value.substring(selectionEnd)

//             let numIndents =
//                 (beforeCaret.match(/{|\[/g) || []).length
//                 - (beforeCaret.match(/}|\]/g) || []).length
//                 + (beforeCaret.match(/'|"/g) || []).length % 2
//             let indentation = indentChar.repeat(numIndents * indentValue)

                        
//             if(afterCaret.length > 0 &&  afterCaret[0].match(/}|\]|'|"/g)) {
//                 afterCaret = `\n${indentChar.repeat((numIndents-1) * indentValue)}` + afterCaret
//             }

//             const indentedText = `${beforeCaret}\n${indentation}${afterCaret}`;
//             textArea.value = indentedText;

//             const newCaretPosition = selectionStart + indentation.length + 1;

//             textArea.setSelectionRange(newCaretPosition, newCaretPosition);
//             highlight()
//             break
//         }
//         case '\'':
//         case '\"':
//         case '\`':
//         case '<':
//         case '(':
//         case '{':
//         case '[': {
//             event.preventDefault()
//             const { selectionStart, selectionEnd, value } = textArea
//             const before = value.substring(0, selectionStart)
//             const selection = value.substring(selectionStart, selectionEnd)
//             const after = value.substring(selectionEnd)

//             const indentedText =
//                 event.key == '<'? `${before}<${selection}>${after}` :
//                 event.key == '('? `${before}(${selection})${after}` :
//                 event.key == '{'? `${before}{${selection}}${after}` :
//                 event.key == '['? `${before}[${selection}]${after}` :
//                 event.key == '\''? `${before}'${selection}'${after}` :
//                 event.key == '\"'? `${before}"${selection}"${after}` :
//                 `${before}\`${selection}\`${after}`

//             textArea.value = indentedText

//             textArea.setSelectionRange(selectionStart + 1, selectionEnd + 1)
//             highlight()
//             break
//         }
//         case '>':
//         case ')':
//         case '}':
//         case ']': {
//             const { selectionStart, selectionEnd, value } = textArea
//             const before = value.substring(0, selectionStart)
//             const selection = value.substring(selectionStart, selectionEnd)
//             const after = value.substring(selectionEnd)
//             if(before.length > 0 && before[before.length-1].match(/{|\[|\(|\</g) &&  after[0].match(/}|\]|\)|\>/g)) {
//                 event.preventDefault()
//                 textArea.setSelectionRange(selectionStart + 1, selectionEnd + 1)
//             } else {
//                 textArea.setSelectionRange(selectionStart, selectionEnd)
//             }
//             highlight()
//             break
//         }
//         default:
//             break
//     }
// })

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

// highlight = () => {
//     const numberOfLines = textArea.value.split('\n').length
//     lineNumberArea.innerHTML = ''
//     for(let i = 1; i <= numberOfLines; i++)
//         lineNumberArea.innerHTML += `${i}\n`
//     outputArea.innerHTML = textArea.value
//     outputArea.scrollTop = textArea.scrollTop
//     lineNumberArea.scrollTop = textArea.scrollTop
//     outputArea.scrollLeft = textArea.scrollLeft
//     outputArea.removeAttribute('data-highlighted')
//     hljs.highlightElement(outputArea)
// }