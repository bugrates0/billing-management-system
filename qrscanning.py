#Developed by Bugra Ates
#25.07.2024


import cv2
import numpy as np
from pdf2image import convert_from_bytes
from pyzbar.pyzbar import decode

def extract_qr_from_pdf(file, dpiValue):
        
    qr_codes = []
    
    #Cleaner image as dpi increases
    pages = convert_from_bytes(file, dpi = dpiValue)

    if(len(pages) > 5):
        raise Exception("Too many pages !")
    
    for page in pages:

        #Different coloring settings
        
        #open_cv_image = cv2.cvtColor(np.array(page), cv2.COLOR_RGB2BGR)
        open_cv_image = cv2.cvtColor(np.array(page), cv2.COLOR_RGB2GRAY)
        #_, enhanced_image = cv2.threshold(open_cv_image, 128, 255, cv2.THRESH_BINARY)

        barcode_img_blur = cv2.GaussianBlur(open_cv_image, (15, 1), 3)
    
        decoded_objects = decode(barcode_img_blur)
        
        for obj in decoded_objects:
            qr_codes.append(obj.data.decode('utf-8'))

        return qr_codes

def extract_qr_from_img(file):
    
    qr_codes = []
    
    file_bytes = np.frombuffer(file.read(), np.uint8)

    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    
    if image is None:
        raise Exception("Invalid image file!")
    
    open_cv_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    decoded_objects = decode(open_cv_image)

    for obj in decoded_objects:
            qr_codes.append(obj.data.decode('utf-8'))

    return qr_codes



def process_pdf(file):
    
    dpi_values = [400, 600, 800]
    qr_codes = []

    for dpi in dpi_values:
        print(f"Searching QR: {dpi} dpi")
        qr_codes = extract_qr_from_pdf(file, dpi)
    
        if qr_codes:
            break
    
    if qr_codes:
        print("QR code found.")
        return qr_codes[0]      
    else:
        return "No QR code found."
    
    
def process_img(file):
    qr_codes = []

    qr_codes = extract_qr_from_img(file)
    
    if qr_codes:
        print("QR code found.")
        return qr_codes[0]      
    else:
        return "No QR code found."