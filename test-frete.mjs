(async () => {
    try {
        const payload = {
            cepDestino: "96810400",
            psObjeto: 300,
            comprimento: "20",
            largura: "20",
            altura: "20",
            vlDeclarado: "0"
        };
        console.log('Fetching...');
        const res = await fetch('https://10074.hostoo.net.br/webhook/correios-j3d', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const text = await res.text();
        console.log('STATUS:', res.status);
        console.log('RESPONSE:', text);
    } catch (e) {
        console.error(e);
    }
})();
