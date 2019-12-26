using System;
using System.Linq;
using System.Runtime.Serialization;
using System.Web.Http;

namespace Employee.API.Controllers
{
    /// <summary>
    /// Master Controller responsible for all common methods which will be used by derived controllers
    /// </summary>
    public class MasterApiController : ApiController
    {
        /// <summary>
        /// Method to extract the header values
        /// </summary>
        public string GetHeaderValue(string Key)
        {
            var re = Request;
            var headers = re.Headers;
            if (headers.Contains(Key))
            {
                return headers.GetValues(Key).First();
            }
            else
            {
                return null;
            }

        }
    }

    [Serializable]
    internal class CustomException : Exception
    {
        public CustomException()
        {
        }

        public CustomException(string message) : base(message)
        {
        }

        public CustomException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected CustomException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
