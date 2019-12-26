using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Employee.Models.DBModel
{
    public class EmployeeDetails
    {
        #region Instance Properties
        public Int32 EmpId { get; set; }

        public String Name { get; set; }

        public Int32? Age { get; set; }

        public Boolean? MaritalStatus { get; set; }

        public Decimal? Salary { get; set; }

        public String Location { get; set; }

        public DateTime? CreatedDate { get; set; }

        #endregion Instance Properties
    }
}
