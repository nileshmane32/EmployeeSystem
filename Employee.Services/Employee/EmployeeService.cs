using Employee.Models.AppModel;
using Employee.Models.DBModel;
using System;
using System.Linq;

namespace Employee.Services.Employee
{
    public class EmployeeService : BaseClass, IEmployeeService
    {
        /// <summary>
        /// Get connection string.
        /// </summary>
        /// <param name="_connectionString"></param>
        public EmployeeService(string _connectionString)
        {
            ConnectionString = _connectionString;
        }

        /// <summary>
        /// Bind Employee Details List.
        /// </summary>
        /// <returns></returns>
        public CallResponse GetEmployeeDetailsList(AppFilters filter) 
        {
            CallResponse callResponse = new CallResponse();
            try
            {
                using (var context = new DBEntities(ConnectionString))
                {
                    var empList = (from ED in context.EmployeeDetails
                                    select new AppEmployeeDetails
                                    {
                                        EmpId = ED.EmpId,
                                        Name = ED.Name,
                                        Age = ED.Age,
                                        MaritalStatus = ED.MaritalStatus,
                                        Salary = ED.Salary,
                                        Location = ED.Location,
                                    }).ToList();

                    if (!string.IsNullOrEmpty(filter.Name))
                    {
                        //empList = empList.Where(b => b.Name.Contains(filter.Name)).ToList();
                        empList = empList.Where(c => !string.IsNullOrEmpty(c.Name) && c.Name.ToLower().IndexOf(filter.Name.ToLower()) >= 0).ToList(); 
                    }
                    if (!string.IsNullOrEmpty(filter.Age))
                    {
                        empList = empList.Where(b => b.Age.ToString().StartsWith(filter.Age)).ToList();
                    }
                    if (!string.IsNullOrEmpty(filter.Salary))
                    {
                        empList = empList.Where(b => b.Salary.ToString().StartsWith(filter.Salary)).ToList();
                    }
                    if (!string.IsNullOrEmpty(filter.Location) && filter.Location != "")
                    {
                        empList = empList.Where(b => b.Location.ToString().StartsWith(filter.Location)).ToList();
                    }

                    callResponse.Data = empList;
                    callResponse.Status = true;
                    callResponse.Message = "Success";
                }
            }
            catch (Exception ex)
            {
                callResponse.Status = false;
                callResponse.Message = "Error :" + ex.Message;
            }
            return callResponse;
        }

        /// <summary>
        /// This Method use hard delete.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public CallResponse DeleteEmployee(AppFilters filter)
        {
            CallResponse callResponse = new CallResponse();
            try
            {
                using (var context = new DBEntities(ConnectionString))
                {
                    using (var dbTrans = context.Database.BeginTransaction())
                    {
                        try
                        {
                            var deleteRecord = context.EmployeeDetails.Where(c => c.EmpId == filter.EmpId).FirstOrDefault();

                            if (deleteRecord != null)
                            {
                                context.Entry(deleteRecord).State = System.Data.Entity.EntityState.Deleted;
                                context.SaveChanges();
                            }

                            dbTrans.Commit();
                            callResponse.Status = true;
                            callResponse.Message = "Employee deleted successfully.";
                        }
                        catch (Exception ex)
                        {
                            dbTrans.Rollback();
                            callResponse.Status = false;
                            callResponse.Message = "Error :" + ex.Message;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                callResponse.Status = false;
                callResponse.Message = "Error :" + ex.Message;
            }
            return callResponse;
        }

        /// <summary>
        /// This Method use save record.
        /// </summary>
        /// <param name="empDetails"></param>
        /// <returns></returns>
        public CallResponse SaveEmployeeDetails(AppEmployeeDetails empDetails)
        {
            CallResponse callResponse = new CallResponse();
            try
            {
                using (var context = new DBEntities(ConnectionString))
                {
                    using (var dbTrans = context.Database.BeginTransaction())
                    {
                        try
                        {
                            EmployeeDetails rcdEmp = context.EmployeeDetails.Where(c => c.EmpId == empDetails.EmpId).FirstOrDefault();

                            if (rcdEmp == null)
                            {
                                rcdEmp = new EmployeeDetails();

                                rcdEmp.Name = empDetails.Name;
                                rcdEmp.Age = empDetails.Age;
                                rcdEmp.MaritalStatus = empDetails.MaritalStatus;
                                rcdEmp.Salary = empDetails.Salary;
                                rcdEmp.Location = empDetails.Location;
                                rcdEmp.CreatedDate = DateTime.Now;
                                context.EmployeeDetails.Add(rcdEmp);
                                context.SaveChanges();
                            }
                            dbTrans.Commit();

                            callResponse.Status = true;
                            callResponse.Message = "Record save successfully";
                        }
                        catch (Exception ex)
                        {
                            dbTrans.Rollback();
                            callResponse.Status = false;
                            callResponse.Message = "Error :" + ex.Message;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                callResponse.Status = false;
                callResponse.Message = "Error :" + ex.Message;
            }
            return callResponse;
        }

        /// <summary>
        /// This Method use update record.
        /// </summary>
        /// <param name="empDetails"></param>
        /// <returns></returns>
        public CallResponse UpdateEmployeeDetails(AppEmployeeDetails empDetails)
        {
            CallResponse callResponse = new CallResponse();
            try
            {
                using (var context = new DBEntities(ConnectionString))
                {
                    using (var dbTrans = context.Database.BeginTransaction())
                    {
                        try
                        {
                            var rcdEmp = context.EmployeeDetails.Where(c => c.EmpId == empDetails.EmpId).FirstOrDefault();

                            if (rcdEmp != null)
                            {
                                rcdEmp.Name = empDetails.Name;
                                rcdEmp.Age = empDetails.Age;
                                rcdEmp.MaritalStatus = empDetails.MaritalStatus;
                                rcdEmp.Salary = empDetails.Salary;
                                rcdEmp.Location = empDetails.Location;
                                rcdEmp.CreatedDate = DateTime.Now;
                                context.Entry(rcdEmp).State = System.Data.Entity.EntityState.Modified;
                                context.SaveChanges();
                            }
                            dbTrans.Commit();

                            callResponse.Status = true;
                            callResponse.Message = "Record updated successfully";
                        }
                        catch (Exception ex)
                        {
                            dbTrans.Rollback();
                            callResponse.Status = false;
                            callResponse.Message = "Error :" + ex.Message;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                callResponse.Status = false;
                callResponse.Message = "Error :" + ex.Message;
            }
            return callResponse;
        }
    }
}
