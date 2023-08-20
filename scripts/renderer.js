//Begin
var cvwindow;

//Creating a new window for rendering the CV
cvwindow = window.open("", "_blank", "height=800,width=601");

//parent element of the whole ERP CV form (Oogway was the boss in Kung Fu Panda)
var oogway = document.getElementById("myframe").contentDocument.documentElement; //parent

//Preventing to render CV on Company list page, both CV making form and this have same URL
try {
    var pref1_parent = oogway.querySelector("#cv1_pref1").parentElement;
} catch {
    cvwindow.document.write("Oops! Something went wrong");
    throw new Error("Something went wrong");
}

var student_name = oogway.querySelector("#full_name").value; //Student's name

// -----------------------------------------//---------------------------------------//

//Populating cv1 preference order (Internships, Projects etc...)
var cv1_pref = []  // Stores preference order of elements for cv1

function populate_pref1() {
    cv1_pref.splice(0, cv1_pref.length);
    for (let i = 1; i <= 14; i++) cv1_pref.push(oogway.querySelector("#cv1_pref" + i).selectedOptions[0].innerText);
    cv1_pref = cv1_pref.filter(item => item !== "Select");
    cv1_pref;
}
populate_pref1();

//The Terms in order dropdown
var order_fields = ["Internships", "Projects", "Internships and Projects", "Academic Achievement", "Certification",
    "Training", "Experience", "Entrepreneurial Experience", "Competition/Conference",
    "Publication", "Position of Responsibilities", "Extra-Curricular Activities",
    "Skills and Expertise", "Coursework Information"];

//The terms in element dropdown 
var element_fields = ["Internship", "Project", "Internship/Project", "Academic Achievement", "Certification",
    "Training", "Experience", "Entrepreneurial Experience", "Competition/Conference",
    "Publication", "Position of Responsibilities"];

//function to fill Skills, EAA and Coursework info
function fill_xtras() {
    var course_info = oogway.querySelector('[title="Rich Text Editor, research_area"]').contentDocument.documentElement;
    course_info = course_info.querySelector("body").innerHTML;

    var skills_cv1 = oogway.querySelector('[title="Rich Text Editor, skill"]').contentDocument.documentElement;
    skills_cv1 = skills_cv1.querySelector("body").innerHTML;

    var eaa_cv1 = oogway.querySelector('[title="Rich Text Editor, eaa"]').contentDocument.documentElement;
    eaa_cv1 = eaa_cv1.querySelector("body").innerHTML;
    var xtras = new Map();
    xtras.set("Extra-Curricular Activities", eaa_cv1);
    xtras.set("Skills and Expertise", skills_cv1);
    xtras.set("Coursework Information", course_info);
    return xtras;
}

//The structure which is displayed in the CV (Title and its description)
// This returns the title and description mapped
function fill_assigner() {
    var assigner = new Map();
    for (let i = 0; i < element_fields.length; i++)
        assigner.set(element_fields[i], []); //map of objects for element holders

    for (let i = 7; i <= 56; i++) {
        var field_temp = oogway.querySelector("#standard" + i).selectedOptions[0].innerText;
        if (field_temp == "Select") continue;
        var title = oogway.querySelector("#university" + i).value;
        var temp_desc = oogway.querySelector(`[title="Rich Text Editor, subject${CSS.escape(i)}"]`).contentDocument.documentElement;
        var description = temp_desc.querySelector("body").innerHTML;
        var incv1 = !Boolean(oogway.querySelector('[name="' + i + 'resume1"]').selectedIndex);
        var incv2 = !Boolean(oogway.querySelector('[name="' + i + 'resume2"]').selectedIndex);
        var incv3 = !Boolean(oogway.querySelector('[name="' + i + 'resume3"]').selectedIndex);
        assigner.get(field_temp).push({
            "title": title,
            "description": description,
            "incv1": incv1,
            "incv2": incv2,
            "incv3": incv3
        });
    }
    return assigner;
}

//Displaying the content in CV1 by returning the HTML tags concatenated
//element_field maybe sth like Internships, Projects. Aggregate all of them together
function display_content_cv1(element_field) {
    var assigner = fill_assigner();
    var size = assigner.get(element_field).length;
    var return_object = ``;
    for (let i = 0; i < size; i++) {
        var element = assigner.get(element_field)[i];
        if (element.incv1) {
            return_object += `<pre>${element.title}</pre><p>${element.description}</p>`;
        };
    }
    return return_object;
};

//Displaying CV1 by order as required
function display_cv1_byorder() {
    var return_object = ``;
    var xtras = fill_xtras(); //fill the xtras

    //collecting all elements as ordered in CV1 pref list
    for (let i = 0; i < cv1_pref.length; i++) {
        //oem stands for Original Element Name like Internships, Projects
        var oem = cv1_pref[i];
        var idx_in_order_fields = order_fields.indexOf(oem);
        return_object += `<p class="section-header">${oem.toUpperCase()}</p>`;
        if (idx_in_order_fields >= element_fields.length) {
            return_object += xtras.get(oem);
        }
        else {
            var element_field = element_fields[idx_in_order_fields];
            return_object += display_content_cv1(element_field);
        }
    };
    return return_object;
}


//rendering the whole CV in the new generated window
//This function runs every time something is changed in the CV
function render_cv() {
    //mywindow.blur();
    var writing_element = `<head>
                            <title>CV Generate-Dynac</title>
                            <style>
                                p {margin:-1px}
                                .main_body { width:556px; border-width:1px; border-style:solid; padding-left:2px;
                                    font-family:Calibri; zoom:105%
                                }
                                .section-header{ text-align:center; font-family:Calibri; font-weight:bold;
                                    font-size:12px; border-width:1px; border-style:solid; background:#D9EBFE;
                                    border-radius:3px;
                                }
                                pre {
                                    display:block; font-family: Calibri; white-space: pre;
                                    margin: 0em 0em 0em 0em; font-size:9.8px; font-weight:bolder
                                }
                            </style>
                            </head>
                            <div class="main_body">
                                <p><b>Name:</b> ${student_name}</p><br>
                                <p>[Educational Details go here]</p><br><br><br>
                                ${display_cv1_byorder()}
                            </div>`;

    cvwindow.document.write(writing_element);
    cvwindow.document.close();
};

render_cv();

//--------------- For Update button only when CV portal is active in ERP ----------------//
// The window closes after clicking update button on ERP Portal
var update_button = oogway.querySelector("#saveprdata")
if (update_button != null) {
    const cl_message = "You have updated your CV in ERP. This window will close, Generate CV again";
    update_button.addEventListener("click", () => {
        cvwindow.document.write(cl_message);
        setTimeout(() => { cvwindow.close() }, 2700)
    }, false);
}

/*/--------------- For adding event listeners to various elements ----------------------/*/
evc_text = (target) => target.addEventListener("keyup", () => { render_cv() }, false);
evc_change = (target) => target.addEventListener("change", () => { render_cv() }, false);

var cw_info = oogway.querySelector('[title="Rich Text Editor, research_area"]').contentDocument.documentElement.querySelector("body");
var sknexp = oogway.querySelector('[title="Rich Text Editor, skill"]').contentDocument.documentElement.querySelector("body");
var eaa = oogway.querySelector('[title="Rich Text Editor, eaa"]').contentDocument.documentElement.querySelector("body");

//Event listeners for xtras
evc_text(cw_info);
evc_text(sknexp); 
evc_text(eaa);

//Selecting the big table which contains the elements descriptions
var element_table = oogway.querySelector("#profTab");
var element_table_child = element_table.querySelectorAll("#profTr");

//adding event listeners to individual elements in the table
for (let i = 7; i <= 56; i++){
    var category = oogway.querySelector("#standard" + i);
    var cat_head = oogway.querySelector("#university" + i);
    var incv = oogway.querySelector('[name="' + i + 'resume1"]');
    var etc_des = element_table_child[i-7].getElementsByClassName("cke_wysiwyg_frame cke_reset")[0]
    //if (category.selectedOptions[0].innerText == "Select") break;
    evc_change(category);
    evc_text(cat_head);
    evc_change(incv);
    evc_text(etc_des.contentDocument.documentElement.getElementsByTagName("body")[0]);
}

// Event listener for Preference order of cv1
pref1_parent.addEventListener('change', () => { populate_pref1(); render_cv(); }, false);

/*/------------------------------- End ------------------------------------------------/*/