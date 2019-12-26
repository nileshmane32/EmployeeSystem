using Employee.Models.AppModel;
using Employee.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace Employee.API.Controllers
{
    /// <summary>
    /// Interface for Employee Controller.
    /// </summary>
    public interface IEmployeeController
    {
        /// <summary>
        /// Bind Employee Details List.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        CallResponse GetEmployeeDetailsList([FromBody]AppFilters filter);

        /// <summary>
        /// This Method use hard delete.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        CallResponse DeleteEmployee([FromBody]AppFilters filter);

        /// <summary>
        /// This Method use save record.
        /// </summary>
        /// <param name="empDetails"></param>
        /// <returns></returns>
        CallResponse SaveEmployeeDetails([FromBody]AppEmployeeDetails empDetails);

        /// <summary>
        /// This Method use update record.
        /// </summary>
        /// <param name="empDetails"></param>
        /// <returns></returns>
        CallResponse UpdateEmployeeDetails([FromBody]AppEmployeeDetails empDetails);
    }
}
