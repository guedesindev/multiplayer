const eventManager = {
  events: {},
  subscribe(eventName, fn) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    } else {
      console.error(
        `[❌ EventManger] - Event "${eventName}" já está registrado. Favor verificar nome do evento`
      )
    }
    this.events[eventName].push(fn)
  },
  publish(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((fn) => {
        fn(data)
      })
    } else {
      console.error(
        `[❌ EventManager] - Evento "${eventName} não registrado. Favor registrar o evento ou verificar o nome do evento"`
      )
    }
  },
  usubscribe(eventName, fn) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (eventFn) => fn !== eventFn
      )
    } else {
      console.error(
        `[❌ EventManager] - Evento "${eventName}" não está registrado.`
      )
    }
  }
}

export default eventManager
