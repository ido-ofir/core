
### DropDownMenu:
The DropDownMenu component will display a button that open a menu.
it expect to get an array with items and function.

* #### props:
    * title: the text on the button. (**isRequired**)
    *  icon: if true the arrow icon will appear on the button. (**default: true**)
    *  menuItems: an array on menu items - **see below**. (**isRequired**)
    *  style: this style refers to the style of the button. it will add or replace the current style.  (**object**)
    *  menuStyle: this style refers to the style of the menu. it will add or replace the current style.  (**object**)


* #### menuItems ( **array[objects]** ):
**empty object {} will create a divider.**
  
 every object in the array can get: 
  * name : the text of the menu item. (**isRequired**)
  * func: the function that the menu item will invoke (**isRequired**)
  * disabled: if disabled=true the menu item will be disabled (**bool**)
  * style: this style refers to the style of the menu item. it will add or replace the current style. (**object**)

Example: 

```
  var saveMenuItems = [
      {name:'Save & publish', func:this.saveReportAndCloseEditor},
      {name:'Preview', func:this.preview, disabled:true},
      {},
      {name:'Exports', func:this.exports, style:{color:'red'}},
    ]

    return (
      <div ref="koko">
        <DropDownMenu ref="select" title='Save' menuItems={saveMenuItems} style= {{top:53, right:15}}
           menuStyle={{right:-1}} icon={true}/>
      </div>
    );
  }

});
```