using System.Configuration;

namespace Employee.API
{
    /// <summary>
    /// Constants Class
    /// </summary>
    public static class Constants
    {
        /// <summary>
        /// Configuration Related Constants Class
        /// </summary>
        public static class Configurations
        {
            private static string _connectionString = string.Empty;

            /// <summary>
            /// Connection String for Application
            /// </summary>
            public static string ConnectionString
            {
                get
                {
                    if (string.IsNullOrEmpty(_connectionString))
                    {
                        if (ConfigurationManager.ConnectionStrings["ConnectionString"] != null)
                        {
                            if (!string.IsNullOrEmpty(ConfigurationManager.ConnectionStrings["ConnectionString"].ToString()))
                            {
                                _connectionString = ConfigurationManager.ConnectionStrings["ConnectionString"].ToString();
                            }
                        }
                    }
                    return _connectionString;
                }
            }
        }
    }
}