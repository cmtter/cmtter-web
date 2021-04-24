# cmtter-web

草稿版本(优先实现一些企业级应用系统前端开发的通用场景， 最后会重新设计并重构脚手架)

# 安装

```
进入 lib 目录 执行 yarn 或者 npm install
```

# 启动

```
  node .\lib\scripts\cli.js serve -m dev

```

# 构建 Prod

```
  node .\lib\scripts\cli.js build -m dev

```

# 业务协议涉及

```

/**
  以保存用户为例：
  需求：
    1. 新增用户不能为“黑名单用户”
    2. 用户名、年龄、学历、身份证号码不能为空
    3. 学历必须有效
    4. 记录操作日志
 */
{

  name: '新增用户'

  /**
  entry:
    用户定义业务接口的 入参生命： 包括参数名称、参数类型, 参数结构
  */
  entry: {
      name: String, //用户名称
      idcard: String, //身份证号码
      age: number, //年龄
      xueli: String, //学历
      code // 用户代码

  }
  /**
    用于初始化、解析、校验、转换参数,
  */
  loaders: [
      //初始化： 初始化当前执行上下文参数：用户、时间、
      ['application-context-loader', {context: 'global'}],
      //解析： 根据用户获取黑名单信息
      ['blacklist-loader', {useId: 'entry.idcard', context: 'blacklist'}],
      //获取学历信息
      ['xueli-loader', {useId: 'entry.idcard', context: 'xueli'}],
      //校验：“entry.*” 代表所有的入参
      ['require-loader', {include: ['entry.name', 'entry.age', 'entry.idCard', 'entry.xueli'], context: 'validater'}]
  ],

  /**
    loader 和 run 在执行阶段都会产生不同的hook事件，而这些事件都会被 配置的插件处理,
    可以灵活的自定义loader或run的 阶段hook，以便于plugin能够更加精准的处理
  */
  plugins: [

  /**
  插件： blacklist-loader 处理完毕会发布" blacklist" 事件，由于When-not-empty-plugin通过keys订阅了 blacklist事件
    */
  [
    'When-not-empty-plugin', {
        keys: ['blacklist']
        optioins: [
          {
            message: '保存失败, 该用户已被拉入黑名单',
            args: ['blacklist.data']
          }
        ]
    }
  ],
  /**
    插件： xueli-loader获取学历信息之后，会触发 xueli事件
    */
  [
    "when-is-empty", {
      keys: ['xueli'],
      options: [
        {
          message: '保存失败：学历验证为无效',
          args: ['xueli.data']
        }
      ]
    }
  ]
  ],
  // 执行最终的业务持久化
  run: [
    ['save-oracle-table', {table: 'db-user'}],
    ['save-log', {message: '新增用户[entry.name]'}]
  ]

}


```
