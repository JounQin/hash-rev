# hash-rev
使用 gulp-rev-all 方案实现的文件名 hash 版本号 + 项目实际应用的演示项目

本项目主要演示了使用 [gulp-rev-all](https://github.com/smysnk/gulp-rev-all) 将项目文件名全部 hash 化以充分利用文件缓存，同时解决缓存不更新的问题。

内置了一个 Node.js 实现的静态资源服务器(via [JacksonTian](https://cnodejs.org/topic/4f16442ccae1f4aa27001071))，用于处理常规文件名与 hash 文件名访问的映射。

此方案对缓存的利用与更新很有效，但依旧存在浪费更新的问题如下：

> 若 a.js 引用了 b.js ,当 b.js 更新而 a.js 未更新时，由于 b 的内容更新导致其 hash 值变化，而 a 中又引入了变化了文件名的 b，继而导致 a 的 hash 值也变化了，最终导致即使 a 的源码内容没有任何变化，但是新发布代码时 a 的 hash 文件名也变化了，a 的缓存更新实质上属于浪费。

> 例如：requireJs 方式的 main.js 中包含公共模块的路径，大部分情况下 main.js 是不需要更新的，但实际上只有其中一个模块更新了源码，main.js 也将更名。

如果对此有所顾虑，请移步 [res-hash-guide](https://github.com/JounQin/res-hash-guide) 查看另一种版本号 hash 方案。

--

使用步骤：

1. clone 项目
2. 运行 `npm i`
3. 运行 `gulp`
4. 运行 `node app`
5. 访问 [测试页 localhost:9090/HashRev/modules/test/html](localhost:9090/HashRev/modules/test/html)
6. 根据实际需要调整方案

--

但愿这份指南对你有用，如有问题请直接提交 issue 或 pull request 共同改进，谢谢！