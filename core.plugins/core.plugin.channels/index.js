module.exports = {
    name: 'core.plugin.channels',
    init(definition, done) {

        var core = this;

        core.tap('core.pluginDefinition', function (pluginDefinition, next) {

            var channels, hook, name;

            if (pluginDefinition.channels) {
                channels = pluginDefinition.channels;
                if (core.isObject(channels)) {
                    for (name in channels) {
                        core.channel(name, channels[name]);
                    }
                } else if (core.isArray(channels)) {
                    channels.map(function (name) {
                        core.channel(name);
                    });
                } else {
                    console.warn(`core.plugin.channels - 'channels' defined on plugin '${ pluginDefinition.name }' should be an object or an array of strings. got ${ core.typeOf(channels) }`)
                }
            }
            next();
        });

        done(definition);

    }
};