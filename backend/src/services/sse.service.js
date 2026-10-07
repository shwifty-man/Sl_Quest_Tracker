const clients = new Set()

export function addSseClient(res) {
  console.log("[SSE] ADD CLIENT")

  clients.add(res)

  console.log("[SSE] CLIENT COUNT:", clients.size)

  res.on("close", () => {
    console.log("[SSE] CLIENT CLOSED")

    clients.delete(res)

    console.log("[SSE] CLIENT COUNT:", clients.size)
  })
}

export function sendSseEvent(event, data) {
  console.log("SSE SENDING:", event, data);
  console.log("CLIENT COUNT:", clients.size);

  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  for (const res of clients) {
    res.write(payload)
  }
}
