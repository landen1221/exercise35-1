\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS company_industry;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industry;


CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industry (
  code text PRIMARY KEY,
  industry text NOT NULL UNIQUE
);

CREATE TABLE company_industry (
  id serial PRIMARY KEY,
  ind_code text NOT NULL REFERENCES industry ON DELETE CASCADE,
  comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE
);

INSERT INTO companies (code, name, description)
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.'),
         ('tesla', 'Tesla Motors', 'Makers of electric cars');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('tesla', 35000, false, null),
         ('tesla', 43000, true, CURRENT_DATE),
         ('ibm', 400, false, null);

INSERT INTO industry (code, industry)
  VALUES ('acct', 'Accounting'),
         ('tech', 'Technology'),
         ('auto', 'Car Manufacturer');

INSERT INTO company_industry (ind_code, comp_code)
  VALUES ('tech', 'apple'),
         ('tech', 'ibm'),
         ('auto', 'tesla'),
         ('tech', 'tesla');
  
