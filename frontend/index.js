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
import { UserProvider } from "./src/Providers/UserProvider"
import { ErrorProvider } from "./src/Providers/ErrorProvider"
import { SSEProvider } from "./src/Providers/SSEProvider"

function Root() {
  return (
    <SSEProvider>
      <ErrorProvider>
        <AuthProvider>
          <UserProvider>
            <QuestProvider>
              <App />
            </QuestProvider>
          </UserProvider>
        </AuthProvider>
      </ErrorProvider>
    </SSEProvider>
  )
}

registerRootComponent(Root)
