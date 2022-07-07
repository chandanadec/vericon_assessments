import axios from "axios";
import React, { useState, useEffect } from "react";
import { Accordion, Table } from "react-bootstrap";
// import dashboarState from "./dashboarState";

type Device = {
  name:string;
  serialNumber:string;
  status:string;
  connectionStatus: string;
  deviceType: string;
}

interface DeviceData {
  [key: string]: Device[];
}


const Accordian = () => {
  const [deviceData, setDeviceData] = useState<DeviceData>({});
  useEffect(() => {
    const header = {
      headers: {
        Authorization: "Bearer ade74927-f3df-4718-8f85-d10bab443b1c",
      },
    };
    axios.get("https://vstechtest.azurewebsites.net/api/GetData", header).then((res)=>{
      
    const data:any =[];
    res.data.forEach((item:Device,index:number)=>{
      if(data && data[item.deviceType]){
          data[item.deviceType].push(item);
      } else {
        data[item.deviceType]=[{...item}];
      }
    });
    setDeviceData(data);

      
    });
  }, []);
  const keys:string[] = Object.keys(deviceData);
  
  return (
    <Accordion defaultActiveKey="0">
      {keys.map((deviceType:keyof DeviceData, index:number)=>{
        const total:number = deviceData[deviceType].length;
        const online:number =deviceData[deviceType].filter((i:Device) => i.connectionStatus=== "Online").length;
        const onlinePercent = ((online/total)*100).toFixed(2);
        const offline:number = deviceData[deviceType].filter((i:Device)=>i.connectionStatus=== "Offline").length;
        const offlinePercent = ((offline/total)*100).toFixed(2);

        return (<Accordion.Item eventKey={`${index}`}>
        <Accordion.Header>{deviceType}&emsp;&emsp;&emsp;{`Total Devices:(${total})`}&emsp;&emsp;&emsp;{` Online: (${onlinePercent})`}&emsp;&emsp;&emsp;{` Offline(${offlinePercent})`}</Accordion.Header>
        <Accordion.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Device Name</th>
                <th>Device Serial Number</th>
                <th>Device Location</th>
                <th>Device Status</th>
              </tr>
            </thead>
            <tbody>
              {deviceData[deviceType].map((item:Device, index:number)=>(<tr>
                <td>{item.name}</td>
                <td>{item.serialNumber}</td>
                <td>{item.deviceType}</td>
                <td>{item.connectionStatus}</td>
              </tr>))}
              
            </tbody>
          </Table>
        </Accordion.Body>
      </Accordion.Item>)})}
      
    </Accordion>
  );
};

export default Accordian;

