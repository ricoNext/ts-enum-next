type EnumValueType = number | string;

abstract class Enum<T extends string | number = string | number> {
	private static _values: Map<typeof Enum, Enum[]> = new Map();
	private static _valueMap: Map<typeof Enum, Map<EnumValueType, Enum>> = new Map();
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
	static values<T extends Enum>(this: new (...args: any[]) => T): T[] {
		return (Enum._values.get(this as unknown as typeof Enum) as T[]) || [];
	}

	// 通过值获取枚举实例
	static fromValue<T extends Enum>(this: new (...args: any[]) => T, value: T['value']): T | undefined {
		if (value === undefined || value === null) return undefined;
		const valueMap = Enum._valueMap.get(this as unknown as typeof Enum);
		if (!valueMap) return undefined;
		return valueMap.get(value) as T | undefined;
	}

	// 通过名称获取枚举实例
	static fromName<T extends Enum>(this: new (...args: any[]) => T, name: string): T | undefined {
		if (name === undefined || name === null || name === '') return undefined;
		const nameMap = Enum._nameMap.get(this as unknown as typeof Enum);
		if (!nameMap) return undefined;
		return nameMap.get(name) as T | undefined;
	}

	// 创建枚举集合
	static setOf<T extends Enum>(this: new (...args: any[]) => T, ...items: T[]): Set<T> {
		return new Set(items);
	}

	// 创建枚举映射表
	static enumMap<V, T extends Enum = Enum>(
		this: new (...args: any[]) => T,
		map: Record<string | number, V>
	): Map<T, V> {
		const result = new Map<T, V>();
		for (const [key, value] of Object.entries(map)) {
			// 判断 key 是否为纯数字字符串
			const isNumericKey = /^\d+$/.test(key);
			let enumKey: T | undefined;
			try {
				enumKey = isNumericKey
					? ((this as any).fromValue(Number(key) as T['value']) as T)
					: ((this as any).fromName(key) as T);
			} catch {
				// 如果找不到对应的枚举值，跳过该键
				continue;
			}
			if (enumKey) {
				result.set(enumKey, value);
			}
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



/**
 * 枚举数组, 用于 Antd Select 组件的 options 参数
 * @param enums
 * @returns
 */
export const enumOptions = (
	enums: any
) =>
	enums.values().map((i: any) => ({
		...i,
		label: i.name,
		value: i.value,
	}));
