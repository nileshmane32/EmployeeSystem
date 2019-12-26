using Employee.Models.AppModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Employee.Services.Employee
{
    public interface IEmployeeService
    {
        CallResponse GetEmployeeDetailsList(AppFilters filter);

        CallResponse DeleteEmployee(AppFilters filter);
    }
}
