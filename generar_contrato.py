from flask import Flask, request, jsonify, send_file
from docx import Document

app = Flask(__name__)

def modificar_contrato(nombre, apellidos, FechaIngreso, TipoContrato, cedula, output_path="contrato_modificado.docx"):
    plantilla_path = "IngeSoftHumanResources-1\contrato_plantilla.docx"  # Ruta de tu plantilla
    doc = Document(plantilla_path)

    for paragraph in doc.paragraphs:
        if "{{NOMBRE}}" in paragraph.text:
            paragraph.text = paragraph.text.replace("{{NOMBRE}}", nombre)
        if "{{APELLIDO}}" in paragraph.text:
            paragraph.text = paragraph.text.replace("{{APELLIDO}}", apellidos)
        if "{{FECHA_INGRESO}}" in paragraph.text:
            paragraph.text = paragraph.text.replace("{{FECHA_INGRESO}}", FechaIngreso)
        if "{{TIPO_CONTRATO}}" in paragraph.text:
            paragraph.text = paragraph.text.replace("{{TIPO_CONTRATO}}", TipoContrato)
        if "{{CEDULA}}" in paragraph.text:
            paragraph.text = paragraph.text.replace("{{CEDULA}}", cedula)

    doc.save(output_path)
    print(f"Documento generado: {output_path}")

@app.route('/informacion_empleados', methods=['POST'])
def generar_contrato():
    try:
        data = request.json
        nombre = data.get('nombre')
        apellido = data.get('apellidos')
        fecha_ingreso = data.get('FechaIngreso')
        tipo_contrato = data.get('TipoContrato')
        cedula = data.get('cedula')

        # Validación de datos obligatorios
        if not all([nombre, apellido, fecha_ingreso, tipo_contrato, cedula]):
            return jsonify({"error": "Faltan datos obligatorios"}), 400

        output_path = "contrato_modificado.docx"
        modificar_contrato(nombre, apellido, fecha_ingreso, tipo_contrato, cedula, output_path)

        return send_file(output_path, as_attachment=True)

    except Exception as e:
        return jsonify({"error": f"Ocurrió un error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
