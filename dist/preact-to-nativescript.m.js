function VNode() {}

function h$1(nodeName, attributes) {
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
    return h$1(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
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
    console.log("making diff of", vnodeName);
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
    h: h$1,
    createElement: h$1,
    cloneElement: cloneElement,
    Component: Component,
    render: render$2,
    rerender: rerender,
    options: options,
    unmountComponent: unmountComponent
};



//# sourceMappingURL=data:application/json;charset=utf-8;base64,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UyxPQVBBLENBQUE7SUFRVCxrQkFBa0I7O0FBR3RCLGVBQWU7QUFDZixPQUFBLENBQ0ksR0FBRyxjQUFjLFdBQVcsUUFBUSxVQUFVLFNBQVM7QUF6WjNEIiwiZmlsZSI6InByZWFjdC5qcyhvcmlnaW5hbCkiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBWTm9kZSgpIHt9XG5mdW5jdGlvbiBoKG5vZGVOYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgdmFyIGxhc3RTaW1wbGUsIGNoaWxkLCBzaW1wbGUsIGksIGNoaWxkcmVuID0gRU1QVFlfQ0hJTERSRU47XG4gICAgZm9yIChpID0gYXJndW1lbnRzLmxlbmd0aDsgaS0tID4gMjsgKSBzdGFjay5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgaWYgKGF0dHJpYnV0ZXMgJiYgbnVsbCAhPSBhdHRyaWJ1dGVzLmNoaWxkcmVuKSB7XG4gICAgICAgIGlmICghc3RhY2subGVuZ3RoKSBzdGFjay5wdXNoKGF0dHJpYnV0ZXMuY2hpbGRyZW4pO1xuICAgICAgICBkZWxldGUgYXR0cmlidXRlcy5jaGlsZHJlbjtcbiAgICB9XG4gICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkgaWYgKChjaGlsZCA9IHN0YWNrLnBvcCgpKSAmJiB2b2lkIDAgIT09IGNoaWxkLnBvcCkgZm9yIChpID0gY2hpbGQubGVuZ3RoOyBpLS07ICkgc3RhY2sucHVzaChjaGlsZFtpXSk7IGVsc2Uge1xuICAgICAgICBpZiAoJ2Jvb2xlYW4nID09IHR5cGVvZiBjaGlsZCkgY2hpbGQgPSBudWxsO1xuICAgICAgICBpZiAoc2ltcGxlID0gJ2Z1bmN0aW9uJyAhPSB0eXBlb2Ygbm9kZU5hbWUpIGlmIChudWxsID09IGNoaWxkKSBjaGlsZCA9ICcnOyBlbHNlIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgY2hpbGQpIGNoaWxkID0gU3RyaW5nKGNoaWxkKTsgZWxzZSBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIGNoaWxkKSBzaW1wbGUgPSAhMTtcbiAgICAgICAgaWYgKHNpbXBsZSAmJiBsYXN0U2ltcGxlKSBjaGlsZHJlbltjaGlsZHJlbi5sZW5ndGggLSAxXSArPSBjaGlsZDsgZWxzZSBpZiAoY2hpbGRyZW4gPT09IEVNUFRZX0NISUxEUkVOKSBjaGlsZHJlbiA9IFsgY2hpbGQgXTsgZWxzZSBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgbGFzdFNpbXBsZSA9IHNpbXBsZTtcbiAgICB9XG4gICAgdmFyIHAgPSBuZXcgVk5vZGUoKTtcbiAgICBwLm5vZGVOYW1lID0gbm9kZU5hbWU7XG4gICAgcC5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgIHAuYXR0cmlidXRlcyA9IG51bGwgPT0gYXR0cmlidXRlcyA/IHZvaWQgMCA6IGF0dHJpYnV0ZXM7XG4gICAgcC5rZXkgPSBudWxsID09IGF0dHJpYnV0ZXMgPyB2b2lkIDAgOiBhdHRyaWJ1dGVzLmtleTtcbiAgICBpZiAodm9pZCAwICE9PSBvcHRpb25zLnZub2RlKSBvcHRpb25zLnZub2RlKHApO1xuICAgIHJldHVybiBwO1xufVxuZnVuY3Rpb24gZXh0ZW5kKG9iaiwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpIGluIHByb3BzKSBvYmpbaV0gPSBwcm9wc1tpXTtcbiAgICByZXR1cm4gb2JqO1xufVxuZnVuY3Rpb24gY2xvbmVFbGVtZW50KHZub2RlLCBwcm9wcykge1xuICAgIHJldHVybiBoKHZub2RlLm5vZGVOYW1lLCBleHRlbmQoZXh0ZW5kKHt9LCB2bm9kZS5hdHRyaWJ1dGVzKSwgcHJvcHMpLCBhcmd1bWVudHMubGVuZ3RoID4gMiA/IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSA6IHZub2RlLmNoaWxkcmVuKTtcbn1cbmZ1bmN0aW9uIGVucXVldWVSZW5kZXIoY29tcG9uZW50KSB7XG4gICAgaWYgKCFjb21wb25lbnQuX19kICYmIChjb21wb25lbnQuX19kID0gITApICYmIDEgPT0gaXRlbXMucHVzaChjb21wb25lbnQpKSAob3B0aW9ucy5kZWJvdW5jZVJlbmRlcmluZyB8fCBkZWZlcikocmVyZW5kZXIpO1xufVxuZnVuY3Rpb24gcmVyZW5kZXIoKSB7XG4gICAgdmFyIHAsIGxpc3QgPSBpdGVtcztcbiAgICBpdGVtcyA9IFtdO1xuICAgIHdoaWxlIChwID0gbGlzdC5wb3AoKSkgaWYgKHAuX19kKSByZW5kZXJDb21wb25lbnQocCk7XG59XG5mdW5jdGlvbiBpc1NhbWVOb2RlVHlwZShub2RlLCB2bm9kZSwgaHlkcmF0aW5nKSB7XG4gICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB2bm9kZSB8fCAnbnVtYmVyJyA9PSB0eXBlb2Ygdm5vZGUpIHJldHVybiB2b2lkIDAgIT09IG5vZGUuc3BsaXRUZXh0O1xuICAgIGlmICgnc3RyaW5nJyA9PSB0eXBlb2Ygdm5vZGUubm9kZU5hbWUpIHJldHVybiAhbm9kZS5fY29tcG9uZW50Q29uc3RydWN0b3IgJiYgaXNOYW1lZE5vZGUobm9kZSwgdm5vZGUubm9kZU5hbWUpOyBlbHNlIHJldHVybiBoeWRyYXRpbmcgfHwgbm9kZS5fY29tcG9uZW50Q29uc3RydWN0b3IgPT09IHZub2RlLm5vZGVOYW1lO1xufVxuZnVuY3Rpb24gaXNOYW1lZE5vZGUobm9kZSwgbm9kZU5hbWUpIHtcbiAgICByZXR1cm4gbm9kZS5fX24gPT09IG5vZGVOYW1lIHx8IG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbn1cbmZ1bmN0aW9uIGdldE5vZGVQcm9wcyh2bm9kZSkge1xuICAgIHZhciBwcm9wcyA9IGV4dGVuZCh7fSwgdm5vZGUuYXR0cmlidXRlcyk7XG4gICAgcHJvcHMuY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlbjtcbiAgICB2YXIgZGVmYXVsdFByb3BzID0gdm5vZGUubm9kZU5hbWUuZGVmYXVsdFByb3BzO1xuICAgIGlmICh2b2lkIDAgIT09IGRlZmF1bHRQcm9wcykgZm9yICh2YXIgaSBpbiBkZWZhdWx0UHJvcHMpIGlmICh2b2lkIDAgPT09IHByb3BzW2ldKSBwcm9wc1tpXSA9IGRlZmF1bHRQcm9wc1tpXTtcbiAgICByZXR1cm4gcHJvcHM7XG59XG5mdW5jdGlvbiBjcmVhdGVOb2RlKG5vZGVOYW1lLCBpc1N2Zykge1xuICAgIHZhciBub2RlID0gaXNTdmcgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgbm9kZU5hbWUpIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XG4gICAgbm9kZS5fX24gPSBub2RlTmFtZTtcbiAgICByZXR1cm4gbm9kZTtcbn1cbmZ1bmN0aW9uIHJlbW92ZU5vZGUobm9kZSkge1xuICAgIHZhciBwYXJlbnROb2RlID0gbm9kZS5wYXJlbnROb2RlO1xuICAgIGlmIChwYXJlbnROb2RlKSBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xufVxuZnVuY3Rpb24gc2V0QWNjZXNzb3Iobm9kZSwgbmFtZSwgb2xkLCB2YWx1ZSwgaXNTdmcpIHtcbiAgICBpZiAoJ2NsYXNzTmFtZScgPT09IG5hbWUpIG5hbWUgPSAnY2xhc3MnO1xuICAgIGlmICgna2V5JyA9PT0gbmFtZSkgOyBlbHNlIGlmICgncmVmJyA9PT0gbmFtZSkge1xuICAgICAgICBpZiAob2xkKSBvbGQobnVsbCk7XG4gICAgICAgIGlmICh2YWx1ZSkgdmFsdWUobm9kZSk7XG4gICAgfSBlbHNlIGlmICgnY2xhc3MnID09PSBuYW1lICYmICFpc1N2Zykgbm9kZS5jbGFzc05hbWUgPSB2YWx1ZSB8fCAnJzsgZWxzZSBpZiAoJ3N0eWxlJyA9PT0gbmFtZSkge1xuICAgICAgICBpZiAoIXZhbHVlIHx8ICdzdHJpbmcnID09IHR5cGVvZiB2YWx1ZSB8fCAnc3RyaW5nJyA9PSB0eXBlb2Ygb2xkKSBub2RlLnN0eWxlLmNzc1RleHQgPSB2YWx1ZSB8fCAnJztcbiAgICAgICAgaWYgKHZhbHVlICYmICdvYmplY3QnID09IHR5cGVvZiB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiBvbGQpIGZvciAodmFyIGkgaW4gb2xkKSBpZiAoIShpIGluIHZhbHVlKSkgbm9kZS5zdHlsZVtpXSA9ICcnO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB2YWx1ZSkgbm9kZS5zdHlsZVtpXSA9ICdudW1iZXInID09IHR5cGVvZiB2YWx1ZVtpXSAmJiAhMSA9PT0gSVNfTk9OX0RJTUVOU0lPTkFMLnRlc3QoaSkgPyB2YWx1ZVtpXSArICdweCcgOiB2YWx1ZVtpXTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoJ2Rhbmdlcm91c2x5U2V0SW5uZXJIVE1MJyA9PT0gbmFtZSkge1xuICAgICAgICBpZiAodmFsdWUpIG5vZGUuaW5uZXJIVE1MID0gdmFsdWUuX19odG1sIHx8ICcnO1xuICAgIH0gZWxzZSBpZiAoJ28nID09IG5hbWVbMF0gJiYgJ24nID09IG5hbWVbMV0pIHtcbiAgICAgICAgdmFyIHVzZUNhcHR1cmUgPSBuYW1lICE9PSAobmFtZSA9IG5hbWUucmVwbGFjZSgvQ2FwdHVyZSQvLCAnJykpO1xuICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHJpbmcoMiwgMykudG9Mb3dlckNhc2UoKSArIG5hbWUuc3Vic3RyaW5nKDMpO1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghb2xkKSBub2RlLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgZXZlbnRQcm94eSwgbm9kZSk7XG4gICAgICAgIH0gZWxzZSBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgZXZlbnRQcm94eSwgbm9kZSk7XG4gICAgICAgIChub2RlLl9fbCB8fCAobm9kZS5fX2wgPSB7fSkpW25hbWVdID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmICgnbGlzdCcgIT09IG5hbWUgJiYgJ3R5cGUnICE9PSBuYW1lICYmICFpc1N2ZyAmJiBuYW1lIGluIG5vZGUpIHtcbiAgICAgICAgc2V0UHJvcGVydHkobm9kZSwgbmFtZSwgbnVsbCA9PSB2YWx1ZSA/ICcnIDogdmFsdWUpO1xuICAgICAgICBpZiAobnVsbCA9PSB2YWx1ZSB8fCAhMSA9PT0gdmFsdWUpIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBucyA9IGlzU3ZnICYmIG5hbWUgIT09IChuYW1lID0gbmFtZS5yZXBsYWNlKC9eeGxpbmtcXDo/LywgJycpKTtcbiAgICAgICAgaWYgKG51bGwgPT0gdmFsdWUgfHwgITEgPT09IHZhbHVlKSBpZiAobnMpIG5vZGUucmVtb3ZlQXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCBuYW1lLnRvTG93ZXJDYXNlKCkpOyBlbHNlIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpOyBlbHNlIGlmICgnZnVuY3Rpb24nICE9IHR5cGVvZiB2YWx1ZSkgaWYgKG5zKSBub2RlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgbmFtZS50b0xvd2VyQ2FzZSgpLCB2YWx1ZSk7IGVsc2Ugbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNldFByb3BlcnR5KG5vZGUsIG5hbWUsIHZhbHVlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgbm9kZVtuYW1lXSA9IHZhbHVlO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG59XG5mdW5jdGlvbiBldmVudFByb3h5KGUpIHtcbiAgICBjb25zdCB0eXBlID0gZS50eXBlID8gZS50eXBlIDogZS5ldmVudE5hbWVcbiAgICByZXR1cm4gdGhpcy5fX2xbdHlwZV0ob3B0aW9ucy5ldmVudCAmJiBvcHRpb25zLmV2ZW50KGUpIHx8IGUpO1xufVxuZnVuY3Rpb24gZmx1c2hNb3VudHMoKSB7XG4gICAgdmFyIGM7XG4gICAgd2hpbGUgKGMgPSBtb3VudHMucG9wKCkpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYWZ0ZXJNb3VudCkgb3B0aW9ucy5hZnRlck1vdW50KGMpO1xuICAgICAgICBpZiAoYy5jb21wb25lbnREaWRNb3VudCkgYy5jb21wb25lbnREaWRNb3VudCgpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwsIHBhcmVudCwgY29tcG9uZW50Um9vdCkge1xuICAgIGlmICghZGlmZkxldmVsKyspIHtcbiAgICAgICAgaXNTdmdNb2RlID0gbnVsbCAhPSBwYXJlbnQgJiYgdm9pZCAwICE9PSBwYXJlbnQub3duZXJTVkdFbGVtZW50O1xuICAgICAgICBoeWRyYXRpbmcgPSBudWxsICE9IGRvbSAmJiAhKCdfX3ByZWFjdGF0dHJfJyBpbiBkb20pO1xuICAgIH1cbiAgICB2YXIgcmV0ID0gaWRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwsIGNvbXBvbmVudFJvb3QpO1xuICAgIGlmIChwYXJlbnQgJiYgcmV0LnBhcmVudE5vZGUgIT09IHBhcmVudCkgcGFyZW50LmFwcGVuZENoaWxkKHJldCk7XG4gICAgaWYgKCEtLWRpZmZMZXZlbCkge1xuICAgICAgICBoeWRyYXRpbmcgPSAhMTtcbiAgICAgICAgaWYgKCFjb21wb25lbnRSb290KSBmbHVzaE1vdW50cygpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuZnVuY3Rpb24gaWRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwsIGNvbXBvbmVudFJvb3QpIHtcbiAgICB2YXIgb3V0ID0gZG9tLCBwcmV2U3ZnTW9kZSA9IGlzU3ZnTW9kZTtcbiAgICBpZiAobnVsbCA9PSB2bm9kZSB8fCAnYm9vbGVhbicgPT0gdHlwZW9mIHZub2RlKSB2bm9kZSA9ICcnO1xuICAgIGlmICgnc3RyaW5nJyA9PSB0eXBlb2Ygdm5vZGUgfHwgJ251bWJlcicgPT0gdHlwZW9mIHZub2RlKSB7XG4gICAgICAgIGlmIChkb20gJiYgdm9pZCAwICE9PSBkb20uc3BsaXRUZXh0ICYmIGRvbS5wYXJlbnROb2RlICYmICghZG9tLl9jb21wb25lbnQgfHwgY29tcG9uZW50Um9vdCkpIHtcbiAgICAgICAgICAgIGlmIChkb20ubm9kZVZhbHVlICE9IHZub2RlKSBkb20ubm9kZVZhbHVlID0gdm5vZGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh2bm9kZSk7XG4gICAgICAgICAgICBpZiAoZG9tKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5wYXJlbnROb2RlKSBkb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQob3V0LCBkb20pO1xuICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKGRvbSwgITApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG91dC5fX3ByZWFjdGF0dHJfID0gITA7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIHZhciB2bm9kZU5hbWUgPSB2bm9kZS5ub2RlTmFtZTtcbiAgICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2Ygdm5vZGVOYW1lKSByZXR1cm4gYnVpbGRDb21wb25lbnRGcm9tVk5vZGUoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwpO1xuICAgIGlzU3ZnTW9kZSA9ICdzdmcnID09PSB2bm9kZU5hbWUgPyAhMCA6ICdmb3JlaWduT2JqZWN0JyA9PT0gdm5vZGVOYW1lID8gITEgOiBpc1N2Z01vZGU7XG4gICAgdm5vZGVOYW1lID0gU3RyaW5nKHZub2RlTmFtZSk7XG4gICAgY29uc29sZS5sb2coXCJtYWtpbmcgZGlmZiBvZlwiLCB2bm9kZU5hbWUpXG4gICAgaWYgKCFkb20gfHwgIWlzTmFtZWROb2RlKGRvbSwgdm5vZGVOYW1lKSkge1xuICAgICAgICBvdXQgPSBjcmVhdGVOb2RlKHZub2RlTmFtZSwgaXNTdmdNb2RlKTtcbiAgICAgICAgaWYgKGRvbSkge1xuICAgICAgICAgICAgd2hpbGUgKGRvbS5maXJzdENoaWxkKSBvdXQuYXBwZW5kQ2hpbGQoZG9tLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgaWYgKGRvbS5wYXJlbnROb2RlKSBkb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQob3V0LCBkb20pO1xuICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUoZG9tLCAhMCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIGZjID0gb3V0LmZpcnN0Q2hpbGQsIHByb3BzID0gb3V0Ll9fcHJlYWN0YXR0cl8sIHZjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuO1xuICAgIGlmIChudWxsID09IHByb3BzKSB7XG4gICAgICAgIHByb3BzID0gb3V0Ll9fcHJlYWN0YXR0cl8gPSB7fTtcbiAgICAgICAgZm9yICh2YXIgYSA9IG91dC5hdHRyaWJ1dGVzLCBpID0gYS5sZW5ndGg7IGktLTsgKSBwcm9wc1thW2ldLm5hbWVdID0gYVtpXS52YWx1ZTtcbiAgICB9XG4gICAgaWYgKCFoeWRyYXRpbmcgJiYgdmNoaWxkcmVuICYmIDEgPT09IHZjaGlsZHJlbi5sZW5ndGggJiYgJ3N0cmluZycgPT0gdHlwZW9mIHZjaGlsZHJlblswXSAmJiBudWxsICE9IGZjICYmIHZvaWQgMCAhPT0gZmMuc3BsaXRUZXh0ICYmIG51bGwgPT0gZmMubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgaWYgKGZjLm5vZGVWYWx1ZSAhPSB2Y2hpbGRyZW5bMF0pIGZjLm5vZGVWYWx1ZSA9IHZjaGlsZHJlblswXTtcbiAgICB9IGVsc2UgaWYgKHZjaGlsZHJlbiAmJiB2Y2hpbGRyZW4ubGVuZ3RoIHx8IG51bGwgIT0gZmMpIGlubmVyRGlmZk5vZGUob3V0LCB2Y2hpbGRyZW4sIGNvbnRleHQsIG1vdW50QWxsLCBoeWRyYXRpbmcgfHwgbnVsbCAhPSBwcm9wcy5kYW5nZXJvdXNseVNldElubmVySFRNTCk7XG4gICAgZGlmZkF0dHJpYnV0ZXMob3V0LCB2bm9kZS5hdHRyaWJ1dGVzLCBwcm9wcyk7XG4gICAgaXNTdmdNb2RlID0gcHJldlN2Z01vZGU7XG4gICAgcmV0dXJuIG91dDtcbn1cbmZ1bmN0aW9uIGlubmVyRGlmZk5vZGUoZG9tLCB2Y2hpbGRyZW4sIGNvbnRleHQsIG1vdW50QWxsLCBpc0h5ZHJhdGluZykge1xuICAgIHZhciBqLCBjLCBmLCB2Y2hpbGQsIGNoaWxkLCBvcmlnaW5hbENoaWxkcmVuID0gZG9tLmNoaWxkTm9kZXMsIGNoaWxkcmVuID0gW10sIGtleWVkID0ge30sIGtleWVkTGVuID0gMCwgbWluID0gMCwgbGVuID0gb3JpZ2luYWxDaGlsZHJlbi5sZW5ndGgsIGNoaWxkcmVuTGVuID0gMCwgdmxlbiA9IHZjaGlsZHJlbiA/IHZjaGlsZHJlbi5sZW5ndGggOiAwO1xuICAgIGlmICgwICE9PSBsZW4pIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdmFyIF9jaGlsZCA9IG9yaWdpbmFsQ2hpbGRyZW5baV0sIHByb3BzID0gX2NoaWxkLl9fcHJlYWN0YXR0cl8sIGtleSA9IHZsZW4gJiYgcHJvcHMgPyBfY2hpbGQuX2NvbXBvbmVudCA/IF9jaGlsZC5fY29tcG9uZW50Ll9fayA6IHByb3BzLmtleSA6IG51bGw7XG4gICAgICAgIGlmIChudWxsICE9IGtleSkge1xuICAgICAgICAgICAga2V5ZWRMZW4rKztcbiAgICAgICAgICAgIGtleWVkW2tleV0gPSBfY2hpbGQ7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvcHMgfHwgKHZvaWQgMCAhPT0gX2NoaWxkLnNwbGl0VGV4dCA/IGlzSHlkcmF0aW5nID8gX2NoaWxkLm5vZGVWYWx1ZS50cmltKCkgOiAhMCA6IGlzSHlkcmF0aW5nKSkgY2hpbGRyZW5bY2hpbGRyZW5MZW4rK10gPSBfY2hpbGQ7XG4gICAgfVxuICAgIGlmICgwICE9PSB2bGVuKSBmb3IgKHZhciBpID0gMDsgaSA8IHZsZW47IGkrKykge1xuICAgICAgICB2Y2hpbGQgPSB2Y2hpbGRyZW5baV07XG4gICAgICAgIGNoaWxkID0gbnVsbDtcbiAgICAgICAgdmFyIGtleSA9IHZjaGlsZC5rZXk7XG4gICAgICAgIGlmIChudWxsICE9IGtleSkge1xuICAgICAgICAgICAgaWYgKGtleWVkTGVuICYmIHZvaWQgMCAhPT0ga2V5ZWRba2V5XSkge1xuICAgICAgICAgICAgICAgIGNoaWxkID0ga2V5ZWRba2V5XTtcbiAgICAgICAgICAgICAgICBrZXllZFtrZXldID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgIGtleWVkTGVuLS07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIWNoaWxkICYmIG1pbiA8IGNoaWxkcmVuTGVuKSBmb3IgKGogPSBtaW47IGogPCBjaGlsZHJlbkxlbjsgaisrKSBpZiAodm9pZCAwICE9PSBjaGlsZHJlbltqXSAmJiBpc1NhbWVOb2RlVHlwZShjID0gY2hpbGRyZW5bal0sIHZjaGlsZCwgaXNIeWRyYXRpbmcpKSB7XG4gICAgICAgICAgICBjaGlsZCA9IGM7XG4gICAgICAgICAgICBjaGlsZHJlbltqXSA9IHZvaWQgMDtcbiAgICAgICAgICAgIGlmIChqID09PSBjaGlsZHJlbkxlbiAtIDEpIGNoaWxkcmVuTGVuLS07XG4gICAgICAgICAgICBpZiAoaiA9PT0gbWluKSBtaW4rKztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNoaWxkID0gaWRpZmYoY2hpbGQsIHZjaGlsZCwgY29udGV4dCwgbW91bnRBbGwpO1xuICAgICAgICBmID0gb3JpZ2luYWxDaGlsZHJlbltpXTtcbiAgICAgICAgaWYgKGNoaWxkICYmIGNoaWxkICE9PSBkb20gJiYgY2hpbGQgIT09IGYpIGlmIChudWxsID09IGYpIGRvbS5hcHBlbmRDaGlsZChjaGlsZCk7IGVsc2UgaWYgKGNoaWxkID09PSBmLm5leHRTaWJsaW5nKSByZW1vdmVOb2RlKGYpOyBlbHNlIGRvbS5pbnNlcnRCZWZvcmUoY2hpbGQsIGYpO1xuICAgIH1cbiAgICBpZiAoa2V5ZWRMZW4pIGZvciAodmFyIGkgaW4ga2V5ZWQpIGlmICh2b2lkIDAgIT09IGtleWVkW2ldKSByZWNvbGxlY3ROb2RlVHJlZShrZXllZFtpXSwgITEpO1xuICAgIHdoaWxlIChtaW4gPD0gY2hpbGRyZW5MZW4pIGlmICh2b2lkIDAgIT09IChjaGlsZCA9IGNoaWxkcmVuW2NoaWxkcmVuTGVuLS1dKSkgcmVjb2xsZWN0Tm9kZVRyZWUoY2hpbGQsICExKTtcbn1cbmZ1bmN0aW9uIHJlY29sbGVjdE5vZGVUcmVlKG5vZGUsIHVubW91bnRPbmx5KSB7XG4gICAgdmFyIGNvbXBvbmVudCA9IG5vZGUuX2NvbXBvbmVudDtcbiAgICBpZiAoY29tcG9uZW50KSB1bm1vdW50Q29tcG9uZW50KGNvbXBvbmVudCk7IGVsc2Uge1xuICAgICAgICBpZiAobnVsbCAhPSBub2RlLl9fcHJlYWN0YXR0cl8gJiYgbm9kZS5fX3ByZWFjdGF0dHJfLnJlZikgbm9kZS5fX3ByZWFjdGF0dHJfLnJlZihudWxsKTtcbiAgICAgICAgaWYgKCExID09PSB1bm1vdW50T25seSB8fCBudWxsID09IG5vZGUuX19wcmVhY3RhdHRyXykgcmVtb3ZlTm9kZShub2RlKTtcbiAgICAgICAgcmVtb3ZlQ2hpbGRyZW4obm9kZSk7XG4gICAgfVxufVxuZnVuY3Rpb24gcmVtb3ZlQ2hpbGRyZW4obm9kZSkge1xuICAgIG5vZGUgPSBub2RlLmxhc3RDaGlsZDtcbiAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICB2YXIgbmV4dCA9IG5vZGUucHJldmlvdXNTaWJsaW5nO1xuICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShub2RlLCAhMCk7XG4gICAgICAgIG5vZGUgPSBuZXh0O1xuICAgIH1cbn1cbmZ1bmN0aW9uIGRpZmZBdHRyaWJ1dGVzKGRvbSwgYXR0cnMsIG9sZCkge1xuICAgIHZhciBuYW1lO1xuICAgIGZvciAobmFtZSBpbiBvbGQpIGlmICgoIWF0dHJzIHx8IG51bGwgPT0gYXR0cnNbbmFtZV0pICYmIG51bGwgIT0gb2xkW25hbWVdKSBzZXRBY2Nlc3Nvcihkb20sIG5hbWUsIG9sZFtuYW1lXSwgb2xkW25hbWVdID0gdm9pZCAwLCBpc1N2Z01vZGUpO1xuICAgIGZvciAobmFtZSBpbiBhdHRycykgaWYgKCEoJ2NoaWxkcmVuJyA9PT0gbmFtZSB8fCAnaW5uZXJIVE1MJyA9PT0gbmFtZSB8fCBuYW1lIGluIG9sZCAmJiBhdHRyc1tuYW1lXSA9PT0gKCd2YWx1ZScgPT09IG5hbWUgfHwgJ2NoZWNrZWQnID09PSBuYW1lID8gZG9tW25hbWVdIDogb2xkW25hbWVdKSkpIHNldEFjY2Vzc29yKGRvbSwgbmFtZSwgb2xkW25hbWVdLCBvbGRbbmFtZV0gPSBhdHRyc1tuYW1lXSwgaXNTdmdNb2RlKTtcbn1cbmZ1bmN0aW9uIGNvbGxlY3RDb21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgdmFyIG5hbWUgPSBjb21wb25lbnQuY29uc3RydWN0b3IubmFtZTtcbiAgICAoY29tcG9uZW50c1tuYW1lXSB8fCAoY29tcG9uZW50c1tuYW1lXSA9IFtdKSkucHVzaChjb21wb25lbnQpO1xufVxuZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50KEN0b3IsIHByb3BzLCBjb250ZXh0KSB7XG4gICAgdmFyIGluc3QsIGxpc3QgPSBjb21wb25lbnRzW0N0b3IubmFtZV07XG4gICAgaWYgKEN0b3IucHJvdG90eXBlICYmIEN0b3IucHJvdG90eXBlLnJlbmRlcikge1xuICAgICAgICBpbnN0ID0gbmV3IEN0b3IocHJvcHMsIGNvbnRleHQpO1xuICAgICAgICBDb21wb25lbnQuY2FsbChpbnN0LCBwcm9wcywgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW5zdCA9IG5ldyBDb21wb25lbnQocHJvcHMsIGNvbnRleHQpO1xuICAgICAgICBpbnN0LmNvbnN0cnVjdG9yID0gQ3RvcjtcbiAgICAgICAgaW5zdC5yZW5kZXIgPSBkb1JlbmRlcjtcbiAgICB9XG4gICAgaWYgKGxpc3QpIGZvciAodmFyIGkgPSBsaXN0Lmxlbmd0aDsgaS0tOyApIGlmIChsaXN0W2ldLmNvbnN0cnVjdG9yID09PSBDdG9yKSB7XG4gICAgICAgIGluc3QuX19iID0gbGlzdFtpXS5fX2I7XG4gICAgICAgIGxpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGluc3Q7XG59XG5mdW5jdGlvbiBkb1JlbmRlcihwcm9wcywgc3RhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCk7XG59XG5mdW5jdGlvbiBzZXRDb21wb25lbnRQcm9wcyhjb21wb25lbnQsIHByb3BzLCBvcHRzLCBjb250ZXh0LCBtb3VudEFsbCkge1xuICAgIGlmICghY29tcG9uZW50Ll9feCkge1xuICAgICAgICBjb21wb25lbnQuX194ID0gITA7XG4gICAgICAgIGlmIChjb21wb25lbnQuX19yID0gcHJvcHMucmVmKSBkZWxldGUgcHJvcHMucmVmO1xuICAgICAgICBpZiAoY29tcG9uZW50Ll9fayA9IHByb3BzLmtleSkgZGVsZXRlIHByb3BzLmtleTtcbiAgICAgICAgaWYgKCFjb21wb25lbnQuYmFzZSB8fCBtb3VudEFsbCkge1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb21wb25lbnQuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcykgY29tcG9uZW50LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMsIGNvbnRleHQpO1xuICAgICAgICBpZiAoY29udGV4dCAmJiBjb250ZXh0ICE9PSBjb21wb25lbnQuY29udGV4dCkge1xuICAgICAgICAgICAgaWYgKCFjb21wb25lbnQuX19jKSBjb21wb25lbnQuX19jID0gY29tcG9uZW50LmNvbnRleHQ7XG4gICAgICAgICAgICBjb21wb25lbnQuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjb21wb25lbnQuX19wKSBjb21wb25lbnQuX19wID0gY29tcG9uZW50LnByb3BzO1xuICAgICAgICBjb21wb25lbnQucHJvcHMgPSBwcm9wcztcbiAgICAgICAgY29tcG9uZW50Ll9feCA9ICExO1xuICAgICAgICBpZiAoMCAhPT0gb3B0cykgaWYgKDEgPT09IG9wdHMgfHwgITEgIT09IG9wdGlvbnMuc3luY0NvbXBvbmVudFVwZGF0ZXMgfHwgIWNvbXBvbmVudC5iYXNlKSByZW5kZXJDb21wb25lbnQoY29tcG9uZW50LCAxLCBtb3VudEFsbCk7IGVsc2UgZW5xdWV1ZVJlbmRlcihjb21wb25lbnQpO1xuICAgICAgICBpZiAoY29tcG9uZW50Ll9fcikgY29tcG9uZW50Ll9fcihjb21wb25lbnQpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHJlbmRlckNvbXBvbmVudChjb21wb25lbnQsIG9wdHMsIG1vdW50QWxsLCBpc0NoaWxkKSB7XG4gICAgaWYgKCFjb21wb25lbnQuX194KSB7XG4gICAgICAgIHZhciByZW5kZXJlZCwgaW5zdCwgY2Jhc2UsIHByb3BzID0gY29tcG9uZW50LnByb3BzLCBzdGF0ZSA9IGNvbXBvbmVudC5zdGF0ZSwgY29udGV4dCA9IGNvbXBvbmVudC5jb250ZXh0LCBwcmV2aW91c1Byb3BzID0gY29tcG9uZW50Ll9fcCB8fCBwcm9wcywgcHJldmlvdXNTdGF0ZSA9IGNvbXBvbmVudC5fX3MgfHwgc3RhdGUsIHByZXZpb3VzQ29udGV4dCA9IGNvbXBvbmVudC5fX2MgfHwgY29udGV4dCwgaXNVcGRhdGUgPSBjb21wb25lbnQuYmFzZSwgbmV4dEJhc2UgPSBjb21wb25lbnQuX19iLCBpbml0aWFsQmFzZSA9IGlzVXBkYXRlIHx8IG5leHRCYXNlLCBpbml0aWFsQ2hpbGRDb21wb25lbnQgPSBjb21wb25lbnQuX2NvbXBvbmVudCwgc2tpcCA9ICExO1xuICAgICAgICBpZiAoaXNVcGRhdGUpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wcyA9IHByZXZpb3VzUHJvcHM7XG4gICAgICAgICAgICBjb21wb25lbnQuc3RhdGUgPSBwcmV2aW91c1N0YXRlO1xuICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBwcmV2aW91c0NvbnRleHQ7XG4gICAgICAgICAgICBpZiAoMiAhPT0gb3B0cyAmJiBjb21wb25lbnQuc2hvdWxkQ29tcG9uZW50VXBkYXRlICYmICExID09PSBjb21wb25lbnQuc2hvdWxkQ29tcG9uZW50VXBkYXRlKHByb3BzLCBzdGF0ZSwgY29udGV4dCkpIHNraXAgPSAhMDsgZWxzZSBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxVcGRhdGUpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsVXBkYXRlKHByb3BzLCBzdGF0ZSwgY29udGV4dCk7XG4gICAgICAgICAgICBjb21wb25lbnQucHJvcHMgPSBwcm9wcztcbiAgICAgICAgICAgIGNvbXBvbmVudC5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB9XG4gICAgICAgIGNvbXBvbmVudC5fX3AgPSBjb21wb25lbnQuX19zID0gY29tcG9uZW50Ll9fYyA9IGNvbXBvbmVudC5fX2IgPSBudWxsO1xuICAgICAgICBjb21wb25lbnQuX19kID0gITE7XG4gICAgICAgIGlmICghc2tpcCkge1xuICAgICAgICAgICAgcmVuZGVyZWQgPSBjb21wb25lbnQucmVuZGVyKHByb3BzLCBzdGF0ZSwgY29udGV4dCk7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50LmdldENoaWxkQ29udGV4dCkgY29udGV4dCA9IGV4dGVuZChleHRlbmQoe30sIGNvbnRleHQpLCBjb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0KCkpO1xuICAgICAgICAgICAgdmFyIHRvVW5tb3VudCwgYmFzZSwgY2hpbGRDb21wb25lbnQgPSByZW5kZXJlZCAmJiByZW5kZXJlZC5ub2RlTmFtZTtcbiAgICAgICAgICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBjaGlsZENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZFByb3BzID0gZ2V0Tm9kZVByb3BzKHJlbmRlcmVkKTtcbiAgICAgICAgICAgICAgICBpbnN0ID0gaW5pdGlhbENoaWxkQ29tcG9uZW50O1xuICAgICAgICAgICAgICAgIGlmIChpbnN0ICYmIGluc3QuY29uc3RydWN0b3IgPT09IGNoaWxkQ29tcG9uZW50ICYmIGNoaWxkUHJvcHMua2V5ID09IGluc3QuX19rKSBzZXRDb21wb25lbnRQcm9wcyhpbnN0LCBjaGlsZFByb3BzLCAxLCBjb250ZXh0LCAhMSk7IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0b1VubW91bnQgPSBpbnN0O1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuX2NvbXBvbmVudCA9IGluc3QgPSBjcmVhdGVDb21wb25lbnQoY2hpbGRDb21wb25lbnQsIGNoaWxkUHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICBpbnN0Ll9fYiA9IGluc3QuX19iIHx8IG5leHRCYXNlO1xuICAgICAgICAgICAgICAgICAgICBpbnN0Ll9fdSA9IGNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgc2V0Q29tcG9uZW50UHJvcHMoaW5zdCwgY2hpbGRQcm9wcywgMCwgY29udGV4dCwgITEpO1xuICAgICAgICAgICAgICAgICAgICByZW5kZXJDb21wb25lbnQoaW5zdCwgMSwgbW91bnRBbGwsICEwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYmFzZSA9IGluc3QuYmFzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2Jhc2UgPSBpbml0aWFsQmFzZTtcbiAgICAgICAgICAgICAgICB0b1VubW91bnQgPSBpbml0aWFsQ2hpbGRDb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgaWYgKHRvVW5tb3VudCkgY2Jhc2UgPSBjb21wb25lbnQuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKGluaXRpYWxCYXNlIHx8IDEgPT09IG9wdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNiYXNlKSBjYmFzZS5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgYmFzZSA9IGRpZmYoY2Jhc2UsIHJlbmRlcmVkLCBjb250ZXh0LCBtb3VudEFsbCB8fCAhaXNVcGRhdGUsIGluaXRpYWxCYXNlICYmIGluaXRpYWxCYXNlLnBhcmVudE5vZGUsICEwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5pdGlhbEJhc2UgJiYgYmFzZSAhPT0gaW5pdGlhbEJhc2UgJiYgaW5zdCAhPT0gaW5pdGlhbENoaWxkQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGJhc2VQYXJlbnQgPSBpbml0aWFsQmFzZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIGlmIChiYXNlUGFyZW50ICYmIGJhc2UgIT09IGJhc2VQYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZVBhcmVudC5yZXBsYWNlQ2hpbGQoYmFzZSwgaW5pdGlhbEJhc2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRvVW5tb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbEJhc2UuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShpbml0aWFsQmFzZSwgITEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRvVW5tb3VudCkgdW5tb3VudENvbXBvbmVudCh0b1VubW91bnQpO1xuICAgICAgICAgICAgY29tcG9uZW50LmJhc2UgPSBiYXNlO1xuICAgICAgICAgICAgaWYgKGJhc2UgJiYgIWlzQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50UmVmID0gY29tcG9uZW50LCB0ID0gY29tcG9uZW50O1xuICAgICAgICAgICAgICAgIHdoaWxlICh0ID0gdC5fX3UpIChjb21wb25lbnRSZWYgPSB0KS5iYXNlID0gYmFzZTtcbiAgICAgICAgICAgICAgICBiYXNlLl9jb21wb25lbnQgPSBjb21wb25lbnRSZWY7XG4gICAgICAgICAgICAgICAgYmFzZS5fY29tcG9uZW50Q29uc3RydWN0b3IgPSBjb21wb25lbnRSZWYuY29uc3RydWN0b3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1VwZGF0ZSB8fCBtb3VudEFsbCkgbW91bnRzLnVuc2hpZnQoY29tcG9uZW50KTsgZWxzZSBpZiAoIXNraXApIHtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuY29tcG9uZW50RGlkVXBkYXRlKSBjb21wb25lbnQuY29tcG9uZW50RGlkVXBkYXRlKHByZXZpb3VzUHJvcHMsIHByZXZpb3VzU3RhdGUsIHByZXZpb3VzQ29udGV4dCk7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5hZnRlclVwZGF0ZSkgb3B0aW9ucy5hZnRlclVwZGF0ZShjb21wb25lbnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChudWxsICE9IGNvbXBvbmVudC5fX2gpIHdoaWxlIChjb21wb25lbnQuX19oLmxlbmd0aCkgY29tcG9uZW50Ll9faC5wb3AoKS5jYWxsKGNvbXBvbmVudCk7XG4gICAgICAgIGlmICghZGlmZkxldmVsICYmICFpc0NoaWxkKSBmbHVzaE1vdW50cygpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGJ1aWxkQ29tcG9uZW50RnJvbVZOb2RlKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsKSB7XG4gICAgdmFyIGMgPSBkb20gJiYgZG9tLl9jb21wb25lbnQsIG9yaWdpbmFsQ29tcG9uZW50ID0gYywgb2xkRG9tID0gZG9tLCBpc0RpcmVjdE93bmVyID0gYyAmJiBkb20uX2NvbXBvbmVudENvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZSwgaXNPd25lciA9IGlzRGlyZWN0T3duZXIsIHByb3BzID0gZ2V0Tm9kZVByb3BzKHZub2RlKTtcbiAgICB3aGlsZSAoYyAmJiAhaXNPd25lciAmJiAoYyA9IGMuX191KSkgaXNPd25lciA9IGMuY29uc3RydWN0b3IgPT09IHZub2RlLm5vZGVOYW1lO1xuICAgIGlmIChjICYmIGlzT3duZXIgJiYgKCFtb3VudEFsbCB8fCBjLl9jb21wb25lbnQpKSB7XG4gICAgICAgIHNldENvbXBvbmVudFByb3BzKGMsIHByb3BzLCAzLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgIGRvbSA9IGMuYmFzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAob3JpZ2luYWxDb21wb25lbnQgJiYgIWlzRGlyZWN0T3duZXIpIHtcbiAgICAgICAgICAgIHVubW91bnRDb21wb25lbnQob3JpZ2luYWxDb21wb25lbnQpO1xuICAgICAgICAgICAgZG9tID0gb2xkRG9tID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjID0gY3JlYXRlQ29tcG9uZW50KHZub2RlLm5vZGVOYW1lLCBwcm9wcywgY29udGV4dCk7XG4gICAgICAgIGlmIChkb20gJiYgIWMuX19iKSB7XG4gICAgICAgICAgICBjLl9fYiA9IGRvbTtcbiAgICAgICAgICAgIG9sZERvbSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc2V0Q29tcG9uZW50UHJvcHMoYywgcHJvcHMsIDEsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgZG9tID0gYy5iYXNlO1xuICAgICAgICBpZiAob2xkRG9tICYmIGRvbSAhPT0gb2xkRG9tKSB7XG4gICAgICAgICAgICBvbGREb20uX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShvbGREb20sICExKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZG9tO1xufVxuZnVuY3Rpb24gdW5tb3VudENvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICBpZiAob3B0aW9ucy5iZWZvcmVVbm1vdW50KSBvcHRpb25zLmJlZm9yZVVubW91bnQoY29tcG9uZW50KTtcbiAgICB2YXIgYmFzZSA9IGNvbXBvbmVudC5iYXNlO1xuICAgIGNvbXBvbmVudC5fX3ggPSAhMDtcbiAgICBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KSBjb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcbiAgICBjb21wb25lbnQuYmFzZSA9IG51bGw7XG4gICAgdmFyIGlubmVyID0gY29tcG9uZW50Ll9jb21wb25lbnQ7XG4gICAgaWYgKGlubmVyKSB1bm1vdW50Q29tcG9uZW50KGlubmVyKTsgZWxzZSBpZiAoYmFzZSkge1xuICAgICAgICBpZiAoYmFzZS5fX3ByZWFjdGF0dHJfICYmIGJhc2UuX19wcmVhY3RhdHRyXy5yZWYpIGJhc2UuX19wcmVhY3RhdHRyXy5yZWYobnVsbCk7XG4gICAgICAgIGNvbXBvbmVudC5fX2IgPSBiYXNlO1xuICAgICAgICByZW1vdmVOb2RlKGJhc2UpO1xuICAgICAgICBjb2xsZWN0Q29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgICAgIHJlbW92ZUNoaWxkcmVuKGJhc2UpO1xuICAgIH1cbiAgICBpZiAoY29tcG9uZW50Ll9fcikgY29tcG9uZW50Ll9fcihudWxsKTtcbn1cbmZ1bmN0aW9uIENvbXBvbmVudChwcm9wcywgY29udGV4dCkge1xuICAgIHRoaXMuX19kID0gITA7XG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG59XG5mdW5jdGlvbiByZW5kZXIodm5vZGUsIHBhcmVudCwgbWVyZ2UpIHtcbiAgICByZXR1cm4gZGlmZihtZXJnZSwgdm5vZGUsIHt9LCAhMSwgcGFyZW50LCAhMSk7XG59XG52YXIgb3B0aW9ucyA9IHt9O1xudmFyIHN0YWNrID0gW107XG52YXIgRU1QVFlfQ0hJTERSRU4gPSBbXTtcbnZhciBkZWZlciA9ICdmdW5jdGlvbicgPT0gdHlwZW9mIFByb21pc2UgPyBQcm9taXNlLnJlc29sdmUoKS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpIDogc2V0VGltZW91dDtcbnZhciBJU19OT05fRElNRU5TSU9OQUwgPSAvYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmQvaTtcbnZhciBpdGVtcyA9IFtdO1xudmFyIG1vdW50cyA9IFtdO1xudmFyIGRpZmZMZXZlbCA9IDA7XG52YXIgaXNTdmdNb2RlID0gITE7XG52YXIgaHlkcmF0aW5nID0gITE7XG52YXIgY29tcG9uZW50cyA9IHt9O1xuZXh0ZW5kKENvbXBvbmVudC5wcm90b3R5cGUsIHtcbiAgICBzZXRTdGF0ZTogZnVuY3Rpb24oc3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBzID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgaWYgKCF0aGlzLl9fcykgdGhpcy5fX3MgPSBleHRlbmQoe30sIHMpO1xuICAgICAgICBleHRlbmQocywgJ2Z1bmN0aW9uJyA9PSB0eXBlb2Ygc3RhdGUgPyBzdGF0ZShzLCB0aGlzLnByb3BzKSA6IHN0YXRlKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSAodGhpcy5fX2ggPSB0aGlzLl9faCB8fCBbXSkucHVzaChjYWxsYmFjayk7XG4gICAgICAgIGVucXVldWVSZW5kZXIodGhpcyk7XG4gICAgfSxcbiAgICBmb3JjZVVwZGF0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSAodGhpcy5fX2ggPSB0aGlzLl9faCB8fCBbXSkucHVzaChjYWxsYmFjayk7XG4gICAgICAgIHJlbmRlckNvbXBvbmVudCh0aGlzLCAyKTtcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7fVxufSk7XG52YXIgcHJlYWN0ID0ge1xuICAgIGg6IGgsXG4gICAgY3JlYXRlRWxlbWVudDogaCxcbiAgICBjbG9uZUVsZW1lbnQ6IGNsb25lRWxlbWVudCxcbiAgICBDb21wb25lbnQ6IENvbXBvbmVudCxcbiAgICByZW5kZXI6IHJlbmRlcixcbiAgICByZXJlbmRlcjogcmVyZW5kZXIsXG4gICAgb3B0aW9uczogb3B0aW9ucyxcbiAgICB1bm1vdW50Q29tcG9uZW50OiB1bm1vdW50Q29tcG9uZW50XG59O1xuXG5leHBvcnQgZGVmYXVsdCBwcmVhY3RcbmV4cG9ydCB7XG4gICAgaCwgY2xvbmVFbGVtZW50LCBDb21wb25lbnQsIHJlbmRlciwgcmVyZW5kZXIsIG9wdGlvbnMsIHVubW91bnRDb21wb25lbnRcbn0iXX0=


var preact$2 = {
	default: preact,
	h: h$1,
	cloneElement: cloneElement,
	Component: Component,
	render: render$2,
	rerender: rerender,
	options: options,
	unmountComponent: unmountComponent
};

function findWhere(arr, fn, returnIndex, byValueOnly) {
    var i = arr.length;
    while (i--) 
        { if (typeof fn === 'function' && !byValueOnly ? fn(arr[i]) : arr[i] === fn) 
        { break; } }
    return returnIndex ? i : arr[i];
}

var extensions = {
    setAttribute: function setAttribute(name, value) {
        console.log("about to set attribute " + name + " to  " + value);
        this.set(name, value);
    },
    getAttribute: function getAttribute(name) {
        return this[name];
    },
    removeAttribute: function removeAttribute(name) {
        console.log("about to remove attggibute " + name);
        this.set(name, null);
    },
    getAttributeNS: function getAttributeNS(ignored, name, value) {
        return this[name];
    },
    setAttributeNS: function setAttributeNS(ignored, name, value) {
        console.log("about to set attribute " + name + " to  " + value);
        this.set(name, value);
    },
    removeAttributeNS: function removeAttributeNS(name) {
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
                console.log("SETTING NAVBUTT");
                this.navigationButton = child;
                console.log("successfully set navbutt");
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
        console.log(("appending " + (child.nodeName) + " to " + (this.nodeName)), Object.keys(this));
        if ('text' in this && child.splitText != null) {
            this.text = child.nodeValue;
        } else {
            this.childNodes.push(child);
            child.parentNode = this;
        }
        this.callAddChild(child);
    },
    insertBefore: function insertBefore(child, ref) {
        console.log(("inserting " + (child.nodeName) + " before " + (ref.nodeName) + " in  " + (this.nodeName)));
        child.remove();
        var offset = this.childNodes.indexOf(ref);
        child.parentNode = this;
        console.log(("found offset is " + offset + " " + (this.childNodes.length)));
        if (offset !== undefined && offset !== null) {
            this.childNodes.splice(offset, 0, child);
            this.callAddChild(child, offset);
        } else {
            this.childNodes.push(child);
            this.callAddChild(child);
        }
    },
    replaceChild: function replaceChild(child, ref) {
        console.log(("replacing " + (child.nodeName) + " with " + (ref.nodeName)));
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
        console.log(("removing " + (child.nodeName) + " from " + (this.nodeName)));
        if ('text' in this && child.splitText != null) {
            this.text = '';
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
var document$1 = {
    createElement: function createElement(type) {
        if (type === "undefined") {
            type = "stackLayout";
        }
        var originalType = type;
        type = type.toLowerCase();
        var el;
        if (type in types) {
            el = types[type];
        } else {
            var elementRequirePath = 'tns-core-modules/ui/';
            if (type.indexOf("layout") !== -1) {
                elementRequirePath += "layouts/";
            }
            elementRequirePath += convertType(originalType);
            var m = require(elementRequirePath);
            for (var i in m) 
                { if (i.toLowerCase() === type) {
                el = m[i];
                break;
            } }
            Object.assign(el.prototype, extensions);
            Object.defineProperty(el, 'firstChild', {
                get: function get() {
                    return this.childNodes[0];
                }
            });
            Object.defineProperty(el, 'lastChild', {
                get: function get() {
                    return this.childNodes[this.childNodes.length - 1];
                }
            });
            Object.defineProperty(el, 'nextSibling', {
                get: function get() {
                    var p = this.parentNode;
                    if (p) 
                        { return p.childNodes[findWhere(p.childNodes, this, true) + 1]; }
                }
            });
            Object.defineProperty(el, 'previousSibling', {
                get: function get() {
                    var p = this.parentNode;
                    if (p) 
                        { return p.childNodes[findWhere(p.childNodes, this, true) - 1]; }
                }
            });
            types[type] = el;
        }
        el = new el();
        el.loaded = false;
        el.firstLoad = true;
        el.nodeType = 1;
        el.nodeName = type.toUpperCase();
        el.attributes = [];
        el.childNodes = [];
        el.set = (function (name, value) {
            console.log("callinggset with " + name + " and " + value);
            el[name] = value;
        });
        return el;
    },
    createTextNode: function createTextNode(text) {
        console.log("creating textnode" + text);
        var el = document$1.createElement("label");
        el.text = text;
        Object.defineProperty(el, 'nodeValue', {
            set: function set(v) {
                this.text = v;
            },
            get: function get() {
                return this.text;
            }
        });
        el.splitText = (function () { return null; });
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
                console.log("attempting to remove body child");
                var childIndex = parent.childNodes.indexOf(child);
                if (childIndex !== -1) {
                    parent.childNodes.splice(childIndex, 1);
                }
            },
            remove: function () {
                console.log("attempting to remove body");
            }
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

export { preact$2 as Preact, render };
export default render;
//# sourceMappingURL=preact-to-nativescript.m.js.map
