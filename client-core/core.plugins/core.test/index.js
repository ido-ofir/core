
module.exports = {
    name: 'core.test',
    extend: {
        tests: {},
        test (name, test) {

            if(test){
                return (this.tests[name] = test);
            }
            test = this.tests[name];
            if(!test){
                throw new Error('core.test - cannot find test' + name);
            }
            
            var mod = this.modules[name];
            if(!mod){
                throw new Error('core.test - cannot find module' + name);
            }

            var passed = [];
            var failed = [];

            function runTest(name, test){
                var type = this.typeOf(test);
                if(type === 'function'){
                    try{
                        test.call(this, mod);
                        passed.push({
                            name: name
                        });
                    }
                    catch(err){
                        failed.push({
                            name: name,
                            error: err
                        });
                    }
                }
                else if(type === 'object'){
                    for(var m in test){
                        runTest([name, m].join('.'), test[m]);
                    }
                }
                else if(type === 'array'){
                    for(var i = 0; i < test.length; i++){
                        runTest(name + '[' + i + ']', test[i]);
                    }
                }
                else{
                    throw new Error('cannot run test from type ' + type);
                }
            }
            
        }
    }
};