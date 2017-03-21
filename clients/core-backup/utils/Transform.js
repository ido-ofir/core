

function Seq(){
  var seq = [];
  var i;
  function run(cb){
    if(seq[i].run) seq[i].run();
    i++;
    step(cb);
  }
  function step(cb){
    if(!seq[i]) return cb && cb();
    if(seq[i].time) setTimeout(run.bind({}, cb), seq[i].time)
    else run(cb);
  }
  return {
    push(time, f){
      seq.push({time: time, run: f});
    },
    run(cb){
      i = 0;
      step(cb);
    }
  };
}

function Transform(style, comp){

  var seq = Seq();
  var hot = false;
  var t = {
    x: 0,
    y: 0,
    z: 0,
    scale: 1,
    opacity: 1,
    speed: '0.4s',
    ease: 'ease'
  };

  function set(key, value){
    seq.push(0, ()=>{
      t[key] = value;
      if(!hot){
        hot = true;
        setTimeout(render, 2);
      }
    });
    return instance;
  }

  function render(){
    hot = false;
    var transform = `translate3d(${t.x},${t.y},${t.z}) scale(${t.scale})`;
    var transition = `${t.speed} ${t.ease}`;
    style.WebkitTransform = transform;
    style.transform = transform;
    style.WebkitTransition = transition;
    style.transition = transition;
    style.opacity = t.opacity;
    comp.render(style);
  }

  function bind(name){
    return set.bind(null, name)
  }

  var instance = {
    x: bind('x'),
    y: bind('y'),
    z: bind('z'),
    scale: bind('scale'),
    speed: bind('speed'),
    ease: bind('ease'),
    opacity: bind('opacity'),
    wait(time){
      seq.push(time);
      return instance;
    },
    enter(){
      seq.push(10, comp.enter);
      seq.push(100);
      return instance;
    },
    done(){
      seq.run();
    },
    exit(){
      seq.push(0, comp.exit);
      seq.run();
    }
  };
  return instance;
}

module.exports = Transform;
