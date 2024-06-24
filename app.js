// displays the help menu with the exit button
function showPopup() {
    var popup = document.getElementById('help');
    popup.style.display = 'block';

    var closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.classList.add('popup-close-button');
    closeButton.onclick = hidePopup;
    popup.appendChild(closeButton);
}
// help menu helps user to easily navigate through the pages
function hidePopup() {
    var popup = document.getElementById('help');
    popup.style.display = 'none';
}
// refreshes the page to reset any modifications
function setting() {
    window.location.reloadPage();
}
// checks validity of the input field; if invalid, a pop up appears prompting resubmission
// when valid - retrieves name and stores; displays welcome; removes hidden
function submitName(event) {
    var userName = document.getElementById("userName").value;
    if (!userName) {
        window.alert("Please submit your name!");
        return;
    }
    var userName = document.getElementById("userName").value;
    var outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "<h2>Welcome, " + userName + "!</h2>";
    document.querySelector("table").classList.remove("hidden");
}
// help menu
function settings() {
    var tables = document.getElementsByTagName("table");
    for (var i = 0; i < tables.length; i++) {
        tables[i].style.display = 'none';
    }
    var help = document.getElementById("help");
    help.style.display = "block";
    setTimeout(function () {
        for (var i = 0; i < tables.length; i++) {
            tables[i].style.display = '';
        }
    }, 2000);
}

// allows the addition of a new section with input fields.
// what if tool
// analyze
function addRow() {
    var userName = document.getElementById("userName").value;
    if (!userName) {
        window.alert("Please submit your name!");
        return;
    }
    const table = document.getElementById("gradeTable").querySelector("tbody");
    const newRow = table.insertRow();

    newRow.innerHTML = `
        <td><input type="text" name="course" autocomplete="off"></td>
        <td><input type="number" name="g1" min="0" max="100"></td>
        <td><input type="number" name="g2" min="0" max="100"></td>
        <td><input type="checkbox" name="kapApCheckbox"></td>
        <td><input type="checkbox" name="dualCreditCheckbox"></td>
    `;
}
function removerow(table) {
    var userName = document.getElementById("userName").value;
    if (!userName) {
        window.alert("Please submit your name!");
        return;
    }
    var rowCount = table.rows.length;
    if (rowCount > 2) { // Ensure there are more than two rows (including the header row)
        var index = table.rows.length - 1;
        if (index > 1) { // Check if the row being deleted is not the first row
            table.deleteRow(index);
            var data = JSON.parse(localStorage.getItem("inputData")) || [];
            data.splice(-1, 1);
            localStorage.setItem("inputData", JSON.stringify(data));
        } else {
            alert("You cannot delete the titles.");
        }
    }
}

function save() {
    var userName = document.getElementById("userName").value;
    if (!userName) {
        window.alert("Please submit your name!");
        return;
    }
    const rows = document.querySelectorAll("#gradeTable tbody tr");
    const data = [];
    rows.forEach(row => {
        const rowData = {
            course: row.querySelector('input[name="course"]').value,
            g1: row.querySelector('input[name="g1"]').value,
            g2: row.querySelector('input[name="g2"]').value,
            kapAp: row.querySelector('input[name="kapApCheckbox"]').checked,
            dualCredit: row.querySelector('input[name="dualCreditCheckbox"]').checked
        };
        data.push(rowData);
    });
    localStorage.setItem('grades', JSON.stringify(data));
    window.alert("Data saved successfuly!");
}

function loadInput() {
    const data = JSON.parse(localStorage.getItem('grades')) || [];
    const table = document.getElementById("gradeTable").querySelector("tbody");
    table.innerHTML = '';  // Clear existing rows

    data.forEach(item => {
        const newRow = table.insertRow();
        newRow.innerHTML = `
            <td><input type="text" name="course" value="${item.course}"></td>
            <td><input type="number" name="g1" value="${item.g1}" min="0" max="100"></td>
            <td><input type="number" name="g2" value="${item.g2}" min="0" max="100"></td>
            <td><input type="checkbox" name="kapApCheckbox" ${item.kapAp ? "checked" : ""}></td>
            <td><input type="checkbox" name="dualCreditCheckbox" ${item.dualCredit ? "checked" : ""}></td>
        `;
    });
}

window.onload = function () {
    loadInput();
};

document.getElementById('gradeTable').addEventListener('change', function (event) {
    if (event.target.type === 'checkbox') {
        let row = event.target.closest('tr');
        if (row) {
            let checkboxesInRow = row.querySelectorAll('input[type="checkbox"]');
            checkboxesInRow.forEach(checkbox => {
                if (checkbox !== event.target) {
                    checkbox.checked = false;
                }
            });
        }
    }
});
function checkGradesValidity() {
    var table = document.getElementById("gradeTable");
    var isValid = true;

    for (var i = 1; i < table.rows.length - 1; i++) {
        var row = table.rows[i];
        var inputs = row.querySelectorAll("input[type='number']");

        inputs.forEach(function (input) {
            var grade = parseFloat(input.value);
            if (grade < 0) {
                isValid = false;
            }
            if (grade > 100) {
                isValid = false;
            }
        });
    }

    if (!isValid) {
        return false;
    }
}

// iterates through each row; checking input for each function and stores it to the corresponding variable
function processUserData() {
    var userName = document.getElementById("userName").value;
    var courses = [];

    var table = document.getElementById("gradeTable");
    for (var i = 0; i < table.rows.length; i++) {
        var courseName = table.rows[i].cells[0].querySelector("input").value;
        var gradePercentage = table.rows[i].cells[1].querySelector("input").value;
        var sem2 = table.rows[i].cells[2].querySelector("#g2").value;
        var isKAPAP = table.rows[i].cells[3].querySelector("input").checked;
        var isDual = table.rows[i].cells[4].querySelector("#check2").checked;

        var course = {
            courseName: courseName,
            gradePercentage: gradePercentage,
            sem2: sem2,
            isKAPAP: isKAPAP
        };

        courses.push(course);
    }

    console.log("User: " + userName);
    console.log("Courses:", courses);
}

// initailizes arrays
function calculate() {
    checkGradesValidity();
    var valid = true;
    // check if name is submitted
    var userName = document.getElementById("userName").value;
    if (!userName) {
        window.alert("Please submit your name first!");
        return;
    }
    var scores1 = [];
    var scores2 = [];
    var courseType = [];
    var courseDual = [];

    var table = document.getElementById("gradeTable");

    for (var i = 0; i < table.rows.length; i++) {
        var row = table.rows[i];
        var isEditing = row.classList.contains("editing");
        var isSaving = row.classList.contains("saving");

        if (!isEditing && !isSaving) { // Exclude rows being edited or saved
            console.log(row.cells[0].innerHTML)
            var inputElement = row.cells[1].querySelector("input");
            console.log(inputElement)
            if (!inputElement) {
                console.error("Input element not found in cell:", row.cells[0]);
                continue; // skip to the next row if input element is not found
            }
            var gradePercentage1 = parseFloat(inputElement.value);

            var inputElement2 = row.cells[2].querySelector("input");
            var gradePercentage2 = parseFloat(inputElement2.value);
            var isKAPAP = row.cells[3].querySelector("input").checked;
            var isDual = row.cells[4].querySelector("input").checked;

            scores1.push(gradePercentage1);
            scores2.push(gradePercentage2);
            courseType.push(isKAPAP);
            courseDual.push(isDual);
        }
    }
    var numClasses = -1;
    var sum1 = 0;
    var us = 0;
    for (var i = 0; i <= scores1.length; i++) {
        var grade = scores1[i];
        numClasses++;

        //console.log(grade + " " + courseType[i]);

        if (courseType[i] == true) {
            if (grade >= 89.5 && grade <= 100) {
                sum1 += 5;
                us += 4;
            } else if (grade >= 79.5 && grade <= 100) {
                sum1 += 4;
                us += 3;
            } else if (grade >= 69.5 && grade <= 100) {
                sum1 += 3;
                us += 2;
            }
            else if (grade > 100 || grade < 0) {
                window.alert("Please enter a valid grade (0-100)!");
                valid = false;
                return;
            }
        } else if (courseDual[i] == true) {
            if (grade >= 89.5 && grade <= 100) {
                sum1 += 4.5;
                us += 4;
            } else if (grade >= 79.5 && grade < 100) {
                sum1 += 3.5;
                us += 3;
            } else if (grade >= 69.5 && grade < 100) {
                sum1 += 2.5;
                us += 2;
            }
            else if (grade < 0 || grade > 100) {
                window.alert("Please enter a valid grade (0-100)!");
                valid = false;
                return;
            }
        } else {
            if (grade >= 89.5 && grade <= 100) {
                sum1 += 4;
                us += 4;
            } else if (grade >= 79.5 && grade <= 100) {
                sum1 += 3;
                us += 3;
            } else if (grade >= 69.5 && grade <= 100) {
                sum1 += 2;
                us += 2;
            }
            else if (grade < 0 || grade > 100) {
                window.alert("Please enter a valid grade (0-100)!");
                valid = false;
                return;
            }
        }
    }
    var gpa1 = sum1 / numClasses;
    console.log(gpa1);
    var un1 = us / numClasses;
    // semester 2
    var sum2 = 0;
    var us2 = 0;
    for (var i = 0; i <= scores2.length; i++) {
        var grade = scores2[i];

        //console.log(grade + " " + courseType[i]);

        if (courseType[i] == true) {
            if (grade >= 89.5 && grade <= 100) {
                sum2 += 5;
                us2 += 4;
            } else if (grade >= 79.5 && grade <= 100) {
                sum2 += 4;
                us2 += 3;
            } else if (grade >= 69.5 && grade <= 100) {
                sum2 += 3;
                us2 += 2;
            }
            else if (grade < 0 || grade > 100) {
                window.alert("Please enter a valid grade (0-100)!");
                valid = false;
                return;
            }
        } else if (courseDual[i] == true) {
            if (grade >= 89.5 && grade <= 100) {
                sum2 += 4.5;
                us2 += 4;
            } else if (grade >= 79.5 && grade <= 100) {
                sum2 += 3.5;
                us2 += 3;
            } else if (grade >= 69.5 && grade <= 100) {
                sum2 += 2.5;
                us2 += 2;
            }
            else if (grade < 0 || grade > 100) {
                window.alert("Please enter a valid grade (0-100)!");
                valid = false;
                return;
            }
        } else {
            if (grade >= 89.5 && grade <= 100) {
                sum2 += 4;
                us2 += 4;
            } else if (grade >= 79.5 && grade <= 100) {
                sum2 += 3;
                us2 += 3;
            } else if (grade >= 69.5 && grade <= 100) {
                sum2 += 2;
                us2 += 2;
            }
            else if (grade < 0 || grade > 100) {
                window.alert("Please enter a valid grade (0-100)!");
                valid = false;
                return;
            }
        }
    }
    var un2 = us2 / numClasses;
    var gpa2 = sum2 / numClasses;

    console.log("SUM 2 " + sum2);
    console.log("SUM 1 " + sum1);
    if (valid == true)
        window.alert(userName + ", your weighted GPA is " + (gpa1 + gpa2) / 2 + "\n" + userName + ", your unweighted GPA is " + (un1 + un2) / 2);
}


/*console.log(sum);
console.log(numClasses);
console.log(scores);
console.log(courseType);
console.log(gpa);*/

var currentlySpeaking = false; // Track if speech synthesis is currently active
var utterance = null; // Track the current utterance

// skip
function toggleAudio() {
    if (currentlySpeaking) {
        stopSpeaking(); // Stop speaking if already speaking
    } else {
        readPageContent(); // Start speaking if not already speaking
    }
}
function reloadPage() {
    window.location.reload();
}
// iterates through each row and input
// synthesized voice
// accessible 
function readPageContent() {
    var content = '';

    var paragraphs = document.getElementsByTagName('p');
    for (var i = 0; i < paragraphs.length; i++) {
        content += paragraphs[i].innerText + '\n';
    }

    var headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    for (var i = 0; i < headers.length; i++) {
        content += headers[i].innerText + '\n';
    }

    var inputFields = document.querySelectorAll('input[type="text"], input[type="number"]');
    for (var i = 0; i < inputFields.length; i++) {
        content += inputFields[i].value + '\n';
    }

    var synth = window.speechSynthesis;
    utterance = new SpeechSynthesisUtterance(content);

    // Event listeners for speaking and stopping speech
    utterance.onstart = function () {
        currentlySpeaking = true;
    };

    utterance.onend = function () {
        currentlySpeaking = false;
    };

    // Start speaking
    synth.speak(utterance);
}
// halts the reading page content initiated by our previous function; allows users to control the audio playback
function stopSpeaking() {
    window.speechSynthesis.cancel(); // Stop speech synthesis
    currentlySpeaking = false;
    if (utterance) {
        utterance.onstart = null; // Remove event listener for start
        utterance.onend = null; // Remove event listener for end
    }
}
function generatePDF() {
    var doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Transcript", 14, 20);

    // Generate table
    var table = document.getElementById("gradeTable");
    var rows = table.rows;
    var colCount = rows[0].cells.length;

    var data = [];
    for (var i = 0; i < rows.length; i++) {
        var rowData = [];
        for (var j = 0; j < colCount; j++) {
            rowData.push(rows[i].cells[j].querySelector("input, select").value);
        }
        data.push(rowData);
    }

    // Output as table
    doc.autoTable({
        head: [['Course Name', 'Semester 1', 'Semester 2', 'Honors/AP', 'Dual Credit']],
        body: data,
        startY: 30
    });

    // Save the PDF
    doc.save('transcript.pdf');
}
const qaPairs = {
    "how do i add a new course?": "To add a new course, click the 'Add Row' button at the bottom of the table.",
    "how do i add a new course": "To add a new course, click the 'Add Row' button at the bottom of the table.",
    "how do i add a new class": "To add a new course, click the 'Add Row' button at the bottom of the table.",
    "how do i add a new class": "To add a new course, click the 'Add Row' button at the bottom of the table.",
    "how do i add a new class?": "To add a new course, click the 'Add Row' button at the bottom of the table.",
    "how do i add a class": "To add a new course, click the 'Add Row' button at the bottom of the table.",
    "how do i save my data?": "To save your data, click the 'Save' button. Your data will be stored locally.",
    "how do i calculate my gpa?": "Enter your grades and click the 'Calculate' button to see your GPA.",
    "how do i select an academic course": "Do not click any check boxes. This sets the class to a 4 point or academic scale.",
    "what is a kap course?": "KAP courses are honor classes that are on a 5 point scale.",
    "what is an ap course?": "AP courses are advanced placement college level classes that are on a 5 point scale. ",
    "What is an ap course?": "AP courses are advanced placement college level classes that are on a 5 point scale. ",
    "what is an ap course": "AP courses are advanced placement college level classes that are on a 5 point scale. ",
    "what is a dual credit course?": "Dual credit courses allow you to earn both high school and college credits simultaneously."
};

function askQuestion() {
    const questionInput = document.getElementById("userQuestion");
    const questionText = questionInput.value.toLowerCase().trim();
    const answerText = qaPairs[questionText] || "Currently, we do not have a solution for this specific problem. Try refering to our help menu above. If further assistance is needed, refer to this form: https://shorturl.at/miYcn";

    const qaDisplay = document.getElementById("qaDisplay");
    const questionDiv = document.createElement("div");
    questionDiv.innerHTML = "<strong>You:</strong> " + questionText;
    const answerDiv = document.createElement("div");
    answerDiv.innerHTML = "<strong> Wizard Bob:</strong> " + answerText;

    qaDisplay.appendChild(questionDiv);
    qaDisplay.appendChild(answerDiv);

    questionInput.value = "";
    qaDisplay.scrollTop = qaDisplay.scrollHeight; // Scroll to the bottom
}

// load q and a function thing
window.onload = function () {
    // Existing code...
    document.getElementById('defaultRow').style.display = 'table-row';
    loadInput();
    // Q&A section
    document.getElementById("userQuestion").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            askQuestion();
        }
    });
};


/*console.log(sum);
console.log(numClasses);
console.log(scores);
console.log(courseType);
console.log(gpa);*/


