var React = require('react');
var core = require('core');

core.View({
    name: 'Test',
    dependencies: [
      'ui.Input',
      'ui.Button',
      'asset',
      'Review'
    ],
    get(Input, Button, asset, Review){

      asset.type('review');

      var count = 0;

      return {

        getInitialState(){
          
          return {
            reviews: []
          };
        },

        create(){
          count++;
          var id = count.toString();
          var name = `review-${ id }`;
          asset.instance('review', id, {
            name: name
          });
          this.setState({ reviews: this.state.reviews.concat([id]) });
        },

        delete(id){
          this.setState({ reviews: this.state.reviews.filter(r => r !== id) });
        },

        render() {

          var reviews = this.state.reviews;
          console.debug('reviews', reviews);
          

          return (
            <div style={{ height: '100%' }}>
              <div style={{ padding: 10, borderBottom: '1px solid #ddd'}}>
                <Button onClick={ this.create }>Create</Button>
              </div>
              <div style={{ display: 'flex' }}>
                {
                  reviews.map((id, i) => <Review id={ id } key={ id } delete={ this.delete }/>)
                }
              </div>
            </div>
          );

        }
      }
    }
});

core.View({
    name: 'Review',
    dependencies: [
      'asset'
    ],
    get(asset){

      return {

        propTypes: {
          id: 'string',
          delete: 'func'
        },

        getInitialState(){
          
          this.watcher = asset.watch('review', this.props.id, v => this.forceUpdate());
          return null;
        },

        componentWillUnmount(){
          this.watcher.kill();
        },

        render() {

          var review = this.watcher.get();

          if(!review){
            console.log('123', this.props.id);
            
            return null;
          }

          return (
            <div style={{ display: 'flex', width: 120 }}>
              <div onClick={ e => console.log(review, this.props.id) }>{ review.name }</div>
              <div onClick={ e => this.props.delete(this.props.id) } style={{ cursor: 'pointer' }}>X</div>
            </div>
          );

        }
      }
    }
})
