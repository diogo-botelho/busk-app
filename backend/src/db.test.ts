// db.test.js
import db from './db';

describe('Database Module', () => {
  test('should create a valid database connection', () => {
    expect(db).toBeDefined();
  });

  test('should handle error event', () => {
    const mockError = new Error('Mock DB Error');
    const mockErrorListener = jest.fn();

    db.on('error', mockErrorListener);
    db.emit('error', mockError);

    expect(mockErrorListener).toHaveBeenCalledWith(mockError);
  });
});
