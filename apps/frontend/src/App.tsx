import { useState } from 'react'
import { Button } from '@/components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-card p-8 rounded-lg shadow-md border">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Stock Monitor Frontend
        </h1>
        <div className="text-center">
          <Button
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </Button>
          <p className="mt-4 text-muted-foreground">
            Ready for SSE implementation
          </p>
        </div>
      </div>
    </div>
  )
}

export default App