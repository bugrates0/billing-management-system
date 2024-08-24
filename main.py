#Developed by Bugra Ates
#25.07.2024


from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

#####CORS(app, support_credentials=True) # Security concern, allowed all requests.
#Instead, use this code!
#CORS(app, resources={r"/*": {"origins": "https://your-allowed-domain.com"}}, supports_credentials=True)


db = SQLAlchemy(app)


from routes import write_to_db,upload_file,get_all_archives
   
   
@app.before_request
def create_tables():
    db.create_all()
    


app.add_url_rule('/writeToDb', view_func=write_to_db, methods=['POST'])
app.add_url_rule('/getInfo', view_func=upload_file, methods=['POST'])
app.add_url_rule('/get_all_archives', view_func=get_all_archives, methods=['GET'])

if __name__ == '__main__':
    app.run(debug=True)


 





    