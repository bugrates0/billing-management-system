#Developed by Bugra Ates
#25.07.2024

from flask import request, jsonify, render_template
from main import app, db
from models import Archive
import qrscanning
from flask_cors import cross_origin

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}


@app.route('/')
def index():
    return render_template('index.html')


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/writeToDb', methods=['POST'])
####@cross_origin(supports_credentials=True)
def write_to_db():
    
    data = request.get_json()
    
    if data:

        processed_data = {}
        
        for key, value in data.items():
            if key.startswith('kdvmatrah'):
                processed_data['kdvmatrah'] = value
            if key.startswith('hesaplanankdv'):
                processed_data['hesaplanankdv'] = value
            else:
                processed_data[key] = value         
        
        newArchive = Archive(filename = processed_data['filename'] , vkntckn = processed_data['vkntckn'], avkntckn = processed_data['avkntckn'], senaryo = processed_data['senaryo'], tip = processed_data['tip'], tarih = processed_data['tarih'], no = processed_data['no'], ettn = processed_data['ettn'], parabirimi = processed_data['parabirimi'], malhizmettoplam = processed_data['malhizmettoplam'], kdvmatrah = processed_data['kdvmatrah'], hesaplanankdv = processed_data['hesaplanankdv'], vergidahil = processed_data['vergidahil'], odenecek = processed_data['odenecek'])
        db.session.add(newArchive)
        db.session.commit()
        return data, 200
    else:
        response = jsonify({"error": "No JSON data received"})
        return response , 400
    
    
    
    
@app.route('/getQRDetails', methods=['POST'])
#######@cross_origin(supports_credentials=True)
def upload_file():
    
    if 'file' not in request.files:
        return jsonify({'error': 'File not found!'}), 400
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'Please select a file!'}), 400
    
    if file and allowed_file(file.filename):
        
        if(file.mimetype == 'application/pdf'):
            print("PDF File detected.")
            fileAsBytes = file.read()
            try:
                response = qrscanning.process_pdf(fileAsBytes)
            except Exception as e:
                return jsonify({'error': str(e)}), 400
            return response
        
        if (file.mimetype == 'image/jpg' or file.mimetype == 'image/png' or file.mimetype == 'image/jpeg'):
            print("Image File detected.")
            try:
                response = qrscanning.process_img(file)
            except Exception as e:
                return jsonify({'error': str(e)}), 400
            return response
        
    return jsonify({'error': 'Something went wrong!'}), 400


@app.route('/get_all_archives', methods=['GET'])
def get_all_archives():
    
    page = request.args.get('page', 1, type=int)
    per_page = 10  # Sayfa başına gösterilecek kayıt sayısı
    paginated_data = Archive.query.paginate(page=page, per_page=per_page, error_out=False)
    
    return render_template('archives.html', 
                           archives=paginated_data.items, 
                           page=paginated_data.page, 
                           pages=paginated_data.pages)
    
    