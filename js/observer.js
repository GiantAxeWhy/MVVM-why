class Observer {
  constructor(data) {
    this.data = data;
    this.walk(data);
  }
  walk(data) {
    let me = this;
    Object.keys(data).forEach(function (key) {
      me.convert(key, data[key]);
    });
  }
  convert(key, val) {
    this.defineReactive(this.data, key, val);
  }
  defineReactive(data, key, val) {
    let dep = new Dep();
    console.log(123);
    let childObj = observe(val);
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get: function () {
        // 由于需要在闭包内添加watcher，所以通过Dep定义一个全局target属性，暂存watcher, 添加完移除
        //Dep.target就是他妈的新的watcher
        if (Dep.target) {
          dep.depend();
        }
        console.log(123);
        return val;
      },
      set: function (newVal) {
        if (newVal === val) {
          return;
        }
        console.log("newVal", newVal);
        val = newVal;
        childObj = observe(newVal);
        dep.notify();
      },
    });
  }
}
function observe(value, vm) {
  if (!value || typeof value !== "object") {
    return;
  }

  return new Observer(value);
}
let uid = 0;
class Dep {
  constructor() {
    this.id = uid++;
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub);
  }
  depend() {
    Dep.target.addDep(this);
  }
  removeSub(sub) {
    var index = this.subs.indexOf(sub);
    if (index != -1) {
      this.subs.splice(index, 1);
    }
  }
  notify() {
    this.subs.forEach(function (sub) {
      sub.update();
    });
  }
}
Dep.target = null;
