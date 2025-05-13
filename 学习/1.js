// const objectTracker = (() => {
//     const instances = new WeakMap();
//     let creationCount = 0;

//     function trackObject(obj) {
//         creationCount++;
//         const refCount = instances.get(obj) || 0;
//         instances.set(obj, refCount + 1);
//         console.log(`对象创建次数: ${creationCount}`);
//         console.log(`对象引用次数: ${instances.get(obj)}`);
//     }

//     function untrackObject(obj) {
//         const refCount = instances.get(obj) || 0;
//         if (refCount > 0) {
//             instances.set(obj, refCount - 1);
//             console.log(`对象引用次数减少到: ${instances.get(obj)}`);
//             if (instances.get(obj) === 0) {
//                 instances.delete(obj);
//                 console.log('对象被销毁');
//             }
//         }
//     }

//     function createTrackedObject(target) {
//         return new Proxy(target, {
//             construct(target, args) {
//                 const instance = new target(...args);
//                 trackObject(instance);
//                 return new Proxy(instance, {
//                     get(obj, prop) {
//                         if (prop === 'destroy') {
//                             return function () {
//                                 untrackObject(obj);
//                                 // 这里可以添加实际的销毁逻辑
//                                 // 例如: for (let key in obj) delete obj[key];
//                             };
//                         }
//                         return obj[prop];
//                     }
//                 });
//             }
//         });
//     }

//     return {
//         createTrackedObject,
//     };
// })();
// class classA {
//     constructor () {
//         console.log('新对象已创建');
//     }
// }
// // 使用示例
// const TrackedClass = objectTracker.createTrackedObject(classA);

// const obj1 = new TrackedClass();
// const obj2 = new TrackedClass();

// obj1.destroy(); // 模拟 obj1 的销毁
// obj2.destroy(); // 模拟 obj2 的销毁



// 确保已启用 --expose-gc
if (typeof global.gc !== 'function') {
    throw new Error('请使用 --expose-gc 参数运行 Node.js');
}
// 测试Map的内存占用
global.gc();
console.log(`初始内存: ${process.memoryUsage().heapUsed / 1024 / 1024} MB`);

let key = { id: "test" };
const map = new Map();
map.set(key, new Array(10 * 1024 * 1024));  // 存储10MB数组
key = null;  // 释放引用
console.log(map.size)

// global.gc();
// console.log(`Map内存: ${process.memoryUsage().heapUsed / 1024 / 1024} MB`);
// 输出显著增加（约10MB），Map阻止垃圾回收[1](@ref)

// 测试WeakMap的内存占用
key = { id: "test" };
const weakMap = new WeakMap();
weakMap.set(key, new Array(10 * 1024 * 1024));
key = null;  // 释放引用
console.log(weakMap.size)

global.gc();
setTimeout(() => {
    console.log(`WeakMap内存: ${process.memoryUsage().heapUsed / 1024 / 1024} MB`);
}, 10000)

// 内存回落，WeakMap不阻止垃圾回收[1](@ref)
