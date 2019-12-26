
$(document).ready(function () {

    FillTable();

    BindButton();
});

// All bind buttons.
function BindButton() {
    $('#btnAddEmployee').click(function () {
        $('#mdlEmployee').modal('show');
    });

    $('#btnSearchEmployee').click(function () {
        FillTable();
    });
}

//Bind table
function FillTable() {

    var jsonFilter = {

        Name: $('#txtSearchEmployeeName').val(),
        Salary: $('#txtSearchSalary').val(),
        Age: $('#txtSearchAge').val(),       
        Location: $('#ddSearchLocation').val(),
    };

    $.ajax({
        url: "http://localhost/Employee.Api/api/" + 'Employee/GetEmployeeDetailsList',
        type: 'POST',
        dataType: 'json',
        data: jsonFilter,
        success: function (data) {
            if (data.status = true) {
                if (data.Data != null) {
                    var colIndex = 0;
                    var columns = [
                        { title: "Emp Id", data: "EmpId", responsivePriority: ++colIndex },
                        { title: "Name", data: "Name", responsivePriority: ++colIndex },
                        { title: "Age", data: "Age", responsivePriority: ++colIndex },
                        {
                            title: "Marital Status",
                            data: null,
                            responsivePriority: ++colIndex,
                            "render": function (data) {
                                if (data.MaritalStatus == "0") {
                                    return "Unmaried";
                                } else if (data.MaritalStatus == "1") {
                                    return "Maried";
                                }
                            }
                        },
                        //{ title: "MaritalStatus", data: "MaritalStatus", responsivePriority: ++colIndex },
                        { title: "Salary", data: "Salary", responsivePriority: ++colIndex },
                        { title: "Location", data: "Location", responsivePriority: ++colIndex },
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
                                return "<button class='btn btn-xs btn-default text-red' title='Delete' onClick='DeleteRecord(" + data.EmpId + ")' ><i class='fa fa-trash-o'></i></button>";
                            }
                        },
                    ];

                    var sortArray = [[1, "asc"]];
                    PopulateTableWithSortWithPaginate("#tblEmployeeDetails", data.Data, columns, 1, false, false, true);
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
                url: "http://localhost/Employee.Api/api/" + "Employee/DeleteEmployee",
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