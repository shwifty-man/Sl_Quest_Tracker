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
