const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employees = [];

async function addEmployee() {
  const { employeeType } = await inquirer.prompt({
    name: "employeeType",
    message: "What type of employee would you like to add?",
    type: "list",
    choices: ["Engineer", "Intern", "Manager"],
  });

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
  const { shouldCreateEmployee } = await inquirer.prompt({
    name: "shouldCreateEmployee",
    message: "Create new employee?",
    type: "confirm",
  });

  return shouldCreateEmployee;
}

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

// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
