import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import React from "react"

export default function CustomTable({
  tableHeaders,
  tableData,
  tableStyle,
  tableHeaderStyle,
  rowClickFunction,
  tableDataOrder,
}: {
  tableHeaders: Array<string>
  tableData: Array<any>
  tableDataOrder: Array<string>
  tableStyle?: object
  tableHeaderStyle?: object
  rowClickFunction?: (data: any) => void
}) {
  return (
    <TableContainer style={tableStyle}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {tableHeaders.map((header, index) => {
              if (index === 0)
                return (
                  <TableCell key={index} style={tableHeaderStyle}>
                    {header}
                  </TableCell>
                )
              else
                return (
                  <TableCell key={index} align="right" style={tableHeaderStyle}>
                    {header}
                  </TableCell>
                )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((data, index) => (
            <TableRow
              key={index}
              onClick={() => {
                if (rowClickFunction) rowClickFunction(data)
              }}
              className="selected-row"
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {tableDataOrder.map((key, index) => {
                if (index === 0)
                  return (
                    <TableCell key={index} component="th" scope="row">
                      {data[key]}
                    </TableCell>
                  )
                else
                  return (
                    <TableCell key={index} align="right">
                      {data[key]}
                    </TableCell>
                  )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
