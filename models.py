#Developed by Bugra Ates
#25.07.2024

from main import db

# Fatura model
class Archive(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    filename = db.Column(db.String)
    vkntckn = db.Column(db.BigInteger, nullable=False)
    avkntckn = db.Column(db.BigInteger, nullable=False)
    senaryo = db.Column(db.String(40), nullable=False)
    tip = db.Column(db.String(50), nullable=False)
    tarih = db.Column(db.Date, nullable=False)
    no = db.Column(db.String(50), nullable=False)
    ettn = db.Column(db.String(100), nullable=False, unique=True)
    parabirimi = db.Column(db.String(10), nullable=False)
    malhizmettoplam = db.Column(db.Double, nullable=False)
    kdvmatrah = db.Column(db.Double, nullable=False)
    hesaplanankdv = db.Column(db.Double, nullable=False)
    vergidahil = db.Column(db.Double, nullable=False)
    odenecek = db.Column(db.Double, nullable=False)