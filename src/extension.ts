import { window, workspace, ExtensionContext } from 'vscode'
import { extname, basename } from 'path'

export function activate(ctx: ExtensionContext) {
  ctx.subscriptions.push(workspace.onDidOpenTextDocument(fillTemplate))
}

const fillTemplate = () => {
  const editor = window.activeTextEditor
  if (!editor) return

  const doc = editor.document

  if (doc.getText().length !== 0 || doc.languageId !== 'typescriptreact') return

  const componentName = basename(doc.fileName, extname(doc.fileName))

  const template = [
    `import React from 'react'`,
    ``,
    `interface Props {}`,
    ``,
    `const ${componentName} = () => {`,
    `  return <div></div>`,
    `}`,
    ``,
    `export default ${componentName}`,
  ].join('\n')

  editor.edit((builder) => {
    builder.insert(doc.positionAt(0), template)
  })
}
