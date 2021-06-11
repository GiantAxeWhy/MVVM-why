/* MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果。
 */
class MVVM {
  constructor(options) {
    this.$options = options || {};
    let data = (this._data = this.$options.data);
    let me = this;
    Object.keys(data).forEach(function (key) {
      me._proxyData(key);
    });
    this._initComputed();
    observe(data, this);
    this.$compile = new Compile(options.el || document.body, this);
  }
  $watch(key, cb, options) {
    new Watcher(this, key, cb);
  }
  _proxyData(key, setter, getter) {
    let me = this;
    setter =
      setter ||
      Object.defineProperty(me, key, {
        configurable: false,
        enumerable: false,
        get: function proxyGetter() {
          return me._data[key];
        },
        set: function proxySetter(newVal) {
          me._data[key] = newVal;
        },
      });
  }
  _initComputed() {
    var me = this;
    var computed = this.$options.computed;
    Object.keys(computed).forEach(function (key) {
      Object.defineProperty(me, key, {
        get:
          typeof computed[key] === "function"
            ? computed[key]
            : computed[key].get,
        set: function () {},
      });
    });
  }
}
