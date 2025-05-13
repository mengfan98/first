按钮图片的加载

set skin 中Laya.loader（LoaderManager）查看是否存在缓存资源，若已有资源纹理缓存文件则直接加载，否则使用load方法从网络拉取资源。

LoaderManager中的load方法

参数1：资源组或单个资源名；

参数2：资源加载完成后的handler方法；

参数3：资源加载中的handler方法；

参数4：资源加载类型（例如：图像、文本等）；

参数5：加载资源进程优先级；

参数6：是否缓存加载资源，以便下次更快获取；

参数7：将资源分组，方便管理某组资源加载；

参数8：是否忽视缓存（设为true的话，表示即使当前资源被缓存，依旧重新加载资源）；

参数9：是否使用webwork加载，在后台线程中加载，提高主线程响应速度。

如果是资源组，则？？？

如果是单个资源，判断当前资源类型，如果是image，则判断loader.textureMap中是否存在资源实体；否则判断loader.loadedMap中是否存在资源实体。

资源可以直接获取的话则进行加载完后的操作处理（加载完成，发送完成资源加载的事件）；return this;

不可以直接获取的话，则在图集管理控制器（AtlasInfoManager）中获取；先判断图集资源名是否与当前资源名相同，不相同则为图集，相同的话originalUrl（？？？）设为空。

接着判断LoaderManager._resMap（？？？）中是否存在当前资源。

不存在的话new一个resinfo(resinfo继承laya.EventDispatcher，继承后的resinfo无其它函数拓展或重写，主要用于监听资源加载中的事件和已完成后的事件处理，resinfo带参--资源路径、资源类型、资源分组、是否忽视缓存、使用worker、originalUrl)。

并向LoaderManager._resMap添加当前资源索引信息、向Loader.resInfos添加当前资源的优先级、Loader.statinfo.count++(资源加载统计数量)、发送正在处理资源的事件(传递数据为当前加载中的进度)、管理资源加载的调度--（如果loaderCount即加载器数量没有达到最大限制时，选择优先级高的资源进行加载，加载器数量为0后，则发送资源加载已完成的事件；加载中的时候new一个 loader加载器，loader继承Laya.EventDispatcher，该对象监听资源加载中和已完成的事件，loader.load处理优先级最高的资源，即resinfo）

Loader中的load方法

参数1：要加载的资源url；

参数2：资源类型；

参数3：是否缓存资源；

参数4：资源的分组；

参数5：是否使用worker







