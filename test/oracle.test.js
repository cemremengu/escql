'use strict'

const test = require('tap').test
const escql = require('../index')

const sql = `
SELECT
  e.employee_id AS "Employee #"
  , e.first_name || ' ' || e.last_name AS "Name"
  , e.email AS "Email"
  , e.phone_number AS "Phone"
  , TO_CHAR(e.hire_date, 'MM/DD/YYYY') AS "Hire Date"
  , TO_CHAR(e.salary, 'L99G999D99', 'NLS_NUMERIC_CHARACTERS = ''.,'' NLS_CURRENCY = ''$''') AS "Salary"
  , e.commission_pct AS "Comission %"
  , 'works as ' || j.job_title || ' in ' || d.department_name || ' department (manager: '
    || dm.first_name || ' ' || dm.last_name || ') and immediate supervisor: ' || m.first_name || ' ' || m.last_name AS "Current Job"
  , TO_CHAR(j.min_salary, 'L99G999D99', 'NLS_NUMERIC_CHARACTERS = ''.,'' NLS_CURRENCY = ''$''') || ' - ' ||
      TO_CHAR(j.max_salary, 'L99G999D99', 'NLS_NUMERIC_CHARACTERS = ''.,'' NLS_CURRENCY = ''$''') AS "Current Salary"
  , l.street_address || ', ' || l.postal_code || ', ' || l.city || ', ' || l.state_province || ', '
    || c.country_name || ' (' || r.region_name || ')' AS "Location"
  , jh.job_id AS "History Job ID"
  , 'worked from ' || TO_CHAR(jh.start_date, 'MM/DD/YYYY') || ' to ' || TO_CHAR(jh.end_date, 'MM/DD/YYYY') ||
    ' as ' || jj.job_title || ' in ' || dd.department_name || ' department' AS "History Job Title"
  
FROM employees e
-- to get title of current job_id
  JOIN jobs j 
    ON e.job_id = j.job_id
-- to get name of current manager_id
  LEFT JOIN employees m 
    ON e.manager_id = m.employee_id
-- to get name of current department_id
  LEFT JOIN departments d 
    ON d.department_id = e.department_id
-- to get name of manager of current department
-- (not equal to current manager and can be equal to the employee itself)
  LEFT JOIN employees dm 
    ON d.manager_id = dm.employee_id
-- to get name of location
  LEFT JOIN locations l
    ON d.location_id = l.location_id
  LEFT JOIN countries c
    ON l.country_id = c.country_id
  LEFT JOIN regions r
    ON c.region_id = r.region_id
-- to get job history of employee;
  LEFT JOIN job_history jh
    ON e.employee_id = jh.employee_id
-- to get title of job history job_id
  LEFT JOIN jobs jj
    ON jj.job_id = jh.job_id
-- to get namee of department from job history
  LEFT JOIN departments dd
    ON dd.department_id = jh.department_id

ORDER BY e.employee_id;
`

const wanted = "SELECT\\n  e.employee_id AS \\\"Employee #\\\"\\n  , e.first_name || ' ' || e.last_name AS \\\"Name\\\"\\n  , e.email AS \\\"Email\\\"\\n  , e.phone_number AS \\\"Phone\\\"\\n  , TO_CHAR(e.hire_date, 'MM/DD/YYYY') AS \\\"Hire Date\\\"\\n  , TO_CHAR(e.salary, 'L99G999D99', 'NLS_NUMERIC_CHARACTERS = ''.,'' NLS_CURRENCY = ''$''') AS \\\"Salary\\\"\\n  , e.commission_pct AS \\\"Comission %\\\"\\n  , 'works as ' || j.job_title || ' in ' || d.department_name || ' department (manager: '\\n    || dm.first_name || ' ' || dm.last_name || ') and immediate supervisor: ' || m.first_name || ' ' || m.last_name AS \\\"Current Job\\\"\\n  , TO_CHAR(j.min_salary, 'L99G999D99', 'NLS_NUMERIC_CHARACTERS = ''.,'' NLS_CURRENCY = ''$''') || ' - ' ||\\n      TO_CHAR(j.max_salary, 'L99G999D99', 'NLS_NUMERIC_CHARACTERS = ''.,'' NLS_CURRENCY = ''$''') AS \\\"Current Salary\\\"\\n  , l.street_address || ', ' || l.postal_code || ', ' || l.city || ', ' || l.state_province || ', '\\n    || c.country_name || ' (' || r.region_name || ')' AS \\\"Location\\\"\\n  , jh.job_id AS \\\"History Job ID\\\"\\n  , 'worked from ' || TO_CHAR(jh.start_date, 'MM/DD/YYYY') || ' to ' || TO_CHAR(jh.end_date, 'MM/DD/YYYY') ||\\n    ' as ' || jj.job_title || ' in ' || dd.department_name || ' department' AS \\\"History Job Title\\\"\\n  \\nFROM employees e\\n/* to get title of current job_id*/\\n  JOIN jobs j \\n    ON e.job_id = j.job_id\\n/* to get name of current manager_id*/\\n  LEFT JOIN employees m \\n    ON e.manager_id = m.employee_id\\n/* to get name of current department_id*/\\n  LEFT JOIN departments d \\n    ON d.department_id = e.department_id\\n/* to get name of manager of current department*/\\n/* (not equal to current manager and can be equal to the employee itself)*/\\n  LEFT JOIN employees dm \\n    ON d.manager_id = dm.employee_id\\n/* to get name of location*/\\n  LEFT JOIN locations l\\n    ON d.location_id = l.location_id\\n  LEFT JOIN countries c\\n    ON l.country_id = c.country_id\\n  LEFT JOIN regions r\\n    ON c.region_id = r.region_id\\n/* to get job history of employee;*/\\n  LEFT JOIN job_history jh\\n    ON e.employee_id = jh.employee_id\\n/* to get title of job history job_id*/\\n  LEFT JOIN jobs jj\\n    ON jj.job_id = jh.job_id\\n/* to get namee of department from job history*/\\n  LEFT JOIN departments dd\\n    ON dd.department_id = jh.department_id\\n\\nORDER BY e.employee_id"

test('should escape oracle sql statement', (t) => {
  t.plan(1)
  t.is(escql.oracle(sql), wanted)
})
