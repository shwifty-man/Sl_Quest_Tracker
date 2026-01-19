import { registerRootComponent } from "expo"
import App from "./App"
import { AuthProvider } from "./src/Providers/AuthProvider"

function Root() {
  return (
    <AuthProvider>
        <App />
    </AuthProvider>
  )
}

registerRootComponent(Root)
