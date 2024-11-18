from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from docx import Document
import os
from typing import Optional

app = FastAPI(debug=True)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],  # Métodos permitidos
    allow_headers=["*"],  # Encabezados permitidos
)

class EmployeeData(BaseModel):
    nombre: Optional[str] 
    apellidos: Optional[str] 
    cedula: Optional[str] 
    telefono: Optional[str]   # Agrega este campo
    
    
    

# def modificar_contrato(nombre, apellidos, FechaIngreso, TipoContrato, cedula, output_path="contrato_modificado.docx"):
#     plantilla_path = "contrato_plantilla.docx"
#     doc = Document(plantilla_path)

#     for paragraph in doc.paragraphs:
#         if "{{NOMBRE}}" in paragraph.text:
#             paragraph.text = paragraph.text.replace("{{NOMBRE}}", nombre)
#         if "{{APELLIDO}}" in paragraph.text:
#             paragraph.text = paragraph.text.replace("{{APELLIDO}}", apellidos)
#         if "{{FECHA_INGRESO}}" in paragraph.text:
#             paragraph.text = paragraph.text.replace("{{FECHA_INGRESO}}", FechaIngreso)
#         if "{{TIPO_CONTRATO}}" in paragraph.text:
#             paragraph.text = paragraph.text.replace("{{TIPO_CONTRATO}}", TipoContrato)
#         if "{{CEDULA}}" in paragraph.text:
#             paragraph.text = paragraph.text.replace("{{CEDULA}}", cedula)

#     doc.save(output_path)
#     print(f"Documento generado: {output_path}")

@app.post("/informacion_empleados")
async def informacion_empleados(data: EmployeeData):
    try:
        print("Solicitud recibida en /informacion_empleados")
        print(f"Datos recibidos: {data.model_dump()}")  # Usa dict() en lugar de model_dump()
        return {
            "message": "Datos recibidos correctamente",
            "data": data.model_dump(),  # Convierte a diccionario para evitar errores de serialización
        }
    except Exception as e:
        print(f"Error interno: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")



# async def generar_contrato(data: EmployeeData):
    
#     print(f"Datos recibidos: {data.model_dump()}")  # Depuración
#     try:
#         output_path = "contrato_modificado.docx"
#         modificar_contrato(
#             nombre=data.nombre,
#             apellidos=data.apellidos,
#             FechaIngreso=data.FechaIngreso,
#             TipoContrato=data.TipoContrato,
#             cedula=data.cedula,
#             output_path=output_path,
#         )
#         print("Contrato generado con éxito.")  # Registro de éxito
#         if not os.path.exists(output_path):
#             raise HTTPException(status_code=500, detail="Error al generar el archivo.")
        
        
#         return FileResponse(
#             output_path,
#             media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
#             filename="contrato_modificado.docx",
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


