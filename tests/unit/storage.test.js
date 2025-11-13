const storage = require('../../src/services/storage');

describe('Storage', () => {
  beforeEach(() => {
    storage.reset();
    storage.seed();
  });

  test('unique student email', () => {
    const result = storage.create('students', {
      name: 'Eve',
      email: 'alice@example.com',
    });

    expect(result.error).toMatch(/unique/i);
  });

  test('unique course title', () => {
    const result = storage.create('courses', {
      title: 'Math',
      teacher: 'X',
    });
    expect(result.error).toMatch(/unique/i);
  });

  test('protected deletion', () => {
    const student = storage.list('students')[0];
    const course = storage.list('courses')[0];

    storage.enroll(student.id, course.id);

    const r = storage.remove('students', student.id);
    expect(r.error).toMatch(/Cannot delete student/i);
  });
});
