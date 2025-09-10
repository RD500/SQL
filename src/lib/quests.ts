
export type Quest = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  initialQuery: string;
  correctQuery: string;
  successMessage: string;
  schema: {
    tableName: string;
    columns: { name: string; type: string }[];
  };
  resultData: Record<string, any>[];
};

export const quests: Quest[] = [
  {
    id: 'select-basics',
    title: 'The SELECT Statement',
    description: 'Learn to retrieve data from a table.',
    longDescription:
      "The kingdom's scribe has recorded all the royal employees in a table, but the records are magically sealed. Use your SQL knowledge to unseal them! Write a query to select all columns and all rows from the `employees` table.",
    difficulty: 'Beginner',
    category: 'SQL Basics',
    initialQuery: 'SELECT * FROM employees;',
    correctQuery: 'SELECT * FROM employees',
    successMessage:
      'You have successfully retrieved all employee records. Great job!',
    schema: {
      tableName: 'employees',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'name', type: 'TEXT' },
        { name: 'role', type: 'TEXT' },
        { name: 'salary', type: 'INTEGER' },
      ],
    },
    resultData: [
      { id: 1, name: 'King Arthur', role: 'King', salary: 100000 },
      { id: 2, name: 'Merlin', role: 'Wizard', salary: 80000 },
      { id: 3, name: 'Lancelot', role: 'Knight', salary: 60000 },
      { id: 4, name: 'Guenevere', role: 'Queen', salary: 90000 },
    ],
  },
  {
    id: 'where-clause',
    title: 'The WHERE Clause',
    description: 'Filter records based on a condition.',
    longDescription:
      'The royal treasurer wants a list of all employees who earn more than 70,000 gold pieces. Use the WHERE clause to filter the `employees` table and find these high-earners.',
    difficulty: 'Beginner',
    category: 'SQL Basics',
    initialQuery: 'SELECT name, role, salary FROM employees\nWHERE salary > 70000;',
    correctQuery: 'SELECT name, role, salary FROM employees WHERE salary > 70000',
    successMessage: 'Excellent! You have successfully filtered the records.',
    schema: {
      tableName: 'employees',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'name', type: 'TEXT' },
        { name: 'role', type: 'TEXT' },
        { name: 'salary', type: 'INTEGER' },
      ],
    },
    resultData: [
      { name: 'King Arthur', role: 'King', salary: 100000 },
      { name: 'Merlin', role: 'Wizard', salary: 80000 },
      { name: 'Guenevere', role: 'Queen', salary: 90000 },
    ],
  },
  {
    id: 'insert-knight',
    title: 'INSERT Knight',
    description: 'Master adding new rows of data.',
    longDescription: 'A new knight, Sir Galahad, has joined the Round Table! His salary is 55,000. Your task is to insert a new record for him into the `employees` table. His ID should be 5.',
    difficulty: 'Beginner',
    category: 'SQL Basics',
    initialQuery: "INSERT INTO employees (id, name, role, salary)\nVALUES (5, 'Sir Galahad', 'Knight', 55000);",
    correctQuery: "INSERT INTO employees (id, name, role, salary) VALUES (5, 'Sir Galahad', 'Knight', 55000)",
    successMessage: 'Well done! Sir Galahad has been successfully added to the records.',
     schema: {
      tableName: 'employees',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'name', type: 'TEXT' },
        { name: 'role', type: 'TEXT' },
        { name: 'salary', type: 'INTEGER' },
      ],
    },
    resultData: [
        { id: 5, name: 'Sir Galahad', role: 'Knight', salary: 55000 }
    ],
  },
   {
    id: 'update-wizard',
    title: 'UPDATE Wizard',
    description: 'Become a wizard of data modification.',
    longDescription: "Merlin's exceptional service has earned him a raise! Update his salary in the `employees` table to 85,000.",
    difficulty: 'Intermediate',
    category: 'SQL Basics',
    initialQuery: "UPDATE employees\nSET salary = 85000\nWHERE name = 'Merlin';",
    correctQuery: "UPDATE employees SET salary = 85000 WHERE name = 'Merlin'",
    successMessage: "Merlin is pleased! You've successfully updated his salary.",
     schema: {
      tableName: 'employees',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'name', type: 'TEXT' },
        { name: 'role', type: 'TEXT' },
        { name: 'salary', type: 'INTEGER' },
      ],
    },
    resultData: [
        { name: 'Merlin', role: 'Wizard', salary: 85000 }
    ],
  },
  {
    id: 'key-master',
    title: 'The Key Master',
    description: 'Understand Primary and Foreign Keys.',
    longDescription: "This is a conceptual quest. A primary key uniquely identifies each record in a table. A foreign key is a key used to link two tables together. Your task is to identify the primary key in the `employees` table.",
    difficulty: 'Intermediate',
    category: 'Constraints',
    initialQuery: "SELECT 'id' as primary_key;",
    correctQuery: "SELECT 'id' as primary_key",
    successMessage: "Correct! The 'id' column is the primary key as it uniquely identifies each employee.",
     schema: {
      tableName: 'employees',
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'name', type: 'TEXT' },
        { name: 'role', type: 'TEXT' },
        { name: 'salary', type: 'INTEGER' },
      ],
    },
    resultData: [
        { primary_key: 'id' }
    ],
  },
  {
    id: 'unique-names',
    title: 'The Uniqueness Charm',
    description: 'Ensure all values in a column are different.',
    longDescription: 'The kingdom is expanding and we need to ensure every new `department` has a unique name. Your task is to add a UNIQUE constraint to the `name` column of the `departments` table. This will prevent duplicate department names from ever being created.',
    difficulty: 'Intermediate',
    category: 'Constraints',
    initialQuery: 'ALTER TABLE departments\nADD CONSTRAINT uq_department_name UNIQUE (name);',
    correctQuery: 'ALTER TABLE departments ADD CONSTRAINT uq_department_name UNIQUE (name)',
    successMessage: "A powerful charm! You've ensured all department names will be unique, preventing confusion in the kingdom.",
    schema: {
        tableName: 'departments',
        columns: [
            { name: 'id', type: 'INTEGER' },
            { name: 'name', type: 'TEXT' },
        ],
    },
    resultData: [
        { 'status': 'Constraint added successfully' }
    ],
  },
  {
    id: 'join-juggler',
    title: 'The JOIN Juggler',
    description: 'Combine rows from two or more tables.',
    longDescription: "Let's see the department for each employee. Combine the `employees` and `departments` tables to show each employee's name and their department's name. The tables are linked by `department_id`.",
    difficulty: 'Advanced',
    category: 'SQL Basics',
    initialQuery: "SELECT e.name, d.name as department_name\nFROM employees e\nJOIN departments d ON e.department_id = d.id;",
    correctQuery: "SELECT e.name, d.name as department_name FROM employees e JOIN departments d ON e.department_id = d.id",
    successMessage: "Fantastic! You've successfully joined the tables and revealed the department for each employee.",
    schema: {
        tableName: 'employees & departments',
        columns: [
            { name: 'employees.id', type: 'INTEGER' },
            { name: 'employees.name', type: 'TEXT' },
            { name: 'employees.department_id', type: 'INTEGER' },
            { name: 'departments.id', type: 'INTEGER' },
            { name: 'departments.name', type: 'TEXT' },
        ],
    },
    resultData: [
      { name: 'King Arthur', department_name: 'Royalty' },
      { name: 'Merlin', department_name: 'Magic' },
      { name: 'Lancelot', department_name: 'Knights' },
      { name: 'Guenevere', department_name: 'Royalty' },
    ],
  },
];
