using Employee.Models.AppModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Employee.Services.Employee
{
    /// <summary>
    /// Interface for Employee Service.
    /// </summary>
    public interface IEmployeeService
    {
        /// <summary>
        /// Bind Employee Details List.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        CallResponse GetEmployeeDetailsList(AppFilters filter);

        /// <summary>
        /// This Method use hard delete.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        CallResponse DeleteEmployee(AppFilters filter);

        /// <summary>
        /// This Method use save record.
        /// </summary>
        /// <param name="empDetails"></param>
        /// <returns></returns>
        CallResponse SaveEmployeeDetails(AppEmployeeDetails empDetails);

        /// <summary>
        /// This Method use update record.
        /// </summary>
        /// <param name="empDetails"></param>
        /// <returns></returns>
        CallResponse UpdateEmployeeDetails(AppEmployeeDetails empDetails);
    }
}
