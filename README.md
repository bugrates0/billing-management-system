# <h1 align="center"> :scroll: **Billing Management System** :page_with_curl: </h1>

 ###     Bu uygulama, şirketlerin e-arşiv ve e-fatura takiplerini kolaylaştırmak için geliştirilmiştir. 2023 yılından bu yana e-arşiv ve e-fatura gibi e-belgelerde QR kodu zorunluluğu getirilmiştir. Bu QR kodu yapılan işlemle ilgili mali ve tarihsel bilgiler içermektedir. Bu uygulama sayesinde şirketler ellerinde bulunan e-arşiv ve e-faturalarını kolayca bir veritabanında saklayabilecek ve ileri geliştirmelerle birlikte gelir-gider takibini görselleştirme ve analiz etme şansına sahip olabilecektir.

- Uygulamanın backendi Flask(Python) kullanılarak, frontendi ise HTML-CSS-JS kullanılarak geliştirilmiştir. 
- Sisteme yüklenen pdf veya resim dosyalarındaki QR kod ***pyzbar*** kütüphanesi sayesinde okunmaktadır.
- QR kodun okunamadığı dosyalar için sistemi kullanan kişiye manuel girme menüsü açılmaktadır.

___


## :camera: Ekran görüntüleri
<img src="https://github.com/user-attachments/assets/bec18d62-c9aa-496d-8000-f771b2712827" alt="Açıklama" width="800">
___
<img src="https://github.com/user-attachments/assets/949d2978-78dd-41e3-aaff-b2d04e6b38e7" alt="Açıklama" width="800">
___
<img src="https://github.com/user-attachments/assets/ecfccc4e-04a4-4f1b-b51b-90c299b93394" alt="Açıklama" width="800">
___
<img src="https://github.com/user-attachments/assets/a45e02d7-8378-4feb-b531-d7b06bc4ace1" alt="Açıklama" width="800">
___
<img src="https://github.com/user-attachments/assets/02d98ef0-9fee-40ec-b93a-227bb007b78f" alt="Açıklama" width="800">



___

## :file_folder: Kurulum
- Uygulamayı .zip olarak indirin.
- Ana dosyaların bulunduğu klasörü VS Code ile açın.
- **python -m venv .venv** komutuyla bir sanal ortam oluşturun.
- **.venv\Scripts\activate** komutuyla sanal ortamı aktifleştirin
- **pip install -r requirements.txt** komutuyla sanal ortama gerekli kütüphaneleri yükleyin.
- Klasörün içinde .env adında bir dosya oluşturun. İçine aşağıdaki gibi PostgreSQL veritabanı adresini girin.

  SECRET_KEY=super secret key
  
  DATABASE_URL=postgresql://KULLANICIADI:SIFRE@localhost:5432/VERITABANIISMI

- **flask --app main run** komutuyla uygulamayı çalıştırın.
