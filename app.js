// modules
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

//employee output and save path
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");
const employees = [];

//prompt employee type to be added
async function addEmployee() {
  const { employeeType } = await inquirer.prompt({
    name: "employeeType",
    message: "What type of employee would you like to add?",
    type: "list",
    choices: ["Engineer", "Intern", "Manager"],
  });
  // array of the common entries that all employees share
  let commonQuestions = [
    {
      name: "name",
      message: "Enter employee's First Name",
      type: "input",
    },
    {
      name: "id",
      message: "Enter employee's id",
      type: "input",
    },
    {
      name: "email",
      message: "Enter employee's Email",
      type: "input",
    },
  ];

  //if engineer prompt for github, and create new engineer,
  if (employeeType === "Engineer") {
    const answers = await inquirer.prompt([
      ...commonQuestions,
      {
        name: "github",
        message: "What is your Github name?",
        type: "input",
      },
    ]);

    const e = new Engineer(
      answers.name,
      answers.id,
      answers.email,
      answers.github
    );
    employees.push(e);
    //else if intern prompt for school and create intern
  } else if (employeeType === "Intern") {
    const answers = await inquirer.prompt([
      ...commonQuestions,
      {
        name: "school",
        message: "What School do you go to?",
        type: "input",
      },
    ]);

    const i = new Intern(
      answers.name,
      answers.id,
      answers.email,
      answers.school
    );
    employees.push(i);
    // else assume manager prompt for office, and create manager
  } else {
    const answers = await inquirer.prompt([
      ...commonQuestions,
      {
        name: "officeNumber",
        message: "What is your office number?",
        type: "input",
      },
    ]);
    const m = new Manager(
      answers.name,
      answers.id,
      answers.email,
      answers.officeNumber
    );
    employees.push(m);
  }
  // prompt to run the CLI and create employee
  const { shouldCreateEmployee } = await inquirer.prompt({
    name: "shouldCreateEmployee",
    message: "Create new employee?",
    type: "confirm",
  });

  return shouldCreateEmployee;
}
// run addEmployee, render results and write file
async function run() {
  let shouldCreateMore = await addEmployee();

  while (shouldCreateMore) {
    shouldCreateMore = await addEmployee();
  }

  let renderResults = render(employees);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
  fs.writeFileSync(outputPath, renderResults);
}

run();
