// Polyfill FormData if not available (for React Native)
if (typeof global.FormData === "undefined") {
  global.FormData = class FormData {
    constructor() {
      this.fields = []
    }
    append(key, value) {
      this.fields.push({ key, value })
    }
  }
}

import { registerRootComponent } from "expo"
import App from "./App"
import { AuthProvider } from "./src/Providers/AuthProvider"
import { QuestProvider } from "./src/Providers/QuestProvider"

function Root() {
  return (
    <AuthProvider>
      <QuestProvider>
        <App />
      </QuestProvider>
    </AuthProvider>
  )
}

registerRootComponent(Root)
