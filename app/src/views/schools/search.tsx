import React from "react"

export const SearchSchools = () => {
  return (
    <div className="input-group p-3" style={{ width: "400px" }}>
      <div className="form-floating">
        <input id="pw-new" className="form-control form-control-sm"  placeholder="xxx..."/>
        <label htmlFor="pw-new" className="form-label form-label-sm ps-4">Search</label>
      </div>
      <button
        type="button"
        className="btn btn-outline-primary"
        data-mdb-ripple-init
      >
        <i className="bi bi-search"></i>
      </button>
    </div>
  )
}
