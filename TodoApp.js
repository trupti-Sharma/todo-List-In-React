import React from 'react';
import './act.css';
import './acti.css';
import swal from 'sweetalert';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 

// A little enhanced of Facebook's React TODO example.
// Want to be looked Reminder alike.

export default class TodoApp extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        items: [],
        text: ""
      };
      
      this.handleTextChange = this.handleTextChange.bind(this);
      this.handleAddItem = this.handleAddItem.bind(this);
      this.markItemCompleted = this.markItemCompleted.bind(this);
      this.handleDeleteItem = this.handleDeleteItem.bind(this);
    }
    handleTextChange(event) {
      var iChars = "~`!#$%^&*+=-[]\\\';,/{}|\":<>?";
      
      if (iChars.indexOf(event.target.value.charAt(0)) !== -1)
      {
        swal("Special Symbol", "This Field 1st Char should be Alphabet or Number ", "warning");
         return false;
      }
      this.setState({
        text: event.target.value
       
      });  
    }
    handleAddItem(event) {
        if(this.state.text===""){
            swal("Required", "This Field Is Required", "warning");
        }else{
      event.preventDefault();
     
      var newItem = {
      id: Date.now(),
        text: this.state.text,
        done: false
      };
      
      this.setState((prevState) => ({
        items: prevState.items.concat(newItem),
        text: ""
      }));}
    }
    markItemCompleted(itemId) {
      var updatedItems = this.state.items.map(item => {
        if (itemId === item.id)
          item.done = !item.done;
        
        return item;
      });
      
      // State Updates are Merged
      this.setState({
        items: [].concat(updatedItems)
      });
    }
    handleDeleteItem(itemId) {
      var updatedItems = this.state.items.filter(item => {
        return item.id !== itemId;
      });
      
      this.setState({
        items: [].concat(updatedItems)
      });
    }
    render() {
      return (
        <div class="App">
          <h3 className="apptitle">MY TO DO LIST</h3>
         
          <form className="row">
            <div className="col-md-3">
              <input type="text" className="form-control" onChange={this.handleTextChange} value={this.state.text} required />
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary" onClick={this.handleAddItem} >{"Add" }</button>
            </div>
            <div className="row">
            <div className="col-md-4">
              <TodoList items={this.state.items} onItemCompleted={this.markItemCompleted} onDeleteItem={this.handleDeleteItem} />
            </div>
          </div>
           
          </form>
        </div>
      );
    }
  }
  
  class TodoItem extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        contenteditable:true,
        editLable:"Edit",
        flag:3,
        text:this.props.text
      };
      this.markCompleted = this.markCompleted.bind(this);
      this.deleteItem = this.deleteItem.bind(this);
    }
    handleChange=(event)=>
    {
      this.setState({
        text: event.target.value
      });
    }
    edit=()=>{
        if(this.state.flag===3){
          confirmAlert({
            title: 'EDIT',
            message: 'Are You Sure That You Want To Edit It ?',
            buttons: [
              {
                label: 'Yes',
                onClick: () =>   this.setState({
                  contenteditable: false,
                  editLable:"Save",
                  flag:1,
                  rbgColor:"white"
              })
              },
              {
                label: 'No',
              }
            ]
          });
       
    }
    else {
      var iChars = "~`!#$%^&*+=-[]\\\';,/{}|\":<>?";
      if(this.state.text===""){
        swal("Required", "This Field Is Required", "warning");
        return false;
      }
      else if (iChars.indexOf(this.state.text.charAt(0)) !== -1)
      {
        swal("Special Symbol", "This Field 1st Char should be Alphabet or Number ", "warning");
         return false;
      }
      confirmAlert({
        title: 'Save',
        message: 'Are You Sure That You Want To Save It ?',
        buttons: [
          {
            label: 'Yes',
            onClick: () =>    this.setState({
              contenteditable: true,
              editLable:"Edit",
              flag:3,
              rbgColor:""
          })
          },
          {
            label: 'No',
          }
        ]
      });
       
    }
    }
    markCompleted(event) {
      confirmAlert({
        title: 'Complete the task',
        message: 'Are you sure to do thisDo You Want To Complete It ?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => this.props.onItemCompleted(this.props.id)
          },
          {
            label: 'No',
          }
        ]
      });
    };
  
    deleteItem(event) {
      confirmAlert({
        title: 'Are You Sure ?',
        message: 'Are You Sure That You Want To Delete It ?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => this.props.onDeleteItem(this.props.id)
          },
          {
            label: 'No',
          }
        ]
      });
        }
       
    // Highlight newly added item for several seconds.
    componentDidMount() {
      if (this._listItem) {
        // 1. Add highlight class.
        this._listItem.classList.add("highlight");
  
        // 2. Set timeout.
        setTimeout((listItem) => {
          // 3. Remove highlight class.
          listItem.classList.remove("highlight");
        }, 500, this._listItem);
      }
    }
    render() {
      if(this.state.flag===0)
      {
        var text=this.props.text;
      }
      else{
        if(this.state.text===undefined){
          swal("Required", "This Field Is Required", "warning");
      }else{
         text=this.state.text;
        }
      }
      var itemClass = "form-check todoitem " + (this.props.completed ? "done" : "undone");
      return (
        <ol className={itemClass} ref={li => this._listItem = li }>
          <input type="text" value={text} className="form-check-label" style={{ backgroundColor: this.state.rbgColor }} onChange={this.handleChange} readOnly={this.state.contenteditable} />
            <input type="button" value="Complete" className="form-check-input" onClick={this.markCompleted}/>
          <button type="button" className="btn btn-danger btn-sm" onClick={this.deleteItem}>Remove</button>
          <button type="button" className="jee" onClick={this.edit}>{this.state.editLable}</button>
        </ol>
      );
    }
  }
  
  class TodoList extends React.Component {
    render() {
      return (
        <ul className="todolist">
          {this.props.items.map(item => (
            <TodoItem key={item.id} id={item.id} text={item.text} completed={item.done} onItemCompleted={this.props.onItemCompleted} onDeleteItem={this.props.onDeleteItem} />
          ))}
        </ul>
      );
    }
  }
  

