const data = {
  students: [],
  courses: [],
  enrollments: [],
};

let studentId = 1;
let courseId = 1;

function list(collection) {
  return data[collection];
}

function get(collection, id) {
  return data[collection].find((item) => item.id === Number(id));
}

function create(collection, payload) {
  if (collection === 'students') {
    if (data.students.find((s) => s.email === payload.email)) {
      return { error: 'Email must be unique' };
    }
  }

  if (collection === 'courses') {
    if (data.courses.find((c) => c.title === payload.title)) {
      return { error: 'Course title must be unique' };
    }
  }

  let id;

  if (collection === 'students') {
    id = studentId;
    studentId += 1;
  } else {
    id = courseId;
    courseId += 1;
  }

  const item = { id, ...payload };
  data[collection].push(item);

  return item;
}

function remove(collection, id) {
  if (collection === 'students') {
    if (data.enrollments.find((e) => e.studentId === Number(id))) {
      return { error: 'Cannot delete student: enrolled in a course' };
    }
  }

  if (collection === 'courses') {
    if (data.enrollments.find((e) => e.courseId === Number(id))) {
      return { error: 'Cannot delete course: students are enrolled' };
    }
  }

  const idx = data[collection].findIndex((it) => it.id === Number(id));
  if (idx === -1) return false;

  data[collection].splice(idx, 1);
  return true;
}

function enroll(studentIdParam, courseIdParam) {
  const course = get('courses', courseIdParam);
  if (!course) return { error: 'Course not found' };

  const student = get('students', studentIdParam);
  if (!student) return { error: 'Student not found' };

  if (
    data.enrollments.find(
      (e) => e.studentId === Number(studentIdParam) && e.courseId === Number(courseIdParam),
    )
  ) {
    return { error: 'Student already enrolled in this course' };
  }

  const enrolledCount = data.enrollments.filter((e) => e.courseId === Number(courseIdParam)).length;

  if (enrolledCount >= 3) {
    return { error: 'Course is full' };
  }

  data.enrollments.push({
    studentId: Number(studentIdParam),
    courseId: Number(courseIdParam),
  });

  return { success: true };
}

function unenroll(studentIdParam, courseIdParam) {
  const idx = data.enrollments.findIndex(
    (e) => e.studentId === Number(studentIdParam) && e.courseId === Number(courseIdParam),
  );

  if (idx === -1) {
    return { error: 'Enrollment not found' };
  }

  data.enrollments.splice(idx, 1);
  return { success: true };
}

function getStudentCourses(studentIdParam) {
  return data.enrollments
    .filter((e) => e.studentId === Number(studentIdParam))
    .map((e) => get('courses', e.courseId));
}

function getCourseStudents(courseIdParam) {
  return data.enrollments
    .filter((e) => e.courseId === Number(courseIdParam))
    .map((e) => get('students', e.studentId));
}

function reset() {
  data.students = [];
  data.courses = [];
  data.enrollments = [];
  studentId = 1;
  courseId = 1;
}

function seed() {
  create('students', { name: 'Alice', email: 'alice@example.com' });
  create('students', { name: 'Bob', email: 'bob@example.com' });
  create('students', { name: 'Charlie', email: 'charlie@example.com' });

  create('courses', { title: 'Math', teacher: 'Mr. Smith' });
  create('courses', { title: 'Physics', teacher: 'Dr. Brown' });
  create('courses', { title: 'History', teacher: 'Ms. Clark' });
}

module.exports = {
  list,
  get,
  create,
  remove,
  reset,
  enroll,
  unenroll,
  getStudentCourses,
  getCourseStudents,
  seed,
};
