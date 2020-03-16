class Event {
    constructor() {
        this.subscribers = [];
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    unsubscribe(callback) {
        this.subscribers.splice(this.subscribers.indexOf(callback));
    }

    callEventHandlers(e) {
        this.subscribers.forEach(sub => {
            sub(e);
        });
    }
}