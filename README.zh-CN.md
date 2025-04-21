# ts-enum-next

<b>English | <a href="./README.zh-CN.md">中文</a></b>

- TypeScript 中下一代枚举的终极解决方案

- 像在 java 中使用 enum 一样，在 typescript 中定义和使用 enum。

## 为什么？ 

在 typescript 中使用 enum 来定义数字枚举和字符串枚举是非常方便的， 但是在面对一些数字字典类型的枚举做定义时就有点力不从心, 比如我们定义一组状态时需要同时定义状态的名称， 我们可以就需要结合 typescript 中的枚举和映射对象来实现

```ts
enum Status {
    PENDING = 0,
    APPROVED = 1,
    REJECTED = 2
}

const StatusDescriptions = {
    [Status.PENDING]: "等待处理",
    [Status.APPROVED]: "已批准",
    [Status.REJECTED]: "已拒绝"
};

// 使用示例
console.log(Status.PENDING); // 0
console.log(StatusDescriptions[Status.PENDING]); // "等待处理"
```

在简单的项目中，这样维护“数据字典”是一个不错的方法， 但是在复杂的项目中，我们可能会需要维护大量的“数据字典”， 并且这些“数据字典” 可能需要一些继承一些“字典” 生成新的“字典”，或者业务中我们对一组枚举值中的不同描述展示不同的颜色或者执行不同的方法，这时 typescript 原生的 enum 就开始显得力不从心了

ts-enum-next 根据 java 中对于 enum 的定义和使用，提供了一套类似于 java 的 enum 定义和使用范式， 你可以实现基于 Class 的枚举定义和使用。


## 使用

### 安装

```bash
pnpm add ts-enum-next
```

### 定义数据字典
```ts
class HttpStatus extends Enum<number> {
	static readonly OK = new HttpStatus(200, 'OK', '请求成功');
	static readonly BAD_REQUEST = new HttpStatus(400, 'BAD_REQUEST', '错误请求');
	static readonly NOT_FOUND = new HttpStatus(404, 'NOT_FOUND');
}
```

### 使用数据字典

* 获取字典项 

```ts
console.log(HttpStatus.OK.description); // "请求成功"
console.log(HttpStatus.fromValue(404).name); // "NOT_FOUND"
console.log(HttpStatus.fromName("BAD_REQUEST").value); // 400
```

* 获取所有枚举值

```ts
const allStatuses = HttpStatus.values();
console.log(allStatuses.map(s => s.name)); // ["OK", "BAD_REQUEST", "NOT_FOUND"]
```

* 使用枚举集合

```ts
const errorStatuses = HttpStatus.setOf(
    HttpStatus.BAD_REQUEST,
    HttpStatus.NOT_FOUND
);
console.log(errorStatuses.has(HttpStatus.fromValue(400))); // true
```

* 使用枚举映射表

```ts
const statusMessages = HttpStatus.enumMap({
    [HttpStatus.OK.value]: "操作成功",
    [HttpStatus.BAD_REQUEST.value]: "请求错误",
    "NOT_FOUND": "资源不存在" // 支持名称或值作为键
});
console.log(statusMessages.get(HttpStatus.NOT_FOUND)); // "资源不存在"
``


