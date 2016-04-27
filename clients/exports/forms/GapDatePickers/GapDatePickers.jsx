var React = require('react');
var PropTypes = React.PropTypes;
var DatePicker = require('react-datepicker');
var moment = require('moment');
require('react-datepicker/dist/react-datepicker.css');
var inputMixin = require('../mixins/input.jsx');
var myCss = require('./date-style.css');

var boxStyle = {
  display: 'flex',
  flex:1,
  justifyContent: 'space-between',
  flexDirection: 'row',
  paddingBottom: 0,
  borderRadius: 5,
};

var datePickerStyle= {
  position:'relative',
  display: 'flex',
  width: '48%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginBottom: 10
};

var iconStyle = {
  position:'absolute',
  width: '20px',
  height:'36px',
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  right:0,
  bottom:0,
  padding: '0 15px',
  borderLeft: '1px solid #ccc',
  fontSize:'16px',
  color:'#bbb'
};

 module.exports = React.createClass({
   mixins: [inputMixin],

   propTypes: {
     name: PropTypes.string.isRequired,
     minGap: PropTypes.number.isRequired,
     minDate: PropTypes.object,
     startDate: PropTypes.object,
     endDate: PropTypes.object,
     labelStart: PropTypes.string,
     labelEnd: PropTypes.string,
   },

   getDefaultProps () {
     return {
       minDate: moment(),
       startDate: moment(),
     }
   },

   getInitialState(){
      return {
          startDate: moment(this.props.startDate),
          endDate: moment(this.props.endDate)
        };
      },

   componentDidMount(){

     if (!this.props.endDate)
      this.setState({endDate: moment(this.state.startDate).add(this.props.minGap, 'days')})
     var dateArray= this.context.form.getInputValue(this.props.name);
     if (dateArray){
       this.setState({
         startDate:moment(new Date(dateArray[0])),
         endDate:moment(new Date(dateArray[1]))
       });
     }
     this.setInputValue();
   },

   handleOnStartChange(e){
     this.setState({startDate:e})
     var end = moment(this.state.endDate).subtract(this.props.minGap, 'days');
     if (end < e){
       this.setState({endDate:moment(e).add(this.props.minGap,'days')})
     }
     this.setInputValue();
   },

   setInputValue() {
     setTimeout(()=>{
         var dateArray = [this.state.startDate.format(),this.state.endDate.format()]
         this.context.form.setInputValue(this.props.name, dateArray);
     }, 0);
   },

   handleOnEndChange(e){
     this.setState({endDate:e})
     this.setInputValue();
   },

   render() {

     return (
      <div style= {boxStyle}>
        <div style= {datePickerStyle}>
          <span style={{width:'100%'}}>{this.props.labelStart}</span>
          <DatePicker
            className= 'date-style'
            selected= {this.state.startDate}
            minDate= {this.props.minDate}
            weekStart= '0'
            dateFormat= "DD/MM/YYYY"
            startDate= {this.state.startDate}
            endDate= {this.state.endDate}
            onChange= {this.handleOnStartChange}
          />
        <span className="icon-calendar" style={ iconStyle }></span>
        </div>
        <div style= {datePickerStyle}>
          <span style={{width:'100%'}}>{this.props.labelEnd}</span>
          <DatePicker
            className= 'date-style'
            selected= {this.state.endDate}
            minDate= {moment(this.state.startDate).add(this.props.minGap, 'days')}
            weekStart= '0'
            dateFormat= "DD/MM/YYYY"
            startDate= {this.state.startDate}
            endDate= {this.state.endDate}
            onChange= {this.handleOnEndChange}
          />
        <span className="icon-calendar" style={ iconStyle }></span>
        </div>
      </div>
     );
   }
 });
