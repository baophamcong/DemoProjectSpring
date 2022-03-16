
$(function() {
    $(".header").load("header.html");
    $(".main").load("home.html");
    $(".footer").load("footer.html");
});

function clickNavHome() {
    $(".main").load("home.html");
}

function clickNavViewListEmployees() {
    $(".main").load("viewlistemployees.html");
    buildTable();
}

var employees = [];

function Employee(id, firtName, lastName, emailId) {
    this.id = id;
    this.firtName = firtName;
    this.lastName = lastName;
    this.emailId = emailId;
}

function getListEmployees() {
    // call API from server
    $.get("http://localhost:8080/api/v1/employees", function(data, status) {

        // reset list employees
        employees = [];

        // error
        if (status == "error") {
            // TODO
            alert("Error when loading data");
            return;
        }

        // success
        parseData(data);
        fillEmployeeToTable();
    });
}

function parseData(data) {
    // employees = data;

    data.forEach(function(item) {
        employees.push(new Employee(item.id, item.firtName, item.lastName, item.emailId));
    });
}

function fillEmployeeToTable() {
    employees.forEach(function(item) {
        $('tbody').append(
            '<tr>' +
            '<td>' + item.firtName + '</td>' +
            '<td>' + item.lastName + '</td>' +
            '<td>' + item.emailId + '</td>' +
            '<td>' +
            '<a class="edit" title="Edit" data-toggle="tooltip" onclick="openUpdateModal(' + item.id + ')"><i class="material-icons">&#xE254;</i></a>' +
            '<a class="delete" title="Delete" data-toggle="tooltip" onClick="openConfirmDelete(' + item.id + ')"><i class="material-icons">&#xE872;</i></a>' +
            '</td>' +
            '</tr>')
    });
}

function buildTable() {
    $('tbody').empty();
    getListEmployees();
}

function openAddModal() {
    openModal();
    resetForm();
 
}

function resetForm() {
    document.getElementById("id").value = "";
    document.getElementById("firtName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("emailId").value = "";
}

function openModal() {
    $('#myModal').modal('show');
}

function hideModal() {
    $('#myModal').modal('hide');
}

function addEmployee() {

    // get data
    // var name = document.getElementById("name").value;
    var firtName = document.getElementById("firtName").value;
    var lastName = document.getElementById("lastName").value;
    var emailId = document.getElementById("emailId").value;


    // TODO validate
    // then fail validate ==> return;

    var employee = {
        firtName: firtName,
        lastName: lastName,
        emailId: emailId
        
    };
    $.ajax({
        url: 'http://localhost:8080/api/v1/employees' ,
        type: 'POST',
        data: JSON.stringify(employee),
        contentType:"application/json",
        success: function(data,textStatus,xhr) {
      
            // success
            hideModal();
            showSuccessAlert();
            buildTable();
        },
      error(jqXHR,textStatus,errorThrown){
        alert("Error when loading data")
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
}



function resetFormUpdate() {
    document.getElementById("id").value = "";
    document.getElementById("firtName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("emailId").value = "";
}
function openUpdateModal(id) {

    openModal();
    resetFormUpdate();
    // get index from employee's id
    var index = employees.findIndex(x => x.id == id);

    // fill data
    document.getElementById("id").value = employees[index].id;
    document.getElementById("firtName").value = employees[index].firtName;
 
    document.getElementById("lastName").value = employees[index].lastName;
    document.getElementById("emailId").value = employees[index].emailId;
 
}

function save() {
    var id = document.getElementById("id").value;

    if (id == null || id == "") {
        addEmployee();
    } else {
        updateEmployee();
    }
}


function updateEmployee() {
    var id = document.getElementById("id").value;
    var firtName = document.getElementById("firtName").value;
    var lastName = document.getElementById("lastName").value;
    var emailId = document.getElementById("emailId").value;
    // TODO validate
    // then fail validate ==> return;

    var employee = {
        firtName: firtName,
        lastName: lastName,
        emailId: emailId
        
    };

    $.ajax({
        url: 'http://localhost:8080/api/v1/employees/' + id ,
        type: 'PUT',
        data: JSON.stringify(employee),
        contentType:"application/json",
        success: function(data,textStatus,xhr) {
      
            // success
            hideModal();
            showSuccessAlert();
            buildTable();
        },
      error(jqXHR,textStatus,errorThrown){
        alert("Error when loading data")
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
}


function openConfirmDelete(id) {
    // get index from employee's id
    var index = employees.findIndex(x => x.id == id);
    var firtName = employees[index].firtName;

    var result = confirm("Want to delete " + firtName + "?");
    if (result) {
        deleteEmployee(id);
    }
}

function deleteEmployee(id) {
    // TODO validate



    $.ajax({
        url: 'http://localhost:8080/api/v1/employees/' + id ,
        type: 'DELETE',
        
        success: function(result) {
      
            if(result == undefined||result==null){
                alert("Error when loading data");
                return;
            }
            // success
            showSuccessAlert();
            buildTable();
           
        },
      
      
    });
}

function showSuccessAlert() {
    $("#success-alert").fadeTo(2000, 500).slideUp(500, function() {
        $("#success-alert").slideUp(500);
    });
}