using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Employee.Services
{
    /// <summary>
    /// Class represents API call response
    /// </summary>
    public class CallResponse
    {
        /// <summary>
        /// Parameter less constructor 
        /// </summary>
        public CallResponse() { }

        /// <summary>
        /// Parameterize constructor
        /// </summary>
        public CallResponse(bool status, string message, object data, List<string> errorList)
        {
            Status = status;
            Message = message;
            Data = data;
            ErrorList = errorList;
        }

        /// <summary>
        /// Message Attribute
        /// </summary>
        [JsonProperty("Message")]
        public string Message { get; set; }

        /// <summary>
        /// Status Attribute
        /// </summary>
        [JsonProperty("Status")]
        public bool Status { get; set; }

        /// <summary>
        /// Data Attribute
        /// </summary>
        [JsonProperty("Data")]
        public object Data { get; set; }

        private List<string> _errorList;
        /// <summary>
        /// ErrorList Attribute
        /// </summary>
        [JsonProperty("ErrorList")]
        public List<string> ErrorList
        {
            get
            {
                if (_errorList == null)
                {
                    _errorList = new List<string>();
                }
                return _errorList;
            }
            set
            {
                _errorList = value;
            }
        }

    }
}
