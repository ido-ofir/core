module.exports = {
    name: 'core.monitor',
    dependencies: [
        // 'core.eventEmitter',
    ],
    extend: {
        monitor(type, data){
            this.emit('core.monitor', {
                type: type,
                data: data
            });
        }
    }
};