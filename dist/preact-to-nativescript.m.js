function VNode() {}

function h(nodeName, attributes) {
    var arguments$1 = arguments;

    var lastSimple, child, simple, i, children = EMPTY_CHILDREN;
    for (i = arguments.length; i-- > 2; ) 
        { stack.push(arguments$1[i]); }
    if (attributes && null != attributes.children) {
        if (!stack.length) 
            { stack.push(attributes.children); }
        delete attributes.children;
    }
    while (stack.length) 
        { if ((child = stack.pop()) && void 0 !== child.pop) 
        { for (i = child.length; i--; ) 
        { stack.push(child[i]); } }
     else {
        if ('boolean' == typeof child) 
            { child = null; }
        if (simple = 'function' != typeof nodeName) 
            { if (null == child) 
            { child = ''; }
         else if ('number' == typeof child) 
            { child = String(child); }
         else if ('string' != typeof child) 
            { simple = !1; } }
        if (simple && lastSimple) 
            { children[children.length - 1] += child; }
         else if (children === EMPTY_CHILDREN) 
            { children = [child]; }
         else 
            { children.push(child); }
        lastSimple = simple;
    } }
    var p = new VNode();
    p.nodeName = nodeName;
    p.children = children;
    p.attributes = null == attributes ? void 0 : attributes;
    p.key = null == attributes ? void 0 : attributes.key;
    if (void 0 !== options.vnode) 
        { options.vnode(p); }
    return p;
}

function extend(obj, props) {
    for (var i in props) 
        { obj[i] = props[i]; }
    return obj;
}

function cloneElement(vnode, props) {
    return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
}

function enqueueRender(component) {
    if (!component.__d && (component.__d = !0) && 1 == items.push(component)) 
        { (options.debounceRendering || defer)(rerender); }
}

function rerender() {
    var p, list = items;
    items = [];
    while (p = list.pop()) 
        { if (p.__d) 
        { renderComponent(p); } }
}

function isSameNodeType(node, vnode, hydrating) {
    if ('string' == typeof vnode || 'number' == typeof vnode) 
        { return void 0 !== node.splitText; }
    if ('string' == typeof vnode.nodeName) 
        { return !node._componentConstructor && isNamedNode(node, vnode.nodeName); }
     else 
        { return hydrating || node._componentConstructor === vnode.nodeName; }
}

function isNamedNode(node, nodeName) {
    return node.__n === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

function getNodeProps(vnode) {
    var props = extend({}, vnode.attributes);
    props.children = vnode.children;
    var defaultProps = vnode.nodeName.defaultProps;
    if (void 0 !== defaultProps) 
        { for (var i in defaultProps) 
        { if (void 0 === props[i]) 
        { props[i] = defaultProps[i]; } } }
    return props;
}

function createNode(nodeName, isSvg) {
    var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
    node.__n = nodeName;
    return node;
}

function removeNode(node) {
    var parentNode = node.parentNode;
    if (parentNode) 
        { parentNode.removeChild(node); }
}

function setAccessor(node, name, old, value, isSvg) {
    if ('className' === name) 
        { name = 'class'; }
    if ('key' === name) 
        {  }
     else if ('ref' === name) {
        if (old) 
            { old(null); }
        if (value) 
            { value(node); }
    } else if ('class' === name && !isSvg) 
        { node.className = value || ''; }
     else if ('style' === name) {
        if (!value || 'string' == typeof value || 'string' == typeof old) 
            { node.style.cssText = value || ''; }
        if (value && 'object' == typeof value) {
            if ('string' != typeof old) 
                { for (var i in old) 
                { if (!(i in value)) 
                { node.style[i] = ''; } } }
            for (var i in value) 
                { node.style[i] = 'number' == typeof value[i] && !1 === IS_NON_DIMENSIONAL.test(i) ? value[i] + 'px' : value[i]; }
        }
    } else if ('dangerouslySetInnerHTML' === name) {
        if (value) 
            { node.innerHTML = value.__html || ''; }
    } else if ('o' == name[0] && 'n' == name[1]) {
        var useCapture = name !== (name = name.replace(/Capture$/, ''));
        name = name.substring(2, 3).toLowerCase() + name.substring(3);
        if (value) {
            if (!old) 
                { node.addEventListener(name, eventProxy, node); }
        } else 
            { node.removeEventListener(name, eventProxy, node); }
        (node.__l || (node.__l = {}))[name] = value;
    } else if ('list' !== name && 'type' !== name && !isSvg && name in node) {
        setProperty(node, name, null == value ? '' : value);
        if (null == value || !1 === value) 
            { node.removeAttribute(name); }
    } else {
        var ns = isSvg && name !== (name = name.replace(/^xlink\:?/, ''));
        if (null == value || !1 === value) 
            { if (ns) 
            { node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase()); }
         else 
            { node.removeAttribute(name); } }
         else if ('function' != typeof value) 
            { if (ns) 
            { node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value); }
         else 
            { node.setAttribute(name, value); } }
    }
}

function setProperty(node, name, value) {
    try {
        node[name] = value;
    } catch (e) {}
}

function eventProxy(e) {
    var type = e.type ? e.type : e.eventName;
    return this.__l[type](options.event && options.event(e) || e);
}

function flushMounts() {
    var c;
    while (c = mounts.pop()) {
        if (options.afterMount) 
            { options.afterMount(c); }
        if (c.componentDidMount) 
            { c.componentDidMount(); }
    }
}

function diff(dom, vnode, context, mountAll, parent, componentRoot) {
    if (!diffLevel++) {
        isSvgMode = null != parent && void 0 !== parent.ownerSVGElement;
        hydrating = null != dom && !('__preactattr_' in dom);
    }
    var ret = idiff(dom, vnode, context, mountAll, componentRoot);
    if (parent && ret.parentNode !== parent) 
        { parent.appendChild(ret); }
    if (!--diffLevel) {
        hydrating = !1;
        if (!componentRoot) 
            { flushMounts(); }
    }
    return ret;
}

function idiff(dom, vnode, context, mountAll, componentRoot) {
    var out = dom, prevSvgMode = isSvgMode;
    if (null == vnode || 'boolean' == typeof vnode) 
        { vnode = ''; }
    if ('string' == typeof vnode || 'number' == typeof vnode) {
        if (dom && void 0 !== dom.splitText && dom.parentNode && (!dom._component || componentRoot)) {
            if (dom.nodeValue != vnode) 
                { dom.nodeValue = vnode; }
        } else {
            out = document.createTextNode(vnode);
            if (dom) {
                if (dom.parentNode) 
                    { dom.parentNode.replaceChild(out, dom); }
                recollectNodeTree(dom, !0);
            }
        }
        out.__preactattr_ = !0;
        return out;
    }
    var vnodeName = vnode.nodeName;
    if ('function' == typeof vnodeName) 
        { return buildComponentFromVNode(dom, vnode, context, mountAll); }
    isSvgMode = 'svg' === vnodeName ? !0 : 'foreignObject' === vnodeName ? !1 : isSvgMode;
    vnodeName = String(vnodeName);
    if (!dom || !isNamedNode(dom, vnodeName)) {
        out = createNode(vnodeName, isSvgMode);
        if (dom) {
            while (dom.firstChild) 
                { out.appendChild(dom.firstChild); }
            if (dom.parentNode) 
                { dom.parentNode.replaceChild(out, dom); }
            recollectNodeTree(dom, !0);
        }
    }
    var fc = out.firstChild, props = out.__preactattr_, vchildren = vnode.children;
    if (null == props) {
        props = (out.__preactattr_ = {});
        for (var a = out.attributes, i = a.length;i--; ) 
            { props[a[i].name] = a[i].value; }
    }
    if (!hydrating && vchildren && 1 === vchildren.length && 'string' == typeof vchildren[0] && null != fc && void 0 !== fc.splitText && null == fc.nextSibling) {
        if (fc.nodeValue != vchildren[0]) 
            { fc.nodeValue = vchildren[0]; }
    } else if (vchildren && vchildren.length || null != fc) 
        { innerDiffNode(out, vchildren, context, mountAll, hydrating || null != props.dangerouslySetInnerHTML); }
    diffAttributes(out, vnode.attributes, props);
    isSvgMode = prevSvgMode;
    return out;
}

function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
    var j, c, f, vchild, child, originalChildren = dom.childNodes, children = [], keyed = {}, keyedLen = 0, min = 0, len = originalChildren.length, childrenLen = 0, vlen = vchildren ? vchildren.length : 0;
    if (0 !== len) 
        { for (var i = 0;i < len; i++) {
        var _child = originalChildren[i], props = _child.__preactattr_, key = vlen && props ? _child._component ? _child._component.__k : props.key : null;
        if (null != key) {
            keyedLen++;
            keyed[key] = _child;
        } else if (props || (void 0 !== _child.splitText ? isHydrating ? _child.nodeValue.trim() : !0 : isHydrating)) 
            { children[childrenLen++] = _child; }
    } }
    if (0 !== vlen) 
        { for (var i = 0;i < vlen; i++) {
        vchild = vchildren[i];
        child = null;
        var key = vchild.key;
        if (null != key) {
            if (keyedLen && void 0 !== keyed[key]) {
                child = keyed[key];
                keyed[key] = void 0;
                keyedLen--;
            }
        } else if (!child && min < childrenLen) 
            { for (j = min; j < childrenLen; j++) 
            { if (void 0 !== children[j] && isSameNodeType(c = children[j], vchild, isHydrating)) {
            child = c;
            children[j] = void 0;
            if (j === childrenLen - 1) 
                { childrenLen--; }
            if (j === min) 
                { min++; }
            break;
        } } }
        child = idiff(child, vchild, context, mountAll);
        f = originalChildren[i];
        if (child && child !== dom && child !== f) 
            { if (null == f) 
            { dom.appendChild(child); }
         else if (child === f.nextSibling) 
            { removeNode(f); }
         else 
            { dom.insertBefore(child, f); } }
    } }
    if (keyedLen) 
        { for (var i in keyed) 
        { if (void 0 !== keyed[i]) 
        { recollectNodeTree(keyed[i], !1); } } }
    while (min <= childrenLen) 
        { if (void 0 !== (child = children[childrenLen--])) 
        { recollectNodeTree(child, !1); } }
}

function recollectNodeTree(node, unmountOnly) {
    var component = node._component;
    if (component) 
        { unmountComponent(component); }
     else {
        if (null != node.__preactattr_ && node.__preactattr_.ref) 
            { node.__preactattr_.ref(null); }
        if (!1 === unmountOnly || null == node.__preactattr_) 
            { removeNode(node); }
        removeChildren(node);
    }
}

function removeChildren(node) {
    node = node.lastChild;
    while (node) {
        var next = node.previousSibling;
        recollectNodeTree(node, !0);
        node = next;
    }
}

function diffAttributes(dom, attrs, old) {
    var name;
    for (name in old) 
        { if ((!attrs || null == attrs[name]) && null != old[name]) 
        { setAccessor(dom, name, old[name], old[name] = void 0, isSvgMode); } }
    for (name in attrs) 
        { if (!('children' === name || 'innerHTML' === name || name in old && attrs[name] === ('value' === name || 'checked' === name ? dom[name] : old[name]))) 
        { setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode); } }
}

function collectComponent(component) {
    var name = component.constructor.name;
    (components[name] || (components[name] = [])).push(component);
}

function createComponent(Ctor, props, context) {
    var inst, list = components[Ctor.name];
    if (Ctor.prototype && Ctor.prototype.render) {
        inst = new Ctor(props, context);
        Component.call(inst, props, context);
    } else {
        inst = new Component(props, context);
        inst.constructor = Ctor;
        inst.render = doRender;
    }
    if (list) 
        { for (var i = list.length;i--; ) 
        { if (list[i].constructor === Ctor) {
        inst.__b = list[i].__b;
        list.splice(i, 1);
        break;
    } } }
    return inst;
}

function doRender(props, state, context) {
    return this.constructor(props, context);
}

function setComponentProps(component, props, opts, context, mountAll) {
    if (!component.__x) {
        component.__x = !0;
        if (component.__r = props.ref) 
            { delete props.ref; }
        if (component.__k = props.key) 
            { delete props.key; }
        if (!component.base || mountAll) {
            if (component.componentWillMount) 
                { component.componentWillMount(); }
        } else if (component.componentWillReceiveProps) 
            { component.componentWillReceiveProps(props, context); }
        if (context && context !== component.context) {
            if (!component.__c) 
                { component.__c = component.context; }
            component.context = context;
        }
        if (!component.__p) 
            { component.__p = component.props; }
        component.props = props;
        component.__x = !1;
        if (0 !== opts) 
            { if (1 === opts || !1 !== options.syncComponentUpdates || !component.base) 
            { renderComponent(component, 1, mountAll); }
         else 
            { enqueueRender(component); } }
        if (component.__r) 
            { component.__r(component); }
    }
}

function renderComponent(component, opts, mountAll, isChild) {
    if (!component.__x) {
        var rendered, inst, cbase, props = component.props, state = component.state, context = component.context, previousProps = component.__p || props, previousState = component.__s || state, previousContext = component.__c || context, isUpdate = component.base, nextBase = component.__b, initialBase = isUpdate || nextBase, initialChildComponent = component._component, skip = !1;
        if (isUpdate) {
            component.props = previousProps;
            component.state = previousState;
            component.context = previousContext;
            if (2 !== opts && component.shouldComponentUpdate && !1 === component.shouldComponentUpdate(props, state, context)) 
                { skip = !0; }
             else if (component.componentWillUpdate) 
                { component.componentWillUpdate(props, state, context); }
            component.props = props;
            component.state = state;
            component.context = context;
        }
        component.__p = (component.__s = (component.__c = (component.__b = null)));
        component.__d = !1;
        if (!skip) {
            rendered = component.render(props, state, context);
            if (component.getChildContext) 
                { context = extend(extend({}, context), component.getChildContext()); }
            var toUnmount, base, childComponent = rendered && rendered.nodeName;
            if ('function' == typeof childComponent) {
                var childProps = getNodeProps(rendered);
                inst = initialChildComponent;
                if (inst && inst.constructor === childComponent && childProps.key == inst.__k) 
                    { setComponentProps(inst, childProps, 1, context, !1); }
                 else {
                    toUnmount = inst;
                    component._component = (inst = createComponent(childComponent, childProps, context));
                    inst.__b = inst.__b || nextBase;
                    inst.__u = component;
                    setComponentProps(inst, childProps, 0, context, !1);
                    renderComponent(inst, 1, mountAll, !0);
                }
                base = inst.base;
            } else {
                cbase = initialBase;
                toUnmount = initialChildComponent;
                if (toUnmount) 
                    { cbase = (component._component = null); }
                if (initialBase || 1 === opts) {
                    if (cbase) 
                        { cbase._component = null; }
                    base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, !0);
                }
            }
            if (initialBase && base !== initialBase && inst !== initialChildComponent) {
                var baseParent = initialBase.parentNode;
                if (baseParent && base !== baseParent) {
                    baseParent.replaceChild(base, initialBase);
                    if (!toUnmount) {
                        initialBase._component = null;
                        recollectNodeTree(initialBase, !1);
                    }
                }
            }
            if (toUnmount) 
                { unmountComponent(toUnmount); }
            component.base = base;
            if (base && !isChild) {
                var componentRef = component, t = component;
                while (t = t.__u) 
                    { (componentRef = t).base = base; }
                base._component = componentRef;
                base._componentConstructor = componentRef.constructor;
            }
        }
        if (!isUpdate || mountAll) 
            { mounts.unshift(component); }
         else if (!skip) {
            if (component.componentDidUpdate) 
                { component.componentDidUpdate(previousProps, previousState, previousContext); }
            if (options.afterUpdate) 
                { options.afterUpdate(component); }
        }
        if (null != component.__h) 
            { while (component.__h.length) 
            { component.__h.pop().call(component); } }
        if (!diffLevel && !isChild) 
            { flushMounts(); }
    }
}

function buildComponentFromVNode(dom, vnode, context, mountAll) {
    var c = dom && dom._component, originalComponent = c, oldDom = dom, isDirectOwner = c && dom._componentConstructor === vnode.nodeName, isOwner = isDirectOwner, props = getNodeProps(vnode);
    while (c && !isOwner && (c = c.__u)) 
        { isOwner = c.constructor === vnode.nodeName; }
    if (c && isOwner && (!mountAll || c._component)) {
        setComponentProps(c, props, 3, context, mountAll);
        dom = c.base;
    } else {
        if (originalComponent && !isDirectOwner) {
            unmountComponent(originalComponent);
            dom = (oldDom = null);
        }
        c = createComponent(vnode.nodeName, props, context);
        if (dom && !c.__b) {
            c.__b = dom;
            oldDom = null;
        }
        setComponentProps(c, props, 1, context, mountAll);
        dom = c.base;
        if (oldDom && dom !== oldDom) {
            oldDom._component = null;
            recollectNodeTree(oldDom, !1);
        }
    }
    return dom;
}

function unmountComponent(component) {
    if (options.beforeUnmount) 
        { options.beforeUnmount(component); }
    var base = component.base;
    component.__x = !0;
    if (component.componentWillUnmount) 
        { component.componentWillUnmount(); }
    component.base = null;
    var inner = component._component;
    if (inner) 
        { unmountComponent(inner); }
     else if (base) {
        if (base.__preactattr_ && base.__preactattr_.ref) 
            { base.__preactattr_.ref(null); }
        component.__b = base;
        removeNode(base);
        collectComponent(component);
        removeChildren(base);
    }
    if (component.__r) 
        { component.__r(null); }
}

function Component(props, context) {
    this.__d = !0;
    this.context = context;
    this.props = props;
    this.state = this.state || {};
}

function render$2(vnode, parent, merge) {
    return diff(merge, vnode, {}, !1, parent, !1);
}

var options = {};
var stack = [];
var EMPTY_CHILDREN = [];
var defer = 'function' == typeof Promise ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;
var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
var items = [];
var mounts = [];
var diffLevel = 0;
var isSvgMode = !1;
var hydrating = !1;
var components = {};
extend(Component.prototype, {
    setState: function (state, callback) {
        var s = this.state;
        if (!this.__s) 
            { this.__s = extend({}, s); }
        extend(s, 'function' == typeof state ? state(s, this.props) : state);
        if (callback) 
            { (this.__h = this.__h || []).push(callback); }
        enqueueRender(this);
    },
    forceUpdate: function (callback) {
        if (callback) 
            { (this.__h = this.__h || []).push(callback); }
        renderComponent(this, 2);
    },
    render: function () {}
});
var preact = {
    h: h,
    createElement: h,
    cloneElement: cloneElement,
    Component: Component,
    render: render$2,
    rerender: rerender,
    options: options,
    unmountComponent: unmountComponent
};






var preact$2 = {
	default: preact,
	h: h,
	cloneElement: cloneElement,
	Component: Component,
	render: render$2,
	rerender: rerender,
	options: options,
	unmountComponent: unmountComponent
};

function findWhere(arr, fn, returnIndex) {
    var i = arr.length;
    while (i--) 
        { if (typeof fn === "function" ? fn(arr[i]) : arr[i] === fn) 
        { break; } }
    return returnIndex ? i : arr[i];
}

function noOp() {
    return null;
}

var extensions = {
    setAttribute: function setAttribute(name, value) {
        this.set(name, value);
    },
    getAttribute: function getAttribute(name) {
        return this[name];
    },
    removeAttribute: function removeAttribute(name) {
        this.set(name, null);
    },
    getAttributeNS: function getAttributeNS(ignored, name, value) {
        return this[name];
    },
    setAttributeNS: function setAttributeNS(ignored, name, value) {
        this.set(name, value);
    },
    removeAttributeNS: function removeAttributeNS(ns, name) {
        delete this[name];
    },
    callAddChild: function callAddChild(child, offset) {
        if (this.nodeName === "SEGMENTEDBAR" || this.nodeName === "TABVIEW") {
            this.items = this.childNodes.slice(0);
        } else if (this.nodeName === "TABVIEWITEM") {
            this.view = child;
        } else if (this.nodeName === "PAGE") {
            if (child.nodeName === "ACTIONBAR") {
                this.actionBar = child;
            } else {
                this.content = child;
            }
        } else if (this.nodeName === "ACTIONBAR") {
            if (child.nodeName === "ACTIONITEM") {
                this.actionItems.addItem(child);
            } else if (child.nodeName === "NAVIGATIONBUTTON") {
                this.navigationButton = child;
            } else {
                this.titleView = child;
            }
        } else if (this.nodeName === "ACTIONITEM" || this.nodeName === "NAVIGATIONBUTTON") {
            this.actionView = child;
        } else if (this.nodeName === "SCROLLVIEW") {
            this.content = child;
        } else {
            this.addChild(child, offset);
        }
    },
    appendChild: function appendChild(child) {
        if ("text" in this && child.splitText !== null) {
            this.text = child.nodeValue;
        } else {
            this.childNodes.push(child);
            child.parentNode = this;
        }
        this.callAddChild(child);
    },
    insertBefore: function insertBefore(child, ref) {
        child.remove();
        var offset = this.childNodes.indexOf(ref);
        child.parentNode = this;
        if (offset !== undefined && offset !== null && offset !== -1) {
            this.childNodes.splice(offset, 0, child);
            this.callAddChild(child, offset);
        } else {
            this.childNodes.push(child);
            this.callAddChild(child);
        }
    },
    replaceChild: function replaceChild(child, ref) {
        if (ref.parentNode === this) {
            ref.remove();
            this.insertBefore(child, ref);
        }
    },
    callRemoveChild: function callRemoveChild(child) {
        if (this.nodeName === "SEGMENTEDBAR") {
            this.items = this.childNodes.slice(0);
        } else if (this.nodeName === "PAGE") {
            if (child.nodeName === "ACTIONBAR") {
                if (this.actionBar === child) {
                    this.actionBar = null;
                }
            } else if (this.content === child) {
                this.content = null;
            }
        } else if (this.nodeName === "ACTIONBAR") {
            if (child.nodeName === "ACTIONITEM") {
                this.actionItems.removeItem(child);
            } else if (child.nodeName === "NAVIGATIONBUTTON") {
                if (this.navigationButton === child) {
                    this.navigationButton = null;
                }
            } else {
                this.titleView = null;
            }
        } else if (this.nodeName === "ACTIONITEM" || this.nodeName === "NAVIGATIONBUTTON") {
            this.actionView = null;
        } else if (this.nodeName === "SCROLLVIEW") {
            this.content = null;
        } else {
            if (this.removeChild === undefined || this.removeChild === null) {
                this._removeView(child);
            } else {
                this.removeChild(child);
            }
        }
    },
    removeChild: function removeChild(child) {
        if ("text" in this && child.splitText !== null) {
            this.text = "";
        } else {
            var childIndex = this.childNodes.indexOf(child);
            if (childIndex !== -1) {
                this.childNodes.splice(childIndex, 1);
            }
            this.callRemoveChild(child);
        }
        child.parentNode = null;
    },
    remove: function remove() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
            this.parentNode = null;
        }
    },
    remount: function remount() {}
};
var isUpperCase = function (inspect) { return inspect === inspect.toUpperCase(); };
var convertType = function (type) {
    if (type.toLowerCase() === "tabviewitem") {
        return "tab-view";
    }
    if (type.toLowerCase() === "segmentedbaritem") {
        return "segmented-bar";
    }
    if (type.toLowerCase() === "actionitem" || type.toLowerCase() === "navigationbutton") {
        return "action-bar";
    }
    var newType = "";
    for (var i = 0;i < type.length; i++) {
        var char = type.charAt(i);
        newType += isUpperCase(char) ? ("-" + (char.toLowerCase())) : char;
    }
    return newType;
};
var nodeValueGetSet = {
    set: function set(v) {
        this.text = v;
    },
    get: function get() {
        return this.text;
    }
};
var document$1 = {
    createElement: function createElement(type) {
        if (type === "undefined") {
            type = "stackLayout";
        }
        var originalType = type;
        type = type.toLowerCase();
        var NativeElement;
        if (type in types) {
            NativeElement = types[type];
        } else {
            var elementRequirePath = "tns-core-modules/ui/";
            if (type.indexOf("layout") !== -1) {
                elementRequirePath += "layouts/";
            }
            elementRequirePath += convertType(originalType);
            var m = require(elementRequirePath);
            for (var i in m) {
                if (i.toLowerCase() === type) {
                    NativeElement = m[i];
                    break;
                }
            }
            Object.assign(NativeElement.prototype, extensions);
            types[type] = NativeElement;
        }
        NativeElement = new NativeElement();
        NativeElement.loaded = false;
        NativeElement.firstLoad = true;
        NativeElement.nodeType = 1;
        NativeElement.nodeName = type.toUpperCase();
        NativeElement.attributes = [];
        NativeElement.childNodes = [];
        NativeElement.set = (function (name, value) {
            NativeElement[name] = value;
        });
        Object.defineProperty(NativeElement, "firstChild", {
            get: function get() {
                return this.childNodes[0];
            }
        });
        Object.defineProperty(NativeElement, "lastChild", {
            get: function get() {
                return this.childNodes[this.childNodes.length - 1];
            }
        });
        Object.defineProperty(NativeElement, "nextSibling", {
            get: function get() {
                var p = this.parentNode;
                if (p) {
                    return p.childNodes[findWhere(p.childNodes, this, true) + 1];
                }
            }
        });
        Object.defineProperty(NativeElement, "previousSibling", {
            get: function get() {
                var p = this.parentNode;
                if (p) {
                    return p.childNodes[findWhere(p.childNodes, this, true) - 1];
                }
            }
        });
        return NativeElement;
    },
    createTextNode: function createTextNode(text) {
        var el = document$1.createElement("label");
        el.text = text;
        Object.defineProperty(el, "nodeValue", nodeValueGetSet);
        el.splitText = noOp;
        return el;
    }
};
global.document = document$1;
var types = {};
var render = function (Component$$1, parent, merge) {
    if (parent === undefined || parent === null) {
        parent = {
            nodeType: "artificalParent",
            nodeName: "artificalParent",
            attributes: [],
            childNodes: [],
            renderedComponent: null,
            mergeInto: null,
            renderedInto: null,
            appendChild: function (newChild) {
                if (newChild.cssFile) {
                    newChild.addCssFile(newChild.cssFile);
                }
                parent.childNodes.push(newChild);
                newChild.parentNode = parent;
                newChild.renderedComponent = parent.renderedComponent;
                newChild.mergeInto = parent.mergeInto;
            },
            removeChild: function (child) {
                var childIndex = parent.childNodes.indexOf(child);
                if (childIndex !== -1) {
                    parent.childNodes.splice(childIndex, 1);
                }
            },
            remove: function () {}
        };
    }
    parent.renderedComponent = Component$$1;
    parent.mergeInto = merge;
    var renderedInto = render$2(Component$$1, parent, merge);
    for (var i = 0, list = parent.childNodes; i < list.length; i += 1) {
        var child = list[i];

        child.renderedInto = renderedInto;
    }
    return parent.childNodes[0];
};

export { preact$2 as Preact, render, nodeValueGetSet, findWhere, noOp };
export default render;
//# sourceMappingURL=preact-to-nativescript.m.js.map
