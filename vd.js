
(function(global) {

  class VNode {
    constructor(tag, data, children) {
      this.tag = tag;
      this.data = data;
      this.children = children;
      this.elm = ''
      // text属性用于标志Vnode节点没有其他子节点，只有纯文本
      this.text = util._isPrimitive(this.children) ? this.children : ''
    }
  }

  class Util {
    constructor() {}

    // 检测基础类型
    _isPrimitive(value) {
      return (typeof value === 'string' || typeof value === 'number' || typeof value === 'symbol' || typeof value === 'boolean')
    }

    _isDef(v) {
      return v !== undefined && v !== null
    }

  }




  class Vn {
    constructor() {
      this.el = ''
    }

    // 设置属性值
    _setAttrs(el, data) {
      if(!el) return
      const attrs = data.attrs;
      if(!attrs) return;
      Object.keys(attrs).forEach(a => {
        el.setAttribute(a, attrs[a]);
      })
    }

    // 创建虚拟Vnode
    createVnode(tag, data, children) {
      return new VNode(tag, data, children)
    }

    // 创建真实DOM
    createElement(vnode, options) {
      let _createElement = function (vnode) {
        const { tag, data, children } = vnode;
        const ele = document.createElement(tag);
        this._setAttrs(ele, data)
        if (util._isPrimitive(children)) {
          const testEle = document.createTextNode(children);
          ele.appendChild(testEle);
          return ele
        }
        children.map(_createElement.bind(this)).forEach(e => {
          ele.appendChild(e)
        });
        return ele
      }
      const e = _createElement.call(this, vnode);
      var rootEl = document.body;
      if (options.el && typeof options.el === 'string') {
        rootEl = document.querySelector(options.el);
        
      }
      
      
      rootEl.appendChild(e)
      this.el = rootEl.childNodes[0];
      vnode.elm = this.el;
    }

    // 创建dom
    createElm(el, vnode) {
      let tag = vnode.tag;
      const ele = document.createElement(tag);
      this._setAttrs(ele, vnode.data);
      const testEle = document.createTextNode(vnode.children);
      ele.appendChild(testEle)
      el.parentNode.insertBefore(ele, el.nextSibling)
    }

    // 比较两个Vnode的区别
    diffVnode(nVnode, oVnode) {
      if (!this._sameVnode(nVnode, oVnode)) return
      this.generateElm(oVnode)
      this.patchVnode(nVnode, oVnode);
    }

    generateElm(vnode) {
      const traverseTree = (v, parentEl) => {
        let children = v.children;
        if(Array.isArray(children)) {
          children.forEach((c, i) => {
            c.elm = parentEl.childNodes[i];
            traverseTree(c, c.elm)
          })
        }
      }
      traverseTree(vnode, this.el);
    }

    patchVnode(nVnode, oVnode) {
      let ele = oVnode.elm
      if(nVnode.text && nVnode.text !== oVnode) {
        // 子节点为文本节点
        ele.textContent = nVnode.text;
      } else {
        const oldCh = oVnode.children;
        const newCh = nVnode.children;
        if (util._isDef(oldCh) && util._isDef(newCh)) {
          this.updateChildren(ele, newCh, oldCh)
        } else if (util._isDef(oldCh)) {
          // 新节点没有子节点
        } else {
          // 老节点没有子节点
        }
      }
    }

    updateChildren(el, newCh, oldCh) {
      let newStartIndex = 0;
      let oldStartIndex = 0;
      let newEndIndex = newCh.length - 1;
      let oldEndIndex = oldCh.length - 1;
      let oldKeyToId;

      let newStartVnode = newCh[newStartIndex];
      let oldStartVnode = oldCh[oldStartIndex];
      let newEndVnode = newCh[newEndIndex];
      let oldEndVnode = oldCh[oldEndIndex];
      while (newStartIndex <= newEndIndex && oldStartIndex <= oldEndIndex) {
        debugger
        if (this._sameVnode(newStartVnode, oldStartVnode)) {
          this.patchVnode(newCh[newStartIndex], oldCh[oldStartIndex]);
          newStartVnode = newCh[++newStartIndex];
          oldStartVnode = oldCh[++oldStartIndex]
        } else if (this._sameVnode(newEndVnode, oldEndVnode)) {
          this.patchVnode(newCh[newEndIndex], oldCh[oldEndIndex])
          oldEndVnode = oldCh[--oldEndIndex];
          newEndVnode = newCh[--newEndIndex]
        } else if (this._sameVnode(newEndVnode, oldStartVnode)) {
          this.patchVnode(newCh[newEndIndex], oldCh[oldStartIndex])
          // 旧的oldStartVnode移动到尾部
          el.insertBefore(oldCh[oldStartIndex].elm, null);
          oldStartVnode = oldCh[++oldStartIndex];
          newEndVnode = newCh[--newEndIndex];
        } else if (this._sameVnode(newStartIndex, oldEndIndex)) {
          this.patchVnode(newCh[newStartIndex], oldCh[oldEndIndex]);
          el.insertBefore(oldCh[oldEndIndex].elm, oldCh[oldStartIndex].elm);
          oldEndVnode = oldCh[--oldEndIndex];
          newStartVnode = newCh[++newStartIndex];
        } else {
          if (!oldKeyToId) oldKeyToId = this.createKeyMap(oldCh, oldStartIndex, oldEndIndex);
          util._isDef(newStartVnode.key) ? oldKeyToId[newStartVnode.key] : this.findIdxFromVnode(newCh, )
        }
      }
      if(oldEndIndex <= oldStartIndex) {
        for (let i = newStartIndex; i <= newEndIndex; i++) {
          // 批量增加节点
          this.createElm(oldCh[oldEndIndex].elm, newCh[i])
        }
      }
    }

    _sameVnode(n, o) {
      return n.tag === o.tag;
    }

    createKeyMap(oldCh, start, old) {
      const map = {};
      for(let i = start; i < old; i++) {
        if(oldCh.key) map[key] = i;
      }
      return map;
    }

    findIdxFromVnode()
  }
  

  // class Diff {
  //   constructor(newVnode, preVnode) {
  //     this.nVnode = newVnode;
  //     this.preVode = preVnode;
  //   }
  // }
  const util = new Util()
  global.vn = new Vn()
}(this))