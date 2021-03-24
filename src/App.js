import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal,ModalBody,ModalFooter,ModalHeader} from 'reactstrap';

function App() {
  // const baseUrl="http://localhost:59601/api/Recibos";
  const baseUrl="https://apirecibos.azurewebsites.net/api/Recibos";
  const [data,setData]=useState([]);
  const [modalInsertar,setModalInsertar]=useState(false);
  const [modalEditar,setModalEditar]=useState(false);
  const [modalEliminar,setModalEliminar]=useState(false);

  
  const [reciboSeleccionado,setReciboSeleccionado]=useState({
    id:'',
    proveedor:'',
    monto: '',
    moneda:'',
    fecha: '',
    comentario:'',
    id_usuario: ''
  })

  /**FUNCIONES PARA ABRIR Y CERRAR LOS MODALAES DE INSERCION,EDICION Y ELIMINAR ***********************/
  /***********************************************START************************************************/

  /*Abrir o Cerrar Modal de Insercion*/ 
  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }
  /***********************************************END************************************************/

  /**FUNCION PARA VERIFICAR SI HAY CAMBION EN LOS INTPUT DE LOS MODALES******************************/
  /*********************************************START******************************/
  const handleChange=e=>{
    const{name,value}=e.target;
    setReciboSeleccionado({
      ...reciboSeleccionado,
      [name]: value
    });
    console.log(reciboSeleccionado);
  }
  /*********************************************END******************************/

/**************************************** START***************************************************************/
 /** CRUD FUNCIONES GET,POST,PUT,DELETE*/
  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);

    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    delete reciboSeleccionado.id;
    reciboSeleccionado.monto=parseFloat(reciboSeleccionado.monto);
    reciboSeleccionado.id_usuario=parseInt(reciboSeleccionado.id_usuario);
    await axios.post(baseUrl,reciboSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }
  const peticionPut=async()=>{
    reciboSeleccionado.monto=parseFloat(reciboSeleccionado.monto);
    reciboSeleccionado.id_usuario=parseInt(reciboSeleccionado.id_usuario);
    await axios.put(baseUrl+"/"+reciboSeleccionado.id,reciboSeleccionado)
    .then(response=>{
      var respuesta = response.data;
      var dataAuxiliar = data;
      dataAuxiliar.map(recibo=>{
        if(recibo.id===reciboSeleccionado.id){
          recibo.proveedor=respuesta.proveedor;
          recibo.monto=respuesta.monto;
          recibo.moneda=respuesta.moneda;
          recibo.fecha=respuesta.fecha;
          recibo.comentario=respuesta.comentario;
          recibo.id_usuario=respuesta.id_usuario;
        }
      })
      abrirCerrarModalEditar();
      peticionGet();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/"+reciboSeleccionado.id)
    .then(response=>{
      setData(data.filter(recibo=>recibo.id!==response.data));
      abrirCerrarModalEliminar();
      peticionGet();
    }).catch(error=>{
      console.log(error);
    })
  }

  /**************************************** END***************************************************************/



  const seleccionarRecibo=(recibo,caso)=>{
    setReciboSeleccionado(recibo);
    (caso==="Editar")?
    abrirCerrarModalEditar(): abrirCerrarModalEliminar();
  }

useEffect(()=>{
  peticionGet();
},[])

  return (
    <div className="App">
        <br></br>
        <button  onClick={()=>abrirCerrarModalInsertar()} className="btn btn-success ">Nuevo Recibo</button>
        <br></br>
        <br></br>
        <table className='table table-bordered'>
          <thead>
            <td hidden>Id</td>
            <td>Proveedor</td>
            <td>Monto</td>
            <td>Moneda</td>
            <td>Fecha</td>
            <td>Comentario</td>
            <td hidden>id_Usuario</td>
            <td>Acciones</td>
          </thead>
          <tbody>
            {data.map(recibo=>(
              <tr key={recibo.id}>
                <td hidden>{recibo.id}</td>
                <td>{recibo.proveedor}</td>
                <td>{recibo.monto}</td>
                <td>{recibo.moneda}</td>
                <td>{recibo.fecha}</td>
                <td>{recibo.comentario}</td>
                <td hidden>{recibo.id_usuario}</td>
                <td>
                  <button className="btn btn-primary" onClick={()=>seleccionarRecibo(recibo,"Editar")}>Editar</button>{" "}
                  <button className="btn btn-danger" onClick={()=>seleccionarRecibo(recibo,"Eliminar")}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      
        <Modal isOpen={modalInsertar}>
          <ModalHeader>Insertar Recibo</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>Proveedor</label>
              <br/>
              <input type="text" className="form-control" name="proveedor" onChange={handleChange}></input>
              <br/>
              <label>Monto</label>
              <br/>
              <input type="number" className="form-control" name="monto" min="0" placeholder="0" step=".01" onChange={handleChange}/>
              <br/>
              <label>Moneda</label>
              <br/>
              <select name="moneda" className="form-control"  onChange={handleChange}>
                <option selected value="MXN">MXN</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <br/>
              <label>Fecha</label>
              <br/>
              <input type="date" name="fecha" className="form-control" onChange={handleChange}></input>
              <br/>
              <label>Comentario</label>
              <br/>
              <input type="text" className="form-control" name="comentario" onChange={handleChange}></input>
              <br/>
              <label hidden>Id Usuario</label>
              <br/>
              <input type="text" hidden className="form-control" name="id_usuario" onChange={handleChange}></input>
              <br/>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"   "}
            <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>{" "}
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalEditar}>
          <ModalHeader>Editar Recibo</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>Id</label>
              <br/>
              <input type="text" className="form-control" readOnly  value={reciboSeleccionado && reciboSeleccionado.id}></input>
              <br/>
              <label>Proveedor</label>
              <br/>
              <input type="text" className="form-control" name="proveedor" onChange={handleChange} value={reciboSeleccionado && reciboSeleccionado.proveedor}></input>
              <br/>
              <label>Monto</label>
              <br/>
              <input type="number" className="form-control" name="monto" min="0" placeholder="0" step=".01" onChange={handleChange} value={reciboSeleccionado && reciboSeleccionado.monto}/>
              <br/>
              <label>Moneda</label>
              <br/>
              <select name="moneda" className="form-control" onChange={handleChange} value={reciboSeleccionado && reciboSeleccionado.moneda}>
                <option value="MXN">MXN</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <br/>
              <label>Fecha</label>
              <br/>
              <input type="date" name="fecha" className="form-control" onChange={handleChange} value={reciboSeleccionado && reciboSeleccionado.fecha} ></input>
              <br/>
              <label>Comentario</label>
              <br/>
              <input type="text" className="form-control" name="comentario" onChange={handleChange} value={reciboSeleccionado && reciboSeleccionado.comentario}></input>
              <br/>
              <label hidden>Id Usuario</label>
              <br/>
              <input type="text" hidden className="form-control" name="id_usuario" onChange={handleChange} value={reciboSeleccionado && reciboSeleccionado.id_usuario}></input>
              <br/>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"   "}
            <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>{" "}
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalEliminar}>
          <ModalBody>
            Esta seguro de eliminar este registro {reciboSeleccionado && reciboSeleccionado.proveedor} ?
            <div className="form-group">
              
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={()=>peticionDelete()}>Si</button>{"   "}
            <button className="btn btn-secondary" onClick={()=>abrirCerrarModalEliminar()}>No</button>{" "}
          </ModalFooter>
        </Modal>

    </div>

    
  );

  
}

export default App;
