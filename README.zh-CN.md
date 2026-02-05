# 使用 ts-enum-next 优雅的管理 typeScript enum

[![codecov](https://codecov.io/github/ricoNext/ts-enum-next/branch/main/graph/badge.svg?token=HI4FJO2405)](https://codecov.io/github/ricoNext/ts-enum-next)

在业务中，我们可能需要同时定义枚举值和枚举值说明，前者用来匹配，后者用来展示。

在 typescript 中可以使用 ***枚举 + 映射对象***的方式实现。

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

或者使用对象字面量模拟枚举

```ts
const Status = {
    PENDING: {
        value: 0,
        description: "等待处理"
    },
    APPROVED: {
        value: 1,
        description: "已批准"
    },
    REJECTED: {
        value: 2,
        description: "已拒绝"
    }
} as const;

// 使用示例
console.log(Status.PENDING.value); // 0
console.log(Status.PENDING.description); // "等待处理"
```

在业务中，我们除了需要这样简单的枚举定义类型， 我们还会需要处理很多`数据字典`的业务场景。尤其是在以 Node 构建的服务端，可能需要使用类的能力来定义这些枚举值， 以方便包含其他字段、方法、构造函数、描述元数据等能力。

[ts-enum-next](https://github.com/ricoNext/ts-enum-next) 根据在 Java 中使用 enum 的场景，封装了一个抽象类 Enum 和一些辅助的工具类型， 来提供类似 Java 的枚举功能：

* Java 形式的数据定义
* 丰富的枚举元数据
* 双向查找能力
* 枚举集合操作
* 自定义行为支持

## ts-enum-next 的使用场景

### 场景1： 基础枚举定义（带值和描述）

定义枚举时， 同时添加： 枚举值、枚举名称、枚举描述元数据（可选）

```ts
import { Enum } from 'ts-enum-next';

class HttpStatus extends Enum<number> {
    static readonly OK = new HttpStatus(200, "OK", "请求成功");
    static readonly BAD_REQUEST = new HttpStatus(400, "BAD_REQUEST", "错误请求");
    static readonly NOT_FOUND = new HttpStatus(404, "NOT_FOUND", "资源未找到");
}


// 使用示例
console.log(HttpStatus.OK.value); // 200
console.log(HttpStatus.OK.name); // "OK"
console.log(HttpStatus.OK.description); // "请求成功"
```

在 Enum 接收的泛型参数中， 除了传入的是枚举值的类型， 如 number、string、boolean 等。 还可以传入一个联合类型， 如 `200 ｜ 400 ｜404`， 这样就可以定义一个联合类型的枚举。

```ts
import { Enum } from 'ts-enum-next';
type HttpStatusValue = 200 | 400 | 404;

class HttpStatus extends Enum<HttpStatusValue> {
    static readonly OK = new HttpStatus(200, "OK", "请求成功");
    static readonly BAD_REQUEST = new HttpStatus(400, "BAD_REQUEST", "错误请求");
    static readonly NOT_FOUND = new HttpStatus(404, "NOT_FOUND", "资源未找到");
}


// 使用示例
console.log(HttpStatus.OK.value); // 200
console.log(HttpStatus.OK.name); // "OK"
console.log(HttpStatus.OK.description); // "请求成功"

// status 使用 HttpStatusValue 类型
type ResultData = {
    status: HttpStatusValue,
    message: string,
}
```

#### 适用场景

* 需要为枚举值附加元信息（如状态码描述）
* 需要根据数值快速查找对应的枚举实例
* 需要保持严格的类型安全

### 场景2： 枚举集合操作

```ts
// 获取所有枚举实例， 返回的是所有的枚举类
console.log(HttpStatus.values());  // [HttpStatus, HttpStatus, HttpStatus, ....]

 // 通过值获取枚举实例
 console.log(HttpStatus.fromValue(200));  // HttpStatus(200, "OK", "请求成功")
 
 // 通过名称获取枚举实例
  console.log(HttpStatus.fromName('OK'));  // HttpStatus(200, "OK", "请求成功")
  
  
 // 创建枚举集合， 对枚举值进行分组管理
const errorStatus = HttpStatus.setOf(
       HttpStatus.BAD_REQUEST,  
       HttpStatus.NOT_FOUND
);

console.log(errorStatus); // Set(2) {HttpStatus, HttpStatus}


// 检查包含关系
const currentStatus = HttpStatus.fromValue(400)

if (errorStatus.has(currentStatus))) {
    console.error("当前是错误状态:", currentStatus.description);
}
```

**适用场景**：

* 需要分组管理枚举值（如所有错误状态）
* 需要检查枚举值是否属于某个特定集合
* 需要遍历枚举的所有可能值

### 场景 3：枚举映射表

```ts
// 创建枚举到字符串的映射
const statusMessages = HttpStatus.enumMap<string>({
    [HttpStatus.OK]: "操作成功完成",
    [HttpStatus.BAD_REQUEST]: "请检查您的请求参数",
    [HttpStatus.NOT_FOUND]: "请求的资源不存在"
});

// 使用映射
console.log(statusMessages.get(HttpStatus.NOT_FOUND)); // “请求的资源不存在”
```

### 场景 7：为 Ant Design `Select` 生成枚举下拉项

```ts
import { Enum, enumOptions } from "ts-enum-next";

class HttpStatus extends Enum<number> {
    static readonly OK = new HttpStatus(200, "OK", "请求成功");
    static readonly BAD_REQUEST = new HttpStatus(400, "BAD_REQUEST", "错误请求");
    static readonly NOT_FOUND = new HttpStatus(404, "NOT_FOUND", "资源未找到");
}

const options = enumOptions(HttpStatus);
// options:
// [
//   { label: "OK", value: 200 },
//   { label: "BAD_REQUEST", value: 400 },
//   { label: "NOT_FOUND", value: 404 }
// ]
```

**适用场景**：

* 需要为不同枚举值关联不同的数据
* 需要高效查找枚举对应的资源
* 需要类型安全的键值存储

### 场景 4：自定义枚举方法

```ts
class OrderStatus extends Enum<number> {
    static readonly CREATED = new OrderStatus(0, "CREATED");
    static readonly PAID = new OrderStatus(1, "PAID");
    static readonly SHIPPED = new OrderStatus(2, "SHIPPED");
    
    private constructor(
        public readonly value: number,
        public readonly name: string
    ) {
        super();
    }
    
    // 自定义方法
    public canTransitionTo(target: OrderStatus): boolean {
        const validTransitions = {
            [OrderStatus.CREATED.value]: [OrderStatus.PAID.value],
            [OrderStatus.PAID.value]: [OrderStatus.SHIPPED.value]
        };
        return validTransitions[this.value]?.includes(target.value) || false;
    }
}

// 使用自定义方法
const current = OrderStatus.CREATED;
console.log(current.canTransitionTo(OrderStatus.PAID)); // true
console.log(current.canTransitionTo(OrderStatus.SHIPPED)); // false
```

**适用场景**：

* 需要为枚举添加业务逻辑
* 需要实现状态机或工作流
* 需要封装枚举相关的复杂判断逻辑

### 场景 5：枚举序列化/反序列化

```ts
class UserRole extends Enum<string> {
    static readonly ADMIN = new UserRole("admin", "Administrator");
    static readonly EDITOR = new UserRole("editor", "Content Editor");
    static readonly VIEWER = new UserRole("viewer", "Read-only User");
    
    private constructor(
        public readonly value: string,
        public readonly displayName: string
    ) {
        super();
    }
    
    // JSON序列化
    public toJSON() {
        return this.value;
    }
    
    // 从JSON反序列化
    public static fromJSON(value: string): UserRole {
        return UserRole.fromValue(value);
    }
}

// 序列化示例
const role = UserRole.ADMIN;
const json = JSON.stringify(role); // ""admin""

// 反序列化示例
const parsedRole = UserRole.fromJSON(JSON.parse(json));
console.log(parsedRole === UserRole.ADMIN); // true
```

**适用场景**：

* 需要将枚举与JSON相互转换
* 需要处理API响应中的枚举值
* 需要保持前后端枚举值的一致性

### 场景 6：获取原始枚举值类型

```ts
import { Enum， EnumValues } from 'ts-enum-next';

class HttpStatus extends Enum<200 ｜ 400 ｜ 404> {
    static readonly OK = new HttpStatus(200, "OK", "请求成功");
    static readonly BAD_REQUEST = new HttpStatus(400, "BAD_REQUEST", "错误请求");
    static readonly NOT_FOUND = new HttpStatus(404, "NOT_FOUND", "资源未找到");
}

// 获取HttpStatus 的原始枚举值类型
export type HttpStatusEnum = EnumValues<typeof HttpStatus>;

// 使用原始枚举值类型再去定义其他类型
export type ResponseData<T> = {
 message: string;
 data: T;
 code: HttpStatusEnum;
};
```

**适用场景**：

* 需要获取原始枚举值类型
* 使用原始枚举值类型再去定义其他类型
