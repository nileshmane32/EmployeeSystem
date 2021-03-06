﻿using Employee.Models.AppModel;
using Employee.Services;
using Employee.Services.Employee;
using System.Web.Http;

namespace Employee.API.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    public class EmployeeController : BaseApiController, IEmployeeController
    {
        private readonly IEmployeeService _service;

        /// <summary>
        /// Default Constructor.
        /// </summary>
        public EmployeeController()
        {
            _service = new EmployeeService(Constants.Configurations.ConnectionString);
        }

        /// <summary>
        /// Bind Employee Details List.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public CallResponse GetEmployeeDetailsList([FromBody]AppFilters filter)
        {
            CallResponse callResponse = _service.GetEmployeeDetailsList(filter);
            return callResponse;
        }

        /// <summary>
        /// This Method use hard delete.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost]
        public CallResponse DeleteEmployee([FromBody]AppFilters filter)
        {
            CallResponse callResponse = _service.DeleteEmployee(filter);
            return callResponse;
        }

        /// <summary>
        /// This Method use save record.
        /// </summary>
        /// <param name="empDetails"></param>
        /// <returns></returns>
        [HttpPost]
        public CallResponse SaveEmployeeDetails([FromBody]AppEmployeeDetails empDetails) 
        {
            CallResponse callResponse = _service.SaveEmployeeDetails(empDetails);
            return callResponse;
        }

        /// <summary>
        /// This Method use update record.
        /// </summary>
        /// <param name="empDetails"></param>
        /// <returns></returns>
        [HttpPost]
        public CallResponse UpdateEmployeeDetails([FromBody]AppEmployeeDetails empDetails)
        {
            CallResponse callResponse = _service.UpdateEmployeeDetails(empDetails);
            return callResponse;
        }
    }
}
