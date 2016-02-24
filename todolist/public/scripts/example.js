var ContentEditable = React.createClass({
    render: function(){
        return <span id={this.props.html.__idtodo}
            className="todotext" 
            onInput={this.emitChange} 
            onBlur={this.sendChange}
            contentEditable
            dangerouslySetInnerHTML={this.props.html}></span>;
    },
    shouldComponentUpdate: function(nextProps){
        return nextProps.html !== ReactDOM.findDOMNode(this).innerHTML;
    },
    sendChange: function(){
        var html = ReactDOM.findDOMNode(this).innerHTML;
        var id = ReactDOM.findDOMNode(this).getAttribute("id")
        var text = html.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");
        var text_final = text.replace("\n","");
        if (this.props.onChange && html !== this.lastHtml) {
            this.props.onChange({
                target: {
                    value: html
                }
            });
        }
        this.lastHtml = html;
        $.ajax({
            url: "/api/todos/"+id,
            dataType: 'json',
            type: 'POST',
            data: {'todoitem' : text_final}
        });
    },
    emitChange: function(){
        var html = ReactDOM.findDOMNode(this).innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {
            this.props.onChange({
                target: {
                    value: html
                }
            });
        }
        this.lastHtml = html;
    }
});

var DoneButton = React.createClass({
    render: function(){
      // console.log(this.props)
        return <button id={this.props.html.__idtodo} onClick={this.deletetodo}>
          <span>X</span>
        </button>
    },
    deletetodo: function(){
        var id = ReactDOM.findDOMNode(this).getAttribute("id")
        $.ajax({
            url: "/api/todos/completed/"+id,
            dataType: 'json',
            type: 'POST',
            success: function(data) {
              console.log(data)
              this.props.html.__this_parent.onUpdate(data);
            }.bind(this)
        });
    }
});

var Todo = React.createClass({
  rawMarkup: function() {
    var this_parent = this.props.children[1];
    var rawMarkup = marked(this.props.children[0].todoitem.toString(), {sanitize: true});
    var idtodo = this.props.children[0]._id;
    console.log(this_parent)
    return { __html: rawMarkup, __idtodo: idtodo, __this_parent: this_parent};
  },
  render: function() {
      var handleChange = function(event){
        this.setState({html: event.target.value});
      }.bind(this);
    return (
      <div className="todo">
        <div id="progress-button" className="progress-button">
          <DoneButton html={this.rawMarkup()}/>
        </div>
        <ContentEditable html={this.rawMarkup()} onChange={handleChange} />
        <br/>
      </div>
    );
  }
});

var TodoBox = React.createClass({
  onUpdate: function(val) {
      this.setState({
          data: val
      });
  },
  loadTodosFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleTodoSubmit: function(todo) {
    var todos = this.state.data;
    // Optimistically set an id on the new todo. It will be replaced by an
    // id generated by the server. In a production application you would likely
    // not use Date.now() for this and would have a more robust system in place.
    var newTodos = todos.concat([todo]);
    this.setState({data: newTodos});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: todo,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: todos});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadTodosFromServer();
    // setInterval(this.loadTodosFromServer, this.props.pollInterval);
  },
  showAll: function() {
    $.ajax({
      url: this.props.url+"/all/",
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: todos});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  showAllActive: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: todos});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  showAllCompleted: function() {
    $.ajax({
      url: this.props.url+"/completed/",
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: todos});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="todoBox">
        <h1>To Do List
        <div id="filter-button" className="filter-button">
          <button onClick={this.showAll}>All</button>
        </div>
        <div id="filter-button" className="filter-button">
          <button onClick={this.showAllActive}>Active</button>
        </div>
        <div id="filter-button" className="filter-button">
          <button onClick={this.showAllCompleted}>Completed</button>
        </div>
        </h1>
        <TodoForm onTodoSubmit={this.handleTodoSubmit} />
        <TodoList srcs={this} data={this.state.data} />
      </div>
    );
  }
});

var TodoList = React.createClass({
  render: function() {
    var parent_this = this.props.srcs;
    var todoNodes = this.props.data.map(function(todo, index) {
      return (
        <Todo author="cynthia" key={index}>
          {todo}{parent_this}
        </Todo>
      );
    });
    return (
      <div className="TodoList">
        {todoNodes}
      </div>
    );
  }
});

var TodoForm = React.createClass({
  getInitialState: function() {
    return {todoitem: ''};
  },
  handleTextChange: function(e) {
    this.setState({todoitem: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var todoitem = this.state.todoitem.trim();
    if (!todoitem) {
      return;
    }
    this.props.onTodoSubmit({todoitem: todoitem});
    this.setState({todoitem: ''});
  },
  render: function() {
    return (
      <form className="todoForm basic-grey" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="To Do Item"
          value={this.state.todoitem}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

ReactDOM.render(
  <TodoBox url="/api/todos" pollInterval={2000} />,
  document.getElementById('content')
);
