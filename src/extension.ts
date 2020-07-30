import { window, workspace, Disposable, ExtensionContext } from 'vscode'
import { extname, basename } from 'path'

// Used https://github.com/Que3216/vscode-typescript-react-template as the base for this code

export function activate(ctx: ExtensionContext) {
  const templater = new Templater()
  const controller = new TemplaterController(templater)

  ctx.subscriptions.push(controller)
  ctx.subscriptions.push(templater)
}

export class Templater {
  public fillOutTemplateIfEmpty() {
    const editor = window.activeTextEditor
    if (!editor) return

    const doc = editor.document

    if (doc.getText().length !== 0) return
    if (doc.languageId !== 'typescriptreact') return

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

  public dispose() {}
}

class TemplaterController {
  private _templater: Templater
  private _disposable: Disposable

  constructor(templater: Templater) {
    this._templater = templater
    let subscriptions: Disposable[] = []
    workspace.onDidOpenTextDocument(this._onEvent, this, subscriptions)
    this._disposable = Disposable.from(...subscriptions)
  }

  private _onEvent() {
    this._templater.fillOutTemplateIfEmpty()
  }

  public dispose() {
    this._disposable.dispose()
  }
}
