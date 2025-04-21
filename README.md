# ts-enum-next

<b>English | <a href="./README.zh-CN.md">中文</a></b>

- The ultimate solution for next-generation enumeration in TypeScript

- Define and use enum in typescript like using enum in java.

## Why？ 

It is very convenient to use enum to define numeric enums and string enums in typescript, but when you are defining some enums of numeric dictionary types, you are a little overwhelmed. For example, when we define a set of states, we need to define the name of the state at the same time. We can combine enumerations and mapping objects in typescript to implement it.

```ts
enum Status {
    PENDING = 0,
    APPROVED = 1,
    REJECTED = 2
}

const StatusDescriptions = {
    [Status.PENDING]: "waiting",
    [Status.APPROVED]: "Approved",
    [Status.REJECTED]: "reject"
};

console.log(Status.PENDING); // 0
console.log(StatusDescriptions[Status.PENDING]); // "waiting"
```

In simple projects, maintaining a "data dictionary" is a good way to do this, but in complex projects, we may need to maintain a large number of "data dictionaries", and these "data dictionaries" may require some inheritance of some "dictionaries" to generate new "dictionaries", or in the business we display different colors for different descriptions in a set of enum values ​​or perform different methods. At this time, the native enum of typescript begins to appear unsatisfied.

ts-enum-next According to the definition and use of enum in java, an enum definition and use paradigm similar to java is provided. You can implement Class-based enum definition and use.

## How to use？

### install

```bash
pnpm add ts-enum-next
```

### Define data dictionary
```ts
class HttpStatus extends Enum<number> {
	static readonly OK = new HttpStatus(200, 'OK', 'Request succeeded');
	static readonly BAD_REQUEST = new HttpStatus(400, 'BAD_REQUEST', 'Error request');
	static readonly NOT_FOUND = new HttpStatus(404, 'NOT_FOUND');
}
```

### 使用数据字典

* 获取字典项 

```ts
console.log(HttpStatus.OK.description); // "Request succeeded"
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
    [HttpStatus.OK.value]: "Operation is successful",
    [HttpStatus.BAD_REQUEST.value]: "Request error",
    "NOT_FOUND": "The resource does not exist" 
});
console.log(statusMessages.get(HttpStatus.NOT_FOUND)); // "The resource does not exist"
``


