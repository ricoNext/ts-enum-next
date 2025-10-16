type EnumValueType = number | string;

abstract class Enum<T extends string | number = string | number> {
	private static _values: Map<typeof Enum, Enum[]> = new Map();
	private static _valueMap: Map<typeof Enum, Map<any, Enum>> = new Map();
	private static _nameMap: Map<typeof Enum, Map<string, Enum>> = new Map();

	constructor(
		public readonly value: T,
		public readonly name: string,
		/**
		 * @description 附加说明
		 */
		public readonly description?: unknown
	) {
		const enumClass = this.constructor as typeof Enum;

		// 初始化存储结构
		if (!Enum._values.has(enumClass)) {
			Enum._values.set(enumClass, []);
			Enum._valueMap.set(enumClass, new Map());
			Enum._nameMap.set(enumClass, new Map());
		}

		// 注册当前枚举实例
		Enum._values.get(enumClass)!.push(this);
		Enum._valueMap.get(enumClass)!.set(value, this);
		Enum._nameMap.get(enumClass)!.set(name, this);
	}

	// 获取所有枚举值
	static values<T extends Enum>(): T[] {
		return (this._values.get(this) as T[]) || [];
	}

	// 通过值获取枚举实例
	static fromValue<T extends Enum>(this: any, value: T['value']): T {
		const enumInstance = this._valueMap.get(this)?.get(value);
		if (!enumInstance) {
			console.error(`No enum value ${value} found`);
		}
		return enumInstance as T;
	}

	// 通过名称获取枚举实例
	static fromName<T extends Enum>(this: any, name: string): T {
		const enumInstance = this._nameMap.get(this)?.get(name);
		if (!enumInstance) {
			console.error(`No enum name ${name} found`);
		}
		return enumInstance as T;
	}

	// 创建枚举集合
	static setOf<T extends Enum>(this: any, ...items: T[]): Set<T> {
		return new Set(items);
	}

	// 创建枚举映射表
	static enumMap<V>(this: any, map: Record<string | number, V>): Map<Enum, V> {
		const result = new Map<Enum, V>();
		for (const [key, value] of Object.entries(map)) {
			const enumKey = isNaN(Number(key)) ? (this.fromName(key) as Enum) : (this.fromValue(key as any) as Enum);
			result.set(enumKey, value);
		}
		return result;
	}

	// 重写toString方法
	toString(): string {
		return this.name;
	}

	// 重写valueOf方法
	valueOf(): string {
		return String(this.value);
	}
}

export type EnumValues<T> = {
	[K in keyof T]: T[K] extends Enum<infer V> ? V : never;
}[keyof T];

export { Enum };
export type { EnumValueType };

