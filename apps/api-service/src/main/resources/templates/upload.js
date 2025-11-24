document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const documentType = document.getElementById('documentType').value;
    const resultDiv = document.getElementById('result');

    if (!fileInput.files.length) {
        resultDiv.textContent = "Selecione um arquivo!";
        return;
    }

    const file = fileInput.files[0];

    // Converter arquivo para Base64
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });

    try {
        const base64File = await toBase64(file);

        const response = await fetch(`http://localhost:8080/api/v1/grota-financiamentos/documents/upload?documentType=${documentType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwYXVsb0BnbWFpbC5jb20iLCJpZCI6NywiaWF0IjoxNzYzODY3ODc2LCJleHAiOjE3NjM4Njg3NzZ9.wdPz6bBhNp2s11n-GrfW-axySWJEe2wxwQ4v8V9sjXs'
            },
            body: JSON.stringify({ file: base64File })
        });

        const data = await response.json();

        if (response.ok) {
            resultDiv.textContent = "Upload realizado com sucesso! ID do documento: " + data.id;
        } else {
            resultDiv.textContent = "Erro: " + (data.message || JSON.stringify(data));
        }
    } catch (error) {
        resultDiv.textContent = "Erro ao processar arquivo: " + error;
    }
});
