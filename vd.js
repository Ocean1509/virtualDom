
(function(global) {

  function VNode(tag, data, children) {
    this.tag = tag;
    this.data = data;
    this.children = children;
  }

  var vn = function (obj) {
    if (!(this instanceof _)) {
      return new _(obj)
    }
  }
  var vn;

  vn._flattenChildren = function (children) {
    if(Array.isArray(children)) {
      return Array.prototype.concat([], children)
    } else {
      return children
    }
  }
  vn.createVnode = function (tag, data, children) {
    return new VNode(tag, data, vn._flattenChildren(children))
  }

  vn.createElement = function (vnode, options) {
    let _createElement = function (vnode) {
      const { tag, data, children } = vnode;
      const ele = document.createElement(tag);
      if(typeof children === 'string') {
        const testEle = document.createTextNode(children);
        ele.appendChild(testEle);
        return ele
      }
      children.map(_createElement).forEach(e => {
        ele.appendChild(e)
      });
      return ele
    }
    const e = _createElement(vnode);
    var rootEl = document.body;
    if (options.el && typeof options.el === 'string') rootEl = document.querySelector(options.el);

    rootEl.appendChild(e)
  }

  global.vn = vn
}(this))