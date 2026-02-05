import { describe, expect, it } from 'vitest';
import { Enum, EnumValueType, EnumValues } from './index';

// 定义测试用的枚举类
class HttpStatus extends Enum<number> {
	static readonly OK = new HttpStatus(200, 'OK', 'Request succeeded');
	static readonly CREATED = new HttpStatus(201, 'CREATED', 'Resource created');
	static readonly BAD_REQUEST = new HttpStatus(400, 'BAD_REQUEST', 'Invalid request');
	static readonly NOT_FOUND = new HttpStatus(404, 'NOT_FOUND', 'Resource not found');
	static readonly SERVER_ERROR = new HttpStatus(500, 'SERVER_ERROR', 'Internal server error');
}

class OrderStatus extends Enum<string> {
	static readonly PENDING = new OrderStatus('PENDING', 'Pending', 'Order is pending');
	static readonly PROCESSING = new OrderStatus('PROCESSING', 'Processing', 'Order is being processed');
	static readonly COMPLETED = new OrderStatus('COMPLETED', 'Completed', 'Order completed');
	static readonly CANCELLED = new OrderStatus('CANCELLED', 'Cancelled', 'Order cancelled');
}

class Priority extends Enum<number> {
	static readonly LOW = new Priority(1, 'LOW');
	static readonly MEDIUM = new Priority(2, 'MEDIUM');
	static readonly HIGH = new Priority(3, 'HIGH');
}

describe('Enum', () => {
	describe('Constructor and basic properties', () => {
		it('should create enum instance with value, name and description', () => {
			expect(HttpStatus.OK.value).toBe(200);
			expect(HttpStatus.OK.name).toBe('OK');
			expect(HttpStatus.OK.description).toBe('Request succeeded');
		});

		it('should create enum instance without description', () => {
			expect(Priority.LOW.value).toBe(1);
			expect(Priority.LOW.name).toBe('LOW');
			expect(Priority.LOW.description).toBeUndefined();
		});

		it('should support string value enums', () => {
			expect(OrderStatus.PENDING.value).toBe('PENDING');
			expect(OrderStatus.PENDING.name).toBe('Pending');
			expect(OrderStatus.PENDING.description).toBe('Order is pending');
		});

		it('should support number value enums', () => {
			expect(HttpStatus.NOT_FOUND.value).toBe(404);
			expect(HttpStatus.NOT_FOUND.name).toBe('NOT_FOUND');
		});
	});

	describe('values()', () => {
		it('should return all enum values for HttpStatus', () => {
			const values = HttpStatus.values();
			expect(values).toHaveLength(5);
			expect(values).toContain(HttpStatus.OK);
			expect(values).toContain(HttpStatus.CREATED);
			expect(values).toContain(HttpStatus.BAD_REQUEST);
			expect(values).toContain(HttpStatus.NOT_FOUND);
			expect(values).toContain(HttpStatus.SERVER_ERROR);
		});

		it('should return all enum values for OrderStatus', () => {
			const values = OrderStatus.values();
			expect(values).toHaveLength(4);
			expect(values).toContain(OrderStatus.PENDING);
			expect(values).toContain(OrderStatus.PROCESSING);
			expect(values).toContain(OrderStatus.COMPLETED);
			expect(values).toContain(OrderStatus.CANCELLED);
		});

		it('should return all enum values for Priority', () => {
			const values = Priority.values();
			expect(values).toHaveLength(3);
			expect(values).toContain(Priority.LOW);
			expect(values).toContain(Priority.MEDIUM);
			expect(values).toContain(Priority.HIGH);
		});

		it('should not share values between different enum classes', () => {
			const httpValues = HttpStatus.values();
			const orderValues = OrderStatus.values();
			expect(httpValues).not.toEqual(orderValues);
		});
	});

	describe('fromValue()', () => {
		it('should find enum by numeric value', () => {
			const status = HttpStatus.fromValue(200);
			expect(status).toBe(HttpStatus.OK);
			expect(status!.name).toBe('OK');
		});

		it('should find enum by string value', () => {
			const status = OrderStatus.fromValue('PENDING');
			expect(status).toBe(OrderStatus.PENDING);
			expect(status!.name).toBe('Pending');
		});

		it('should find different enum instances by different values', () => {
			expect(HttpStatus.fromValue(200)).toBe(HttpStatus.OK);
			expect(HttpStatus.fromValue(404)).toBe(HttpStatus.NOT_FOUND);
			expect(HttpStatus.fromValue(500)).toBe(HttpStatus.SERVER_ERROR);
		});

		it('should return undefined for non-existent numeric value', () => {
			expect(HttpStatus.fromValue(999)).toBeUndefined();
		});

		it('should return undefined for non-existent string value', () => {
			expect(OrderStatus.fromValue('INVALID')).toBeUndefined();
		});

		it('should return undefined when value is null or undefined', () => {
			expect(HttpStatus.fromValue(undefined as any)).toBeUndefined();
			expect(HttpStatus.fromValue(null as any)).toBeUndefined();
		});
	});

	describe('fromName()', () => {
		it('should find enum by name', () => {
			const status = HttpStatus.fromName('OK');
			expect(status).toBe(HttpStatus.OK);
			expect(status!.value).toBe(200);
		});

		it('should find enum by name for string value enum', () => {
			const status = OrderStatus.fromName('Pending');
			expect(status).toBe(OrderStatus.PENDING);
			expect(status!.value).toBe('PENDING');
		});

		it('should find different enum instances by different names', () => {
			expect(HttpStatus.fromName('OK')).toBe(HttpStatus.OK);
			expect(HttpStatus.fromName('NOT_FOUND')).toBe(HttpStatus.NOT_FOUND);
			expect(HttpStatus.fromName('SERVER_ERROR')).toBe(HttpStatus.SERVER_ERROR);
		});

		it('should return undefined for non-existent name', () => {
			expect(HttpStatus.fromName('INVALID')).toBeUndefined();
		});

		it('should be case-sensitive', () => {
			expect(HttpStatus.fromName('ok')).toBeUndefined();
		});

		it('should return undefined when name is null, undefined or empty string', () => {
			expect(HttpStatus.fromName(undefined as any)).toBeUndefined();
			expect(HttpStatus.fromName(null as any)).toBeUndefined();
			expect(HttpStatus.fromName('')).toBeUndefined();
		});
	});

	describe('setOf()', () => {
		it('should create a Set containing specified enum values', () => {
			const errorStatuses = HttpStatus.setOf(
				HttpStatus.BAD_REQUEST,
				HttpStatus.NOT_FOUND,
				HttpStatus.SERVER_ERROR
			);

			expect(errorStatuses.size).toBe(3);
			expect(errorStatuses.has(HttpStatus.BAD_REQUEST)).toBe(true);
			expect(errorStatuses.has(HttpStatus.NOT_FOUND)).toBe(true);
			expect(errorStatuses.has(HttpStatus.SERVER_ERROR)).toBe(true);
			expect(errorStatuses.has(HttpStatus.OK)).toBe(false);
		});

		it('should create empty Set when no arguments provided', () => {
			const emptySet = HttpStatus.setOf();
			expect(emptySet.size).toBe(0);
		});

		it('should handle duplicate values', () => {
			const set = HttpStatus.setOf(HttpStatus.OK, HttpStatus.OK, HttpStatus.NOT_FOUND);
			expect(set.size).toBe(2);
		});

		it('should work with string value enums', () => {
			const activeStatuses = OrderStatus.setOf(
				OrderStatus.PENDING,
				OrderStatus.PROCESSING
			);

			expect(activeStatuses.size).toBe(2);
			expect(activeStatuses.has(OrderStatus.PENDING)).toBe(true);
			expect(activeStatuses.has(OrderStatus.PROCESSING)).toBe(true);
			expect(activeStatuses.has(OrderStatus.COMPLETED)).toBe(false);
		});
	});

	describe('enumMap()', () => {
		it('should create map using numeric value as key', () => {
			const statusMessages = HttpStatus.enumMap({
				200: 'Success',
				404: 'Not Found',
				500: 'Error'
			});

			expect(statusMessages.size).toBe(3);
			expect(statusMessages.get(HttpStatus.OK)).toBe('Success');
			expect(statusMessages.get(HttpStatus.NOT_FOUND)).toBe('Not Found');
			expect(statusMessages.get(HttpStatus.SERVER_ERROR)).toBe('Error');
		});

		it('should create map using name as key', () => {
			const statusMessages = HttpStatus.enumMap({
				OK: 'Operation successful',
				NOT_FOUND: 'Resource does not exist'
			});

			expect(statusMessages.size).toBe(2);
			expect(statusMessages.get(HttpStatus.OK)).toBe('Operation successful');
			expect(statusMessages.get(HttpStatus.NOT_FOUND)).toBe('Resource does not exist');
		});

		it('should create map mixing numeric and name keys', () => {
			const statusMessages = HttpStatus.enumMap({
				200: 'Success',
				NOT_FOUND: 'Resource does not exist',
				500: 'Error'
			});

			expect(statusMessages.size).toBe(3);
			expect(statusMessages.get(HttpStatus.OK)).toBe('Success');
			expect(statusMessages.get(HttpStatus.NOT_FOUND)).toBe('Resource does not exist');
			expect(statusMessages.get(HttpStatus.SERVER_ERROR)).toBe('Error');
		});

		it('should skip invalid keys silently', () => {
			const statusMessages = HttpStatus.enumMap({
				200: 'Success',
				999: 'Invalid',
				INVALID_NAME: 'Also Invalid'
			});

			expect(statusMessages.size).toBe(1);
			expect(statusMessages.get(HttpStatus.OK)).toBe('Success');
		});

		it('should work with string value enums', () => {
			const orderMessages = OrderStatus.enumMap({
				Pending: 'Waiting for payment',
				Completed: 'Order finished'
			});

			expect(orderMessages.size).toBe(2);
			expect(orderMessages.get(OrderStatus.PENDING)).toBe('Waiting for payment');
			expect(orderMessages.get(OrderStatus.COMPLETED)).toBe('Order finished');
		});

		it('should create empty map for empty input', () => {
			const emptyMap = HttpStatus.enumMap({});
			expect(emptyMap.size).toBe(0);
		});

		it('should handle complex value types', () => {
			const statusConfig = HttpStatus.enumMap<{ color: string; icon: string }>({
				200: { color: 'green', icon: 'check' },
				400: { color: 'orange', icon: 'warning' },
				NOT_FOUND: { color: 'red', icon: 'error' }
			});

			expect(statusConfig.get(HttpStatus.OK)).toEqual({ color: 'green', icon: 'check' });
			expect(statusConfig.get(HttpStatus.BAD_REQUEST)).toEqual({ color: 'orange', icon: 'warning' });
			expect(statusConfig.get(HttpStatus.NOT_FOUND)).toEqual({ color: 'red', icon: 'error' });
		});
	});

	describe('toString()', () => {
		it('should return the name', () => {
			expect(HttpStatus.OK.toString()).toBe('OK');
			expect(OrderStatus.PENDING.toString()).toBe('Pending');
		});

		it('should work with string concatenation', () => {
			// valueOf() is called during string concatenation, which returns the value
			const messageWithValue = 'Status: ' + HttpStatus.OK;
			expect(messageWithValue).toBe('Status: 200');

			// Use toString() explicitly to get the name
			const messageWithName = 'Status: ' + HttpStatus.OK.toString();
			expect(messageWithName).toBe('Status: OK');
		});
	});

	describe('valueOf()', () => {
		it('should return string representation of numeric value', () => {
			expect(HttpStatus.OK.valueOf()).toBe('200');
			expect(HttpStatus.NOT_FOUND.valueOf()).toBe('404');
		});

		it('should return string value for string enum', () => {
			expect(OrderStatus.PENDING.valueOf()).toBe('PENDING');
			expect(OrderStatus.COMPLETED.valueOf()).toBe('COMPLETED');
		});
	});

	describe('Multiple enum classes isolation', () => {
		it('should maintain separate instances for different enum classes', () => {
			expect(HttpStatus.values().length).toBe(5);
			expect(OrderStatus.values().length).toBe(4);
			expect(Priority.values().length).toBe(3);
		});

		it('should not interfere with each other when querying by value', () => {
			// 虽然值相同，但是不同的枚举类
			expect(HttpStatus.fromValue('PENDING' as any)).toBeUndefined();
			expect(OrderStatus.fromValue(200 as any)).toBeUndefined();
		});

		it('should not interfere with each other when querying by name', () => {
			expect(HttpStatus.fromName('Pending')).toBeUndefined();
			expect(OrderStatus.fromName('OK')).toBeUndefined();
		});
	});

	describe('Edge cases', () => {
		it('should handle enum with same value but different names', () => {
			class DuplicateValueEnum extends Enum<number> {
				static readonly FIRST = new DuplicateValueEnum(1, 'FIRST');
				static readonly SECOND = new DuplicateValueEnum(1, 'SECOND');
			}

			// 最后一个定义的会覆盖前面的（Map 的行为）
			const found = DuplicateValueEnum.fromValue(1);
			expect(found!.name).toBe('SECOND');
		});

		it('should handle description as different types', () => {
			class MixedDescEnum extends Enum<number> {
				static readonly STRING_DESC = new MixedDescEnum(1, 'STRING', 'string description');
				static readonly NUMBER_DESC = new MixedDescEnum(2, 'NUMBER', 42);
				static readonly OBJECT_DESC = new MixedDescEnum(3, 'OBJECT', { key: 'value' });
				static readonly ARRAY_DESC = new MixedDescEnum(4, 'ARRAY', ['a', 'b']);
			}

			expect(MixedDescEnum.STRING_DESC.description).toBe('string description');
			expect(MixedDescEnum.NUMBER_DESC.description).toBe(42);
			expect(MixedDescEnum.OBJECT_DESC.description).toEqual({ key: 'value' });
			expect(MixedDescEnum.ARRAY_DESC.description).toEqual(['a', 'b']);
		});

		it('should work with zero and empty string values', () => {
			class EdgeValueEnum extends Enum<number | string> {
				static readonly ZERO = new EdgeValueEnum(0, 'ZERO');
				static readonly EMPTY = new EdgeValueEnum('', 'EMPTY');
			}

			expect(EdgeValueEnum.fromValue(0)).toBe(EdgeValueEnum.ZERO);
			expect(EdgeValueEnum.fromValue('')).toBe(EdgeValueEnum.EMPTY);
		});
	});

	describe('Type exports', () => {
		it('should have correct EnumValueType', () => {
			const numValue: EnumValueType = 123;
			const strValue: EnumValueType = 'test';
			expect(typeof numValue).toBe('number');
			expect(typeof strValue).toBe('string');
		});

		it('should extract enum values with EnumValues type', () => {
			type StatusValues = EnumValues<typeof HttpStatus>;

			const value1: StatusValues = 200;
			const value2: StatusValues = 404;

			expect(value1).toBe(200);
			expect(value2).toBe(404);
		});
	});
});
