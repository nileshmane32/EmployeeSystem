using System;

namespace Employee.Services
{
    public class BaseClass
    {
        private string _connectionString;

        public String ConnectionString
        {
            get
            {
                return _connectionString;
            }
            set
            {
                _connectionString = value;
            }
        }
    }
}
