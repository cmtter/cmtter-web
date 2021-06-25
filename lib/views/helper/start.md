---
title: 开始
slug: home
---

# 介绍

## 功能开发

- 实现脚手架

  脚手架主要的目的是解决了以下问题：

  - 提供开发、生产环境的 build
  - 收敛 所有 非业务功能的通用交互实现，例如主题布局、鉴权、异常处理、mock、全局状态等等
  - 简化路由的配置、统一了路由的处理及创建规范
  - 简化工程目录结构的复杂度
  - 提供常用的非 js 资源的处理
  - 收敛及简化了对 build、runetime 阶段的配置处理
  - 支持灵活的扩展

* 实现通用组件库封装

  针对企业级开发场景，我们针对最高频常用的控件进行了封装，以便于提供开发效率，涉及的组件主要包括三类：

  - 输入表单
  - 选择表单
  - 表格
  - 弹性栅格布局

  [在线演示](/uidemos)

- 实现低代码在线页面开发

  [在线演示](/devopts)

- 实现开发规范

  - 功能模块代码目录 views
  - 目录规则


    ```js
      a. -* | _* | components:    目录或文件 会被认为是依赖，而不会生产页面路由
      b . ~xxx.vue: ~前缀的vue页面会生成动态路由，动态参数名称为id
      c. 资源路径@lib前缀： 代表访问lib目录下的资源
      d. .joyin 是临时目录, 禁止更改
    ```

## 参考实现

- [https://github.com/cmtter/cmtter-web](https://github.com/cmtter/cmtter-web)

## 环境

```bash

  nodejs 12.14 +

```

## 开始使用

```bash
1. 下载工程代码
2. cd lib 进入lib目录,执行yarn 安装依赖
3. cd ../ 返回上一级目录
4. node .\lib\scripts\cli.js serve -m dev 启动开发模式
5. 生产打包 node .\lib\scripts\cli.js build -m prod

```
