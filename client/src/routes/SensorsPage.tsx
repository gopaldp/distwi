import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../authContext/AuthContext";
import { Typography, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody ,Table,TablePagination} from "@mui/material";

type SensorList = {
  [sensorName: string]: sensorListReadings;
};

type sensorReading = {
  value: number;
  time: string;
};

type sensorListReadings = {
  temperature?: sensorReading;
  humidity?: sensorReading;
  pressure?: sensorReading;
};

const SensorsPage = () => {
  const { token, logout } = useAuth();
  const [sensorList, setSensorList] = useState<SensorList>({});
   const sensorEntries = Object.entries(sensorList);
     const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginatedEntries = sensorEntries.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
  
      axios
        .get("http://localhost:8000/sensors", { params: { token } })
        .then((res) => {
          
          setSensorList(res.data.sensors);
        })
        .catch((err) => {
          console.error("Failed to fetch sensor data", err);
        });

        
    }, [token]);
    console.log(sensorList);
  return (
<div>

    
             <Typography variant="h6" gutterBottom>
               Real-time Sensor Data
             </Typography>
               <TableContainer component={Paper}>
                 <Table >
                   <TableHead>
                     <TableRow>
                       <TableCell>Sensor</TableCell>
                       <TableCell>Temperature (°C)</TableCell>
                       <TableCell>Humidity (%)</TableCell>
                       <TableCell>Pressure (kPa)</TableCell>
                       <TableCell>Last Updated</TableCell>
                     </TableRow>
                   </TableHead>
                   <TableBody>
                     {Object.entries(sensorList).map(([name, readings]) => (
                       <TableRow key={name}>
                         <TableCell>{name}</TableCell>
                         <TableCell>{readings?.temperature?.value ?? "N/A"}</TableCell>
                         <TableCell>{readings?.humidity?.value ?? "N/A"}</TableCell>
                         <TableCell>{readings?.pressure?.value ?? "N/A"}</TableCell>
                         <TableCell>
                           {readings?.temperature?.time ||
                             readings?.humidity?.time ||
                             readings?.pressure?.time ||
                             "N/A"}
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>

                 <TablePagination
          component="div"
          count={sensorEntries.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
               </TableContainer>
           
           </div>
  );
};

export default SensorsPage;