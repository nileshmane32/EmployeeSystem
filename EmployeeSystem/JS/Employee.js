var gApiSuperUrl = "http://localhost/Employee.Api/api/";

$(document).ready(function () {

    FillTable();

    BindButton();

    $("#txtSearchSalary, #txtSalary").on("keypress keyup blur", function (event) {
        $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
        if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });

    $("#txtSearchAge, #txtAge").on("keypress keyup blur", function (event) {
        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });

    $('#txtName, #txtSearchEmployeeName').bind('keypress keyup blur', function () {
        //var node = $(this);
        //node.val(node.val().replace(/[^a-zA-Z ]/g, ''));

        var regex = new RegExp("^[a-zA-Z ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });

    $('#btnUpdate').hide();
    $('#btnSave').hide();
});

// All bind buttons.
function BindButton() {
    $('#btnAddEmployee').click(function () {
        $('#btnUpdate').hide();
        $('#btnSave').show();
        ClearTextBox();
        $('#mdlEmployee').modal('show');
    });

    $('#btnSearchEmployee').click(function () {
        FillTable();
    });

    $('#btnSave').click(function () {
        Save();
    });

    $('#btnUpdate').click(function () {
        Update();
    });
}

// Clear Text Boxe.
function ClearTextBox() {
    $('#txtEmpId').val('');
    $('#txtName').val('');
    $('#txtSalary').val('');
    $('#txtAge').val('');
    $('#ddMaritalStatus').val('').trigger('change');
    $('#ddLocation').val('').trigger('change');
}

//Bind table.
function FillTable() {

    var jsonFilter = {
        Name: $('#txtSearchEmployeeName').val(),
        Salary: $('#txtSearchSalary').val(),
        Age: $('#txtSearchAge').val(),       
        Location: $('#ddSearchLocation').val(),
    };

    $.ajax({
        url: gApiSuperUrl + 'Employee/GetEmployeeDetailsList',
        type: 'POST',
        dataType: 'json',
        data: jsonFilter,
        success: function (data) {
            if (data.status = true) {
                if (data.Data != null) {
                    var colIndex = 0;
                    var columns = [
                        { title: "Emp Id", data: "EmpId", responsivePriority: ++colIndex, sortable: false },
                        { title: "Name", data: "Name", responsivePriority: ++colIndex, sortable: false },
                        { title: "Age", data: "Age", responsivePriority: ++colIndex, sortable: false },
                        {
                            title: "Marital Status",
                            data: null,
                            responsivePriority: ++colIndex,
                            "sortable": false,
                            "render": function (data) {
                                if (data.MaritalStatus == false) {
                                    return "Unmaried";
                                } else if (data.MaritalStatus == true) {
                                    return "Maried";
                                }
                            }
                        },
                        //{ title: "MaritalStatus", data: "MaritalStatus", responsivePriority: ++colIndex },
                        { title: "Salary", data: "Salary", responsivePriority: ++colIndex, sortable: false },
                        { title: "Location", data: "Location", responsivePriority: ++colIndex, sortable: false },
                        {
                            title: "Action",
                            data: null,
                            "orderable": false,
                            "className": "dt-custom-center",
                            "targets": 'no-sort',
                            "sortable": false,
                            "width": "120px",
                            responsivePriority: 1,
                            "render": function (data) {
                                return "<button class='btn btn-xs btn-default text-purple' onClick='ModifyClick(this)' title='Edit' ><i class='fa fa-edit'></i></button> <button class='btn btn-xs btn-default text-red' title='Delete' onClick='DeleteRecord(" + data.EmpId + ")' ><i class='fa fa-trash-o'></i></button>";
                            }
                        },
                    ];

                    var sortArray = [[1, "asc"]];
                    PopulateTableWithSortWithPaginate("#tblEmployeeDetails", data.Data, columns, 1, false, false, false);
                }
            }
        },
    });
}

// Delete employee.
function DeleteRecord(EmpId) {

    confirm('Warning ?', 'Are you sure you want to delete this record?', 0, function (flag, value) {
        if (flag) {

            var json = {
                EmpId: EmpId,
            };

            $.ajax({
                url: gApiSuperUrl + "Employee/DeleteEmployee",
                type: 'POST',
                dataType: 'json',                
                data: json,
                success: function (data) {
                    if (data.status = true) {
                        alert("Success!", data.Message, function () {
                            location.reload();
                        });
                    } else {
                        alert("Error", data.Message);
                    }
                }
            });
        }
    });
}

// Save Employee Detials.
function Save() {

    var json = {
        Name: $('#txtName').val(),
        Salary: $('#txtSalary').val(),
        Age: $('#txtAge').val(),
        Location: $('#ddLocation').val(),
        MaritalStatus: $('#ddMaritalStatus').val(),
    };

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: gApiSuperUrl + "Employee/SaveEmployeeDetails",
        data: json,
        success: function (data) {
            if (data.Status == true) {
                alert("Success!", data.Message, function () {
                    location.reload();
                });
            } else {
                alert("Error", data.Message);
            }
        }
    });
}

// Update Employee Detials.
function Update() {

    var json = {
        EmpId: $('#txtEmpId').val(),
        Name: $('#txtName').val(),
        Salary: $('#txtSalary').val(),
        Age: $('#txtAge').val(),
        Location: $('#ddLocation').val(),
        MaritalStatus: $('#ddMaritalStatus').val(),
    };

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: gApiSuperUrl + "Employee/UpdateEmployeeDetails",
        data: json,
        success: function (data) {
            if (data.Status == true) {
                alert("Success!", data.Message, function () {
                    location.reload();
                });
            } else {
                alert("Error", data.Message);
            }
        }
    });
}

// Edit User Details.
function ModifyClick(e) {

    ClearTextBox();
    $('#btnUpdate').show();
    $('#btnSave').hide();
    $('#mdlEmployee').modal('show');

    var rows = [];
    var arr = [];
    var table = $('#tblEmployeeDetails').DataTable();
    var row = $(e).closest('tr').addClass('selected');
    var data = table.rows('.selected').data();

    $('#txtEmpId').val(data[0].EmpId);
    $('#txtName').val(data[0].Name);
    $('#txtAge').val(data[0].Age);
    if (data[0].MaritalStatus == false) {
        $('#ddMaritalStatus').val("false").trigger('change');
    } else if (data[0].MaritalStatus == true) {
        $('#ddMaritalStatus').val("true").trigger('change');
    }
    $('#txtSalary').val(data[0].Salary);
    $('#ddLocation').val(data[0].Location).trigger('change');

    row = $(e).closest('tr').removeClass('selected');
}

// Populate data table.
function PopulateTableWithSortWithPaginate(target, data, columns, autoopen, sortArray, enablePaginate, enableSearch) {
    $('input.form-control.input-sm').val('');
    for (var i = 0; i < columns.length; i++) {
        if (columns[i]["className"])
            columns[i]["className"] += " dt-head-center";
        else columns[i]["className"] = " dt-head-center";
    }
    // if (autoopen) {
    //   columns.unshift({ "title": "", data: null, defaultContent: "<a>&nbsp</a>", sortable: false, orderable: false, targets: 'no-sort' });
    // }
    if (data == null || (data != null && data.length == 0)) {
        data = new Array();
        //return;
    }

    $(target).dataTable({
        order: sortArray,
        data: data,
        destroy: true,
        fixedColumns: true,
        autoWidth: false,
        //dom: '<"excelHidden"B>frtip',
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text: 'Export Excel',
                exportOptions: {
                    //columns: ':visible',
                    columns: "thead th:not(.sorting_disabled)"
                }
            }
        ],
        language: {
            zeroRecords: "<div class='text-right'>No matching records found</div>",
            infoEmpty: "<div class='text-right'>No records available</div>"
        },
        bPaginate: enablePaginate,
        paging: enablePaginate,
        bFilter: enableSearch,
        searching: enableSearch,
        responsive: {

            details: {
                type: 'row',
                renderer: function (api, rowIdx, columns) {
                    var rowIndex = rowIdx;
                    var data = $.map(columns, function (col, i) {
                        if (col.hidden) {
                            if (col.data.indexOf('input') > 0) {
                                var row = $(target).DataTable().row(rowIndex[0]).node();
                                var input = $(row).children(':nth-child(' + (i + 1) + ')').children('input');
                                $(input).attr('value', $(input).val());
                                input = $(input).parent().html();
                                //var input = col.data;
                                var newcontrol = '<input ' + 'onchange="resposiveTableControlChanged(this,' + rowIndex[0] + ',' + i + ')" ' + input.substring(input.indexOf('index') + 7, input.length);
                                col.data = newcontrol;
                            }
                        }
                        return (col.hidden && col.title.trim() != '') ?
                            '<div data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                            '<div class="col-md-3 col-xs-6"><strong>' + col.title + ':' + '</strong></div> ' +
                            '<div class="col-md-3 col-xs-6 text-right">' + (col.data ? col.data : "&nbsp;") + '</div>' +
                            '</div>' :
                            '';
                    }).join('');
                    return data ?
                        ('<div class="row">' + data + '</div>') :
                        false;
                }
            }
        },
        lengthMenu: [10, 25, 50, 100, 500, 1000],
        columns: columns,
        fnInitComplete: function () {
            if (!data.length) {
                //    alert("Warning", "No data found!");
                $(target).hide();
            } else {
                $(target).show();
                $(target + "_wrapper").css("padding", "10px 10px 45px 10px").css("background-color", "rgb(255,255,255)");
                // $(target + ">thead th").css("width", "20%");

                $(target + "_wrapper").css("padding", "10px 10px 45px 10px").css("background-color", "rgb(255,255,255)");

                $('[data-toggle="tooltip"]').tooltip();
                $('.dt-text-currency').each(function (index, el) {
                    var amount = $(el).text();
                    if (amount != null && amount != "" && !isNaN(amount)) {
                        $(el).text(formatCurrency(amount));
                    }
                });
            }


        },
        drawCallback: function () {
            if (data != null && data.length > 0) {
                try {
                    if ($(target) != null && $(target).DataTable() != null && $(target).DataTable().rows() != null) {
                        if ($(target).DataTable().rows().count()) {
                            $(target).show();
                        }
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
    });
    $('input[type = search]').val('');
    // ttd(target, data);
}

// Alert Message.
function alert(title, message, callback) {
    $('#AlertTitle').empty().html(title);
    $('#AlertMessage').empty().html(message);
    $('#AlertBox').modal();
    $('#AlertBoxOk').off('click');
    $('#AlertBoxOk').on('click', function () {
        if (callback) {
            callback(true);
        }
        $('#AlertBox').modal('hide');
    });
    $('#AlertBoxClose').on('click', function () {
        if (callback) callback(false);
    });
}

// Confirm Message.
function confirm(title, message, requiresresponse, callback) {
    var result;
    $('#ConfirmResponse').val('');
    $('#ConfirmTitle').empty().html(title);
    if (!requiresresponse) {
        $('#ConfirmResponse').hide();
    }
    $('#ConfirmMessage').empty().html(message);
    $('#ConfirmBox').modal();
    $('#ConfirmBoxYes').off('click');
    $('#ConfirmBoxYes').click(function () {
        $('#ConfirmBox').modal('hide');
        if (true) {
            if (callback)
                callback(true, $('#ConfirmResponse').val().trim());
            else throw "No Callback function found.";
        }
    });
    $('#ConfirmBoxNo').click(function () {
        $('#ConfirmBox').modal('hide');
        if (callback)
            callback(false, $('#ConfirmResponse').val().trim());
        else throw "No Callback function found.";

    });
}