/** Renders errors from backend
 *
 * props: errors
 * state: none
 *
 * {JobList, CompanyDetail, CompanyList} -> Errors
 */

 function Error({ errors }) {
    return (
      <div className="Error">
        {errors.map((err, idx) => (
          <h1 key={idx}>{err}</h1>
        ))}
      </div>
    );
  }
  export default Error;
  