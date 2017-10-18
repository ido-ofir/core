var React = require('react');
var core = require('core');

var Baobab = core.imports.baobab;

var songs = localStorage.getItem('songs');
if(songs){
  songs = JSON.parse(songs);
}
else{
  songs = [{
    name: 'Valerie',
    artist: 'Amy Winehouse',
    url: 'https://tabs.ultimate-guitar.com/a/amy_winehouse/valerie_ver2_ukulele_crd.htm'
  }];
}

core.set({
  newSong: {
    name: '',
    url: '',
    artist: ''
  },
  songs: songs,
  songsFilter: '',
  filterdSongs: Baobab.monkey({
    cursors: {
      songs: ['songs'],
      songsFilter: ['songsFilter']
    },
    get: function(data) {
      if(!data.songsFilter){ return data.songs; }
      return data.songs.filter(function(song){
        var v = data.songsFilter.toLowerCase();
        return (song.name.toLowerCase().indexOf(v) > -1) || (song.artist.toLowerCase().indexOf(v) > -1);
      });
    }
  })
});

core.Action({
  name: 'filterSongs',
  run({ value }){
    core.set('songsFilter', value);
  }
});

core.Action({
  name: 'setNewSong',
  run(newSong){
    if('name' in newSong) core.set(['newSong', 'name'], newSong.name);
    if('artist' in newSong) core.set(['newSong', 'artist'], newSong.artist);
    if('url' in newSong) core.set(['newSong', 'url'], newSong.url);
    core.tree.commit();
  }
});

core.Action({
  name: 'clearNewSong',
  run() {
    core.set(['newSong'], {
      name: '',
      url: '',
      artist: ''
    });
  }
});

core.Action({
  name: 'createNewSong',
  run() {
    var newSong = { ...core.get(['newSong']) };
    if(!newSong.name){ return alert('song must have a name'); }
    if(!newSong.url){ return alert('song must have a url'); }
    newSong.id = core.uuid();
    var songs = core.get('songs');
    songs = [newSong].concat(songs);
    core.set('songs', songs);
    localStorage.setItem('songs', JSON.stringify(songs));
    core.run('clearNewSong');
  }
});

core.Action({
  name: 'deleteSong',
  run({ id }) {
    var song = core.select(['songs', { id: id }]);
    if(song.exists()){
      song.unset();
      localStorage.setItem('songs', JSON.stringify(core.get('songs')));
    }
  }
});


core.View({
  name: 'Chords',
  dependencies: [
    'ui.Input',
    'ui.Button'
  ],
  bindings: {
      'songsFilter': 'songsFilter',
      'filterdSongs': 'filterdSongs',
      'newSong': 'newSong'
    },
    get(Input, Button){

      return {

        filterSongs(value){
          core.run('filterSongs', { value: value });
        },

        render() {


          return (
            <div style={{ height: '100%', display: 'flex' }}>
              
              <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
                <div style={{ borderBottom: '1px solid #ddd', display: 'flex', height: 50, alignItems: 'center' }}>
                  <div style={{ marginRight: 10 }}>Filter</div> 
                  <Input value={ this.props.songsFilter } onChange={ this.filterSongs }/>
                </div>
                {
                  this.props.filterdSongs.map(song => (
                    <div key={ song.url } style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', height: 30, alignItems: 'center' }}>
                      <div>
                        <a href={ song.url } target="_blank">{ song.name }</a>
                        {
                          song.artist ? <span style={{ fontSize: '12px' }}> - { song.artist }</span> : null
                        }
                      </div>

                      <div onClick={ e => core.run('deleteSong', { id: song.id }) } style={{ padding: 10, cursor: 'pointer'}}>X</div>
                    </div>
                  ))
                }
              </div>
              <div style={{ maxWidth: 300, flex: 1, overflow: 'auto', padding: 20, borderLeft: '1px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 40  }}>
                  Name <Input style={{ maxWidth: 200 }} value={ this.props.newSong.name } onChange={ value => core.run('setNewSong', { name: value }) }/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 40  }}>
                  Artist <Input style={{ maxWidth: 200 }} value={ this.props.newSong.artist } onChange={ value => core.run('setNewSong', { artist: value }) }/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 40  }}>
                  Url <Input style={{ maxWidth: 200 }} value={ this.props.newSong.url } onChange={ value => core.run('setNewSong', { url: value }) }/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 60  }}>
                  <Button onClick={ e => core.run('createNewSong') } style={{ width: '100%'}}>Create</Button>
                </div>
              </div>
            </div>
          );

        }
      }
    }
})
