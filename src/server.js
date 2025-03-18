import fs from "fs";
import { write } from "fast-csv";

const filePath = `./assests/data.csv`; // Output CSV file path

// Define column headers
const headers = [
    "name.firstname", "name.lastname", "age",
    "address.line1", "address.line2", "address.city", "address.state", "gender",
    "A.B.C.D", "A.B.C.E.F", "A.B.X", "B.P.X.S", "B.P.X.Q.R", "B.P.X.M.T.U", "A.B.C.A.C.B"
];

// Sample data options
const firstNames = ["Moksh", "Harry", "Sursh", "Satya", "Satyam", "Shivam", "Lavish", "Hayat", "Matrix"];
const lastNames = ["Pal", "Sharma", "Kumar", "Verma", "Gupta", "Yadav"];
const addressLines1 = ["Murbali Talav", "Andheri East", "Santosh Nagar", "Powai Lake"];
const addressLines2 = ["Sector 21", "Street 4", "MG Road", "Main Market"];
const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"];
const states = ["Maharashtra", "Karnataka", "Tamil Nadu", "Uttar Pradesh"];
const genders = ["Male", "Female"];
const randomWords = ["hello", "min", "max", "pro", "hi", "hu"];
const randomTech = ["java", "python", "c++", "Dart", "Perl", "Ruby on Rail", "JavaScript"];
const jsonObjects = ['{ a : 2 }', '{ a : 21 , b : 12 }', '{ c : 1 }', '{ a : 3 , d : 45 }'];
const numbers = [21, 23.45, 1231.13, 987.54, 122232, 12.345, 86.45];

// Function to generate random data
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Create 100,000 rows
const rows = [];
for (let i = 0; i < 60000; i++) {
    rows.push([
        getRandom(firstNames), getRandom(lastNames), Math.floor(Math.random() * 90) + 1,
        getRandom(addressLines1), getRandom(addressLines2), getRandom(cities), getRandom(states), getRandom(genders),
        getRandom(randomWords), getRandom(randomWords), getRandom(numbers), getRandom(randomTech), getRandom(numbers), getRandom(jsonObjects), getRandom(jsonObjects)
    ]);
}

// Write to CSV using fast-csv
const writeStream = fs.createWriteStream(filePath);
write(rows, { headers: headers })
    .pipe(writeStream)
    .on("finish", () => console.log("CSV file created successfully!"))
    .on("error", (err) => console.error("Error writing CSV:", err));
